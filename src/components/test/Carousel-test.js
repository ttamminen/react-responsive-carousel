import React from 'react';

import sinon, { spy, stub } from 'sinon';
import sinonChai from 'sinon-chai';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import proxyquire from 'proxyquire';

chai.use(chaiEnzyme());
chai.use(sinonChai);

describe("Slider", () => {
	let Carousel;
	let wrapper;
	let instance;
	let window;
	let ReactDOM;
	let domElement;
	let eventBasedElement;

	const onChange = sinon.stub();
	const onClickItem = sinon.stub();
	const onClickThumb = sinon.stub();

	beforeEach(() => {
		eventBasedElement = {
			addEventListener: sinon.stub(),
			removeEventListener: sinon.stub()
		};

		window = {
			...eventBasedElement
		};

		domElement = {
			getElementsByTagName: sinon.stub()
		};

		ReactDOM = {
			findDOMNode: sinon.stub().returns(domElement)
		};

		Carousel = proxyquire.noCallThru().load('../Carousel', {
			'react-dom': ReactDOM,
			// '../cssClasses': sinon.stub(),
			// '../object-assign': sinon.stub(),
			'../windowFacade': window,
			// '../CSSTranslate': sinon.stub(),
			// 'react-easy-swipe': sinon.stub(),
			// './Thumbs': sinon.stub()
        });

		wrapper = shallow(
			<Carousel
				showArrows={true}
				onChange={onChange}
				onClickItem={onClickItem}
				onClickThumb={onClickThumb}
			>
                <div>
                    <img src="assets/1.jpeg" />
                    <p className="legend">Legend 1</p>
                </div>
                <div>
                    <img src="assets/2.jpeg" />
                    <p className="legend">Legend 2</p>
                </div>
                <div>
                    <img src="assets/3.jpeg" />
                    <p className="legend">Legend 3</p>
                </div>
                <div>
                    <img src="assets/4.jpeg" />
                    <p className="legend">Legend 4</p>
                </div>
                <div>
                    <img src="assets/5.jpeg" />
                    <p className="legend">Legend 5</p>
                </div>
                <div>
                    <img src="assets/6.jpeg" />
                    <p className="legend">Legend 6</p>
                </div>
            </Carousel>
        );
		instance = wrapper.instance();
	});

	afterEach(() => {
		window = null;
		domElement = null;
		eventBasedElement = null;
		ReactDOM = null;

		onChange.reset();
		onClickItem.reset();
		onClickThumb.reset();
	});

	it('should have initial state as selectedItem = 0 and hasMount = false', () => {
		expect(wrapper.state()).to.be.deep.equal({
			selectedItem: 0,
			hasMount: false
		});
	});

	context('default props', () => {
		let defaultProps;

		beforeEach(() => {
			defaultProps = Carousel.getDefaultProps();
		});

		const expectedDefaultProps = {
            showIndicators: true,
            showArrows: true,
            showStatus: true,
            showThumbs: true,
            selectedItem: 0,
            axis: 'horizontal'
        };

		Object.keys(expectedDefaultProps).forEach(key => {
        	it(`should start with ${key} as ${expectedDefaultProps[key]}`, () => {
    			expect(defaultProps[key]).to.be.equal(expectedDefaultProps[key]);
    		});
        })
	});

	context('#componentWillReceiveProps', () => {
		context('if selected item changes', () => {
			beforeEach(() => {
				sinon.stub(instance, 'updateSizes');
				sinon.stub(instance, 'setState');

				instance.componentWillReceiveProps({
					selectedItem: 10
				});
			});

			it('should call this.updateSizes', () => {
				expect(instance.updateSizes).to.have.been.calledOnce;
			});

			it('should call this.setState with the new selectedItem', () => {
				expect(instance.setState).to.have.been.calledOnce;
				expect(instance.setState).to.have.been.calledWith({
					selectedItem: 10
				});
			});

		});
	});

	context('#componentWillMount', () => {
		beforeEach(() => {
			instance.componentWillMount();
		});

		it('should add a resize listener bound to updateSizes', () => {
			expect(window.addEventListener).to.have.been.calledWith('resize', instance.updateSizes);
		});

		it('should add a DOMContentLoad listener bound to updateSizes', () => {
			expect(window.addEventListener).to.have.been.calledWith('DOMContentLoaded', instance.updateSizes);
		});
	});

	context('#componentWillUnmount', () => {
		beforeEach(() => {
			instance.componentWillUnmount();
		});

		it('should remove the resize listener bound to updateSizes', () => {
			expect(window.removeEventListener).to.have.been.calledWith('resize', instance.updateSizes)
		});

		it('should remove the DOMContentLoad listener bound to updateSizes', () => {
			expect(window.removeEventListener).to.have.been.calledWith('DOMContentLoaded', instance.updateSizes);
		});
	});

	context('#componentDidMount', () => {
		beforeEach(() => {
			sinon.stub(instance, 'updateSizes');
			domElement.getElementsByTagName.returns([eventBasedElement]);

			instance.componentDidMount();
		});

		it('should call updateSizes', () => {
			expect(instance.updateSizes).to.have.been.calledOnce;
		});

		it('should set this.isHorizontal', () => {
			expect(instance.isHorizontal).to.be.true;
		});

		it('should add a listener to the load event of the first image bound to this.setMountState', () => {
			expect(ReactDOM.findDOMNode).to.have.been.calledWith(instance.item0);
			expect(domElement.getElementsByTagName).to.have.been.calledWith('img');
			expect(eventBasedElement.addEventListener).to.have.been.calledWith('load', instance.setMountState);
		})
	});

	context('#updateSizes', () => {
		beforeEach(() => {
			ReactDOM.findDOMNode.returns({
				clientWidth: 500,
				clientHeight: 300
			});
		});

		context('if it is horizontal', () => {
			beforeEach(() => {
			    instance.isHorizontal = true;
				instance.updateSizes();
			});

			it('should define itemSize as the clientWidth of the first item', () => {
				expect(ReactDOM.findDOMNode).to.have.been.calledWith(instance.item0);
				expect(instance.itemSize).to.be.equal(500);
			});

			it('should define wrapperSize as the itemSize times the number of children', () => {
				expect(instance.wrapperSize).to.be.equal(500 * instance.props.children.length);
			});
		});

		context('if it is vertical', () => {
			beforeEach(() => {
			    instance.isHorizontal = false;
				instance.updateSizes();
			});

			it('should define itemSize as the clientHeight of the first item', () => {
				expect(ReactDOM.findDOMNode).to.have.been.calledWith(instance.item0);
				expect(instance.itemSize).to.be.equal(300);
			});

			it('should define wrapperSize as the itemSize', () => {
				expect(instance.wrapperSize).to.be.equal(300);
			});
		});
	});

	context('#setMountState', () => {
		beforeEach(() => {
			sinon.stub(instance, 'setState');
			sinon.stub(instance, 'updateSizes');
			sinon.stub(instance, 'forceUpdate');

			instance.setMountState();
		});

		it('should set state hasMount: true', () => {
			expect(instance.setState).to.have.been.calledOnce;
			expect(instance.setState).to.have.been.calledWith({hasMount: true});
		});

		it('should call updateSizes', () => {
			expect(instance.updateSizes).to.have.been.calledOnce;
		});

		it('should call forceUpdate', () => {
			expect(instance.forceUpdate).to.have.been.calledOnce;
		});
	});

	context('#handleClickItem', () => {
		it('should call onClickItem handler');
		it('should set a new selected item if different from the previous');
	});

	context('#handleOnChange', () => {
		it('should call onChange handler');
	});

	context('#handleClickThumb', () => {
		it('should call onClickThumb handler');
		it('should call select item with the new item index');
	});

	context('#onSwipeStart', () => {
		it('should set state swiping: true');
	});

	context('#onSwipeEnd', () => {
		it('should set state swiping: false');
	});

	context('#onSwipeMove', () => {
		it('should set new css position to the list');
		it(`can't pass the left boundaries`);
		it(`can't pass the right boundaries`);
	});

	context('#decrement', () => {
		it('should call moveTo with the item before');
	});

	context('#increment', () => {
		it('should call moveTo with the item after');
	});

	context('#moveTo', () => {
		it('should set the new selected item to the state');
		it(`can't go less than 0`);
		it(`can't go pass the length`);
	});

	context('#changeItem', () => {
		it('should select the new item');
	});

	context('#selectItem', () => {
		it('should set the new selected item to the state');
		it('should call handleOnChange with the selected index and the node');
	});

	context('#renderItems', () => {
		it('should render each item inside a li');
		it('should add a class to selected item');
	});

	context('#renderControls', () => {
		it('should render the dots for navigating to each children');
	});

	context('#renderStatus', () => {
		it('should render the status with the current item of the total');
	});

	context('#renderThumbs', () => {
		it('should render the thumbs with links to navigate to each children');
	});

	context('#render', () => {
		it('should render the carousel');
		it('should render the arrows');
		it('should render the swipe area');
		it('should render the controls');
		it('should render the status');
		it('should render the thumbs');
	});

});

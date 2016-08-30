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

	const onChange = sinon.stub();
	const onClickItem = sinon.stub();
	const onClickThumb = sinon.stub();

	beforeEach(() => {
		window = {
			addEventListener: sinon.stub(),
			removeEventListener: sinon.stub()
		};

		Carousel = proxyquire.noCallThru().load('../Carousel', {
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
});

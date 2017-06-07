// Type definitions for react-responsive-carousel 3.1.9
// Project: https://github.com/leandrowd/react-responsive-carousel/
// Definitions by: Tatu Tamminen <https://github.com/ttamminen>

import * as React from "react";

type Axis = "horizontal" | "vertical";

interface CarouselProps {
    showArrows?: boolean;
    showStatus?: boolean;
    showIndicators?: boolean;
    showThumbs?: boolean;
    infiniteLoop?: boolean;
    selectedItem?: number;
    axis?: Axis;
    onChange?: (index: number, item: React.ReactNode) => void;
    onClickItem?: (index: number, item: React.ReactNode) => void;
    onClickThumb?: (index: number, item: React.ReactNode) => void;
    width?: string;
    useKeyboardArrows?: boolean;
    autoPlay?: boolean;
    stepOnHover?: boolean;
    interval?: number;
    transitionTime?: number;
    swipeScrollTolerance?: number;
    dynamicHeight?: boolean;
    emulateTouch?: boolean;
    statusFormatter?: (current: number, total: number) => string;
}

interface ThumbsProps {
    transitionTime?: number;
    selectedItem: number;
}

declare class Carousel extends React.Component<CarouselProps, any> {
    constructor(props: CarouselProps, context: any);
    render(): JSX.Element;
}

declare class Thumbs extends React.Component<ThumbsProps, any> {
    constructor(props: ThumbsProps, context: any);
    render(): JSX.Element
}

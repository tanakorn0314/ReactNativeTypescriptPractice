import React, { Component } from 'react';
import {
    ScrollView,
    ViewStyle,
    LayoutChangeEvent,
    View,
    NativeSyntheticEvent,
    NativeScrollEvent,
    PanResponder
} from 'react-native';
import { DotIndicator } from './DotIndicator';
import { PageScrollEvent, PageSelectedEvent } from './Interfaces/IViewPager';

const VIEWPAGER_REF = 'viewPager';
const INDICATOR_REF = 'indicator';

export class ViewPager extends Component<Props, State> {

    static defaultProps = {
        initialPage: 0,
        keyboardOnDismiss: 'on-drag',
        hideIndicator: false,
        autoPlayEnabled: false,
        autoPlayInterval: 3500
    };

    private panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => this.setScrollState(ScrollState.dragging),
        onPanResponderMove: () => undefined,
        onPanResponderRelease: () => this.setScrollState(ScrollState.settling),
        onPanResponderTerminate: () => undefined,
        onPanResponderTerminationRequest: () => true
    });

    constructor(props: Props) {
        super(props);
        let pageCount = React.Children.count(this.props.children);
        this.state = {
            height: 0,
            width: 0,
            pageCount: pageCount,
            currentPage: Math.min(Math.max(0, this.props.initialPage), pageCount - 1),
            preScrollX: undefined,
            scrollState: ScrollState.idle
        };
    }

    componentDidMount() {
        if (this.props.autoPlayEnabled)
            setInterval(() => {
                this.toNextPage();
            }, this.props.autoPlayInterval);
    }

    render() {
        let initialPage = this.state.currentPage;
        let props = {};
        props = Object.assign(props, this.panResponder.panHandlers);
        let containerStyle: ViewStyle = {
            ...this.props.style,
            height: this.props.style && this.props.style.height ? this.props.style.height : '100%'
        };
        return (
            <View style={containerStyle}>
                <ScrollView
                    ref={VIEWPAGER_REF}
                    {...props}
                    horizontal
                    pagingEnabled
                    scrollEnabled
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    scrollsToTop={false}
                    decelerationRate={0.9}
                    scrollEventThrottle={8}
                    overScrollMode='never'
                    alwaysBounceHorizontal={true}
                    contentOffset={{x: this.state.width * initialPage, y: 0}}
                    keyboardDismissMode={this.props.keyboardOnDismiss}
                    onScroll={this.onScroll}
                    onLayout={this.onScrollViewLayout}
                    children={this.renderOverrideChildren()}
                />
                {this.props.hideIndicator ?
                    undefined :
                    <DotIndicator
                        ref={INDICATOR_REF}
                        pageCount={this.state.pageCount}
                        dotStyle={this.props.indicatorStyle}
                        selectedDotStyle={this.props.selectedIndicatorStyle}
                        dotSpace={this.props.dotSpace}
                        selectedDotSpace={this.props.selectedDotSpace}
                        initialPage={initialPage}
                    />
                }
            </View>
        );
    }

    private renderOverrideChildren = () => {
        if (this.state.height === 0 || this.state.width === 0)
            return undefined;
        return React.Children.map(this.props.children, (child: any) => {
            if (!child) return undefined;
            console.log(child.props);
            let newProps = {
                ...child.props,
                style: [child.props.style, {
                    width: this.state.width,
                    height: this.state.height,
                    position: undefined
                }
                ],
                collapse: false
            };
            if (child.type && child.type.displayName && (child.type.displayName !== 'RCTView') && (child.type.displayName !== 'View'))
                console.warn('Each ViewPager child must be a <View>. Was ' + child.type.displayName);
            return React.createElement(child.type, newProps);
        });
    }

    private onScrollViewLayout = (event: LayoutChangeEvent) => {
        let { width, height } = event.nativeEvent.layout;
        this.setState({ width, height }, () => this.setPageWithoutAnimation(this.state.currentPage));
    }

    private onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        let { x } = event.nativeEvent.contentOffset;
        let offset: number, position: number = Math.floor(x / this.state.width);
        if (x === this.state.preScrollX) return;
        offset = x / this.state.width - position;

        if (this.props.onPageScroll) {
            this.props.onPageScroll({ offset, position });
        }

        if (offset === 0) {
            let indicator = this.refs[INDICATOR_REF] as DotIndicator;
            if (indicator) indicator.onPageSelected({ position });
            if (this.props.onPageScrollStateChanged) this.props.onPageSelected({ position });
        }

    }

    private toNextPage = () => {
        let nextPage = (this.state.currentPage + 1) % this.state.pageCount;
        this.setPage(nextPage);
    }

    private setPage = (selectedPage: number) => {
        this.setState({ currentPage: selectedPage });
        let viewPager = this.refs[VIEWPAGER_REF] as ScrollView;
        viewPager.scrollTo({x: this.state.width * selectedPage});
    }

    private setPageWithoutAnimation = (selectedPage: number) => {
        this.setState({ currentPage: selectedPage });
        let viewPager = this.refs[VIEWPAGER_REF] as ScrollView;
        viewPager.scrollTo({x: this.state.width * selectedPage, animated: false});
    }

    private setScrollState = (newState: ScrollState) => {
        this.setState({
            scrollState: newState
        });
    }
}

interface Props {
    style?: ViewStyle;
    initialPage?: number;
    keyboardOnDismiss?: 'none' | 'interactive' | 'on-drag';
    hideIndicator?: boolean;
    dotSpace?: number;
    selectedDotSpace?: number;
    indicatorStyle?: ViewStyle;
    selectedIndicatorStyle?: ViewStyle;
    autoPlayEnabled?: boolean;
    autoPlayInterval?: number;
    onPageScroll?: (event: PageScrollEvent) => void;
    onPageSelected?: (page: PageSelectedEvent) => void;
    onPageScrollStateChanged?: (state: ScrollState) => void;
}

interface State {
    width: number;
    height: number;
    pageCount: number;
    currentPage: number;
    preScrollX: number;
    scrollState: ScrollState;
}

export enum ScrollState {
    idle = 'idle',
    settling = 'settling',
    dragging = 'dragging'
}

import React, { Component } from 'react';
import {
    ScrollView,
    ViewStyle,
    NativeSyntheticEvent,
    NativeScrollEvent,
    LayoutChangeEvent,
    View,
    PanResponder,
    StyleProp,
    Platform,
    ViewPagerAndroid,
    ViewPagerAndroidOnPageSelectedEventData,
    ViewPagerAndroidOnPageScrollEventData
} from 'react-native';
import { DotIndicator } from './DotIndicator';

const VIEWPAGER_REF = 'view_pager';
const INDICATOR_REF = 'indicator';
export class ViewPager extends Component<Props, State> {

    static defaultProps = {
        initialPage: 0,
        showIndicator: false,
        autoPlayEnabled: false,
        autoPlayInterval: 3500,
        keyboardDismissMode: 'on-drag'
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
        let pageCount = this.props.children ? React.Children.count(this.props.children) : 0;
        this.state = {
            width: 0,
            height: 0,
            currentPage: Math.min(Math.max(0, props.initialPage), pageCount),
            pageCount: pageCount,
            scrollState: ScrollState.idle,
            autoPlayId: undefined
        };
    }

    componentDidMount() {
        if (this.props.autoPlayEnabled)
            this.startAutoPlay();
    }

    componentWillUnmount() {
        if (this.props.autoPlayEnabled)
            this.stopAutoPlay();
    }

    render() {
        let style = this.props.style as ViewStyle;
        let styles = {
            ...style,
            height: style && style.height ? style.height : '100%'
        };

        let viewPager = Platform.OS === 'ios' ? this.renderViewPagerIOS() : this.renderViewPagerAndroid();
        return (
            <View style={styles}>
                {viewPager}
                <DotIndicator
                    ref={INDICATOR_REF}
                    pageCount={this.state.pageCount}
                    dotStyle={this.props.dotStyle}
                    selectedDotStyle={this.props.selectedDotStyle}
                />
            </View>
        );
    }

    private renderViewPagerIOS = () => {
        let props = {};
        props = Object.assign(props, this.panResponder.panHandlers);
        return (
            <ScrollView
                ref={VIEWPAGER_REF}
                {...props}
                horizontal
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                onScroll={this.onScroll}
                onLayout={this.onScrollViewLayout}
                children={this.renderOverrideChildren()}
                keyboardDismissMode={this.props.keyboardDismissMode}
            />
        );
    }

    private renderViewPagerAndroid = () => {
        return (
            <ViewPagerAndroid
                ref={VIEWPAGER_REF}
                style={{ flex: 1 }}
                scrollEnabled={true}
                onPageScroll={this.onScrollAndroid}
                onPageSelected={this.onPageSelectedAndroid}
                children={this.props.children}
                key={this.props.children ? React.Children.count(this.props.children) : 0}
                keyboardDismissMode={this.props.keyboardDismissMode}
            />
        );
    }

    private onScrollViewLayout = (e: LayoutChangeEvent) => {
        let { width, height } = e.nativeEvent.layout;
        this.setState({
            width: width,
            height: height
        }, () => {
            this.setPageWithoutAnimation(this.props.initialPage);
        });
    }

    private renderOverrideChildren = () => {
        if (this.state.height === 0 || this.state.width === 0)
            return undefined;
        return React.Children.map(this.props.children, (child: any) => {
            if (!child) return undefined;
            let newProps = {
                ...child.props,
                width: this.state.width,
                height: this.state.height
            };
            if (child.type && child.type.displayName &&
                child.type.displayName !== 'RCTView' && child.type.displayName !== 'View')
                console.warn('Each ViewPager Child must be a <View>, was ', child.type.displayName);
            return React.createElement(child.type, newProps);
        });
    }

    private onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        let { x } = event.nativeEvent.contentOffset;
        let offset: number, position: number = Math.floor(x / this.state.width);
        offset = x / this.state.width - position;

        if (offset === 0) {
            this.moveIndicator(position);
            this.setScrollState(ScrollState.idle);
            this.setState({ currentPage: position });

            if (this.props.onPageChanged)
                this.props.onPageChanged(position);
        }
    }

    private onScrollAndroid = (event: NativeSyntheticEvent<ViewPagerAndroidOnPageScrollEventData>) => {
        let { offset } = event.nativeEvent;
        if (offset === 0)
            this.setScrollState(ScrollState.idle);
        else
            this.setScrollState(ScrollState.dragging);
    }

    private onPageSelectedAndroid = (event: NativeSyntheticEvent<ViewPagerAndroidOnPageSelectedEventData>) => {
        let { position } = event.nativeEvent;
        this.moveIndicator(position);
        this.setScrollState(ScrollState.idle);
        this.setState({ currentPage: position });

        if (this.props.onPageChanged)
            this.props.onPageChanged(position);
    }

    private toNextPage = () => {
        let nextPage = (this.state.currentPage + 1) % this.state.pageCount;
        this.setPage(nextPage);
    }

    private setPageWithoutAnimation = (selectedPage: number) => {
        if (selectedPage < 0 || selectedPage >= this.state.pageCount)
            return;
        this.moveIndicator(selectedPage);
        this.setState({ currentPage: selectedPage });
        if (Platform.OS === 'ios') {
            let viewPager = this.refs[VIEWPAGER_REF] as ScrollView;
            viewPager.scrollTo({ x: this.state.width * selectedPage, animated: false });
        } else {
            let viewPager = this.refs[VIEWPAGER_REF] as ViewPagerAndroid;
            viewPager.setPageWithoutAnimation(selectedPage);
        }
    }

    private setPage = (selectedPage: number) => {
        if (selectedPage < 0 || selectedPage > this.state.pageCount - 1)
            return;
        this.moveIndicator(selectedPage);
        this.setState({ currentPage: selectedPage });

        if (Platform.OS === 'ios') {
            let viewPager = this.refs[VIEWPAGER_REF] as ScrollView;
            viewPager.scrollTo({ x: this.state.width * selectedPage });
        } else {
            let viewPager = this.refs[VIEWPAGER_REF] as ViewPagerAndroid;
            viewPager.setPage(selectedPage);
        }
    }

    private setScrollState = (newState: ScrollState) => {
        this.setState({
            scrollState: newState
        });
        switch (newState) {
            case ScrollState.dragging:
                this.stopAutoPlay();
                return;
            case ScrollState.settling:
                this.startAutoPlay();
                return;
            case ScrollState.idle:
                this.startAutoPlay();
                return;
            default: return;
        }
    }

    private startAutoPlay = () => {
        if (!this.state.autoPlayId) {
            let autoPlayId = setInterval(() => this.toNextPage(), this.props.autoPlayInterval);
            this.setState({ autoPlayId: autoPlayId });
        }
    }

    private stopAutoPlay = () => {
        if (this.state.autoPlayId) {
            clearInterval(this.state.autoPlayId);
            this.setState({
                autoPlayId: undefined
            });
        }
    }

    private moveIndicator = (selectedPage: number) => {
        let indicator = this.refs[INDICATOR_REF] as DotIndicator;
        if (indicator)
            indicator.onPageSelected(selectedPage);
    }
}

interface Props {
    style?: StyleProp<ViewStyle>;
    dotStyle?: StyleProp<ViewStyle>;
    selectedDotStyle?: StyleProp<ViewStyle>;
    initialPage?: number;
    showIndicator?: boolean;
    autoPlayEnabled?: boolean;
    autoPlayInterval?: number;
    keyboardDismissMode?: 'none' | 'on-drag';
    onPageChanged?: ((selectedPage: number) => void);
}

interface State {
    width: number;
    height: number;
    currentPage: number;
    pageCount: number;
    scrollState: ScrollState;
    autoPlayId: number;
}

export enum ScrollState {
    idle = 'idle',
    settling = 'settling',
    dragging = 'dragging'
}
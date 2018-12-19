import React, { Component } from 'react';
import {
    View, StyleSheet, ViewStyle, StyleProp
} from 'react-native';

export class DotIndicator extends Component<Props, State> {

    static defaultProps = {
        initialPage: 0
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            currentPage: this.props.initialPage
        };
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return this.state.currentPage !== nextState.currentPage ||
            this.props.pageCount !== nextProps.pageCount ||
            this.props.dotStyle !== nextProps.dotStyle ||
            this.props.selectedDotStyle !== nextProps.selectedDotStyle;
    }

    render() {
        const DEFAULT_DOT_RADIUS = 6;
        let { pageCount, hideSingle } = this.props;
        let dotStyle = this.props.dotStyle as ViewStyle;
        let selectedDotStyle = this.props.selectedDotStyle as ViewStyle;
        if (pageCount === 0 || (hideSingle && pageCount === 1)) return undefined;
        let dotsView = [];
        for (let i = 0; i < pageCount; i++) {
            let isSelected = this.state.currentPage === i;
            let dotWidth = dotStyle && dotStyle ? dotStyle.width as number : DEFAULT_DOT_RADIUS;
            let selectedDotWidth = selectedDotStyle && selectedDotStyle.width ? selectedDotStyle.width as number : DEFAULT_DOT_RADIUS;

            let overrideDotStyle: ViewStyle = {
                ...dotStyle,
                width: dotWidth,
                height: dotWidth,
                borderRadius: dotWidth / 2,
                margin: dotWidth / 2
            };
            let overrideSelectedDotStyle: ViewStyle = {
                ...selectedDotStyle,
                width: selectedDotWidth,
                height: selectedDotWidth,
                borderRadius: selectedDotWidth / 2,
                margin: selectedDotWidth / 2
            };
            dotsView.push(
                <View
                    key={i}
                    style={isSelected ?
                        [{ backgroundColor: 'black' }, overrideSelectedDotStyle] :
                        [{ backgroundColor: 'white' }, overrideDotStyle]}
                />
            );
        }
        return (
            <View style={styles.container}>
                {dotsView}
            </View>
        );
    }

    onPageSelected = (selectedPage: number) => {
        this.setState({
            currentPage: selectedPage
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 10
    }
});

interface Props {
    pageCount: number;
    hideSingle?: boolean;
    initialPage?: number;
    dotStyle?: StyleProp<ViewStyle>;
    selectedDotStyle?: StyleProp<ViewStyle>;
}

interface State {
    currentPage: number;
}
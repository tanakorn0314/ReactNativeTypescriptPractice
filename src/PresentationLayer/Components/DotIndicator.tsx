import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    ViewStyle
} from 'react-native';
import { PageSelectedEvent } from './Interfaces/IViewPager';

const DEFAULT_DOT_RADIUS = 6;

export class DotIndicator extends Component<Props, State> {

    static defaultProps = {
        initialPage: 0,
        hideSingle: false
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            currentPage: props.initialPage
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.currentPage !== nextState.currentPage ||
                this.props.pageCount !== nextProps.pageCount ||
                this.props.dotStyle !== nextProps.dotStyle ||
                this.props.selectedDotStyle !== nextProps.selectedDotStyle;
    }

    render() {
        let { pageCount, dotStyle, dotSpace, selectedDotStyle, selectedDotSpace } = this.props;
        if (pageCount < 0 || (this.props.hideSingle && pageCount === 1)) return undefined;

        const dotWidth: number = dotStyle && dotStyle.width ? parseInt(dotStyle.width.toString(), 0) : DEFAULT_DOT_RADIUS;
        const selectedDotWidth: number = selectedDotStyle && selectedDotStyle.width ?
        parseInt(selectedDotStyle.width.toString(), 0) : DEFAULT_DOT_RADIUS;

        let dotStyleOverride: ViewStyle = {
            ...dotStyle,
            width: dotWidth,
            height: dotWidth,
            borderRadius: dotWidth / 2,
            margin: !!dotSpace ? dotSpace / 2 : dotWidth / 2
        };

        let selectedDotStyleOverride: ViewStyle = {
            ...selectedDotStyle,
            width: selectedDotWidth,
            height: selectedDotWidth,
            borderRadius: selectedDotWidth / 2,
            margin: !!selectedDotSpace ? selectedDotSpace / 2 : selectedDotWidth / 2
        };

        let dotsView = [];
        for (let i = 0; i < pageCount; i++) {
            let isSelected = i === this.state.currentPage;
            dotsView.push(
                <View
                    key={i}
                    style={[styles.dot,
                        isSelected ? styles.selectedDot : undefined,
                        isSelected ? selectedDotStyleOverride : dotStyleOverride]}
                />
            );
        }
        return (
            <View style={styles.container}>
                {dotsView}
            </View>
        );
    }

    onPageSelected = (e: PageSelectedEvent) => {
        console.log('selectPage = ' , e.position);
        this.setState({
            currentPage: e.position
        });
    }
}

interface Props {
    pageCount: number;
    initialPage?: number;
    hideSingle?: boolean;
    dotStyle?: ViewStyle;
    dotSpace?: number;
    selectedDotStyle?: ViewStyle;
    selectedDotSpace?: number;
}

interface State {
    currentPage: number;
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 10,
        left: 0,
        right: 0
    },
    dot: {
        backgroundColor: '#BBBBBB'
    },
    selectedDot: {
        backgroundColor: 'white'
    }
});
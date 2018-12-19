import React from 'react';
import {
    View,
    Text,
    ViewStyle,
    StyleProp
} from 'react-native';
import { ViewPager } from '../../../../Components/ViewPager';
import { styles } from '../../../../Styles/screens/MainViewStyle';

export class MainView extends React.Component {
    render() {
        const itemStyle: StyleProp<ViewStyle> = {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        };
        return (
            <View style={styles.container}>
                <ViewPager
                    style={{ height: '50%' }}
                    showIndicator
                    autoPlayEnabled
                >
                    <View style={[itemStyle, { backgroundColor: 'red' }]}><Text>1</Text></View>
                    <View style={[itemStyle, { backgroundColor: 'blue' }]}><Text>2</Text></View>
                    <View style={[itemStyle, { backgroundColor: 'green' }]}><Text>3</Text></View>
                </ViewPager>
                <View style={{ flex: 1 }}>
                    <Text>Content</Text>
                </View>
            </View>
        );
    }
}

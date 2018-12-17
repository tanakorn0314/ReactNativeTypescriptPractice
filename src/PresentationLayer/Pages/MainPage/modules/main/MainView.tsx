import React from 'react';
import {
    View,
    Text,
    ScrollView
} from 'react-native';
import { styles } from '../../../../Styles/screens/MainViewStyle';

export class MainView extends React.Component {
    private data = [1, 2, 3];
    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    pagingEnabled={true}
                    showsVerticalScrollIndicator={false}
                    horizontal>
                    {this.renderContents()}
                </ScrollView>
            </View>
        );
    }

    private renderContents = () => this.data.map((d) => {
        return (
            <View>
                <Text style={styles.textSubTitle}>{d}</Text>
            </View>
        );
    })
}

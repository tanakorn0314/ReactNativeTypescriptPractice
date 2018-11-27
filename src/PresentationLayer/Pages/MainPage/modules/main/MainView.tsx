import React from 'react';
import {
    View,
    Text
} from 'react-native';
import { styles } from '../../../../Styles/ViewStyles';

export class MainView extends React.Component{
    render(){
        return(
            <View style = { styles.contaner }>
                <Text>
                    12345
                </Text>
            </View>
        )
    }
}
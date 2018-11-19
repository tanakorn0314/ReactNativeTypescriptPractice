import * as React from 'react';
import {Button,View,StyleSheet,Text} from 'react-native';
import {styles} from './ViewStyles';

class Hello extends React.Component<Props,State>{

    constructor(props:Props){
        super(props);
        this.state = {
            name: '',
            level: ''
        }
    }

    render(){

        const {name} = this.props;

        return(
            <View>
                <Text style={styles.redText}>Hello! {name}</Text>
            </View>
        );
    }
}

export default Hello;

interface Props{
    name: string;
}

interface State{
    name: string;
    level: string;
}
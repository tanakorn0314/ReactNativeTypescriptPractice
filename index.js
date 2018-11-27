/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Navigation } from 'react-native-navigation';

Navigation.registerComponent('app',() => App);
Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            component: {
                name: 'app'
            }
        }
    })
})
// AppRegistry.registerComponent(appName, () => App);

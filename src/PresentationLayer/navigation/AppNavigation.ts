import { Navigation } from 'react-native-navigation';
import { Screens } from './Screens';

export class AppNavigation {
    static setRoot(){
        Navigation.setRoot({
            root: {
                component: {
                  name: Screens.MAIN_SCREEN
                }
            }
        });
    }
}
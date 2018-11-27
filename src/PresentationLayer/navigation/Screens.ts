import { Navigation } from 'react-native-navigation';
import { MainView } from '../Pages/MainPage/modules/main/MainView';

export class Screens {
    static readonly MAIN_SCREEN = "MAIN_SCREEN";

    static registerScreens() {
        Navigation.registerComponent(Screens.MAIN_SCREEN, () => MainView)
    }
}
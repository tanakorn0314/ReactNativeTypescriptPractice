import { Navigation } from 'react-native-navigation';
import { Screens } from './PresentationLayer/navigation/Screens';
import { AppNavigation } from './PresentationLayer/navigation/AppNavigation';

export default class App {
  static start() {
    App.init();
  }

  private static async init() {
    Screens.registerScreens();
    Navigation.events().registerAppLaunchedListener(async () => {
      AppNavigation.setRoot()
    })
  }

}
import Hello from './PresentationLayer/Hello';
import { Navigation } from 'react-native-navigation';

export default class App {
  static start() {
    App.init();
  }

  private static async init() {
    Navigation.registerComponent('app', () => Hello);
    Navigation.events().registerAppLaunchedListener(() => {
      Navigation.setRoot({
        root: {
          component: {
            name: 'app'
          }
        }
      })
    })
  }

}
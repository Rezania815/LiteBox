// @flow
import { AsyncStorage } from 'react-native'
import { Navigation } from 'react-native-navigation'


import Provider       from './utils/MobxRnnProvider';
import Stores         from './stores';

import { registerScreens } from './screens';
registerScreens(Stores, Provider);



AsyncStorage.getItem('firstVisit', (err, val) => {
  if(err) return alert(err)
  //val = 'no'
  if(val == 'no') {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'fc.Main', 
        navigatorStyle: {
            navBarHidden: true
        },
        navigatorButtons: {} 
      },
      animationType: 'slide-down' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
    });
  } else {
    AsyncStorage.setItem('firstVisit', 'no')
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'fc.IntroSwiper',
        navigatorStyle: {
            navBarHidden: true
        },
        navigatorButtons: {} 
      },
      passProps: {
          first_visit: true
      },
      animationType: 'slide-down' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
    });
  }
})


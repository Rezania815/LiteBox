// @flow

import { Platform } from 'react-native';
import { observable, action } from 'mobx';
import { persist } from 'mobx-persist'



class Store {
  @observable rootNavigator = null; // so we can nagigate from DRAWER

  @observable isAndroid = Platform.OS === 'android';
  @observable isIOS     = Platform.OS === 'ios';

  @observable currentTab = 'homeTab'

  @observable isFirstVisit = true

  @observable isLoadingAppData = true

  darkTheme = {
    background: '#303030',
    cardBackground: '#424242',
    footerBackground: '#212121',
    headerBackground: '#212121'
  }
  

  @persist @observable isDarkTheme = false

  @persist @observable isPro = false

  @persist @observable fontSizeScale = 1

  @observable purchaseDetails = {}

  @observable serverURL = 'http://ar-flashcard.herokuapp.com'

  @persist @observable appVersion = '1.2'
  
}

export default new Store();

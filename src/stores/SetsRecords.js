// @flow

import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';
import { AsyncStorage } from 'react-native'
class Store {
   @observable Sets = []
}

export default new Store();

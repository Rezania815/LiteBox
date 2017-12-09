// @flow

import { create } from 'mobx-persist';
import { AsyncStorage } from 'react-native';

import App     from './App';
import Account from './Account';
import SetsRecords from './SetsRecords'
import AppData from './AppData'


const hydrate = create({ storage: AsyncStorage, jsonify: true });

const stores = {
  App,
  Account,
  SetsRecords,
  AppData
}

/// you can hydrate stores here with mobx-persist
hydrate('App', stores.App);



export default {
  ...stores
};

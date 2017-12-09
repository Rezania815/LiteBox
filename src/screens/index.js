// @flow

import { Navigation } from 'react-native-navigation';

import Main from './Main';
import SetScreen from './SetScreen'
import MatchGame from './MatchGame'
import GroupScreen from './GroupScreen'
import QuizScreen from './QuizScreen'
import LearnCardView from './LearnSet/LearnCardView'
import Stages from './LearnSet/Stages'
import AddGroupScreen from './AddGroupScreen'
import AddSetScreen from './AddSetScreen'
import CardsScreen from './CardsScreen'
import ImageViewer from './ImageViewer'
import GroupDetailsScreen from './Store/GroupDetailsScreen' //for store
import UpgradeScreen from './UpgradeScreen'
//import SendToStore from './UpgradeScreen'
import AboutScreen from './AboutScreen'
import IntroSwiper from './IntroSwiper'

export function registerScreens(store: {}, Provider: {}) {
  Navigation.registerComponent('fc.Main',     () => Main, store, Provider);
  Navigation.registerComponent('fc.GroupScreen',     () => GroupScreen, store, Provider);
  Navigation.registerComponent('fc.SetScreen',     () => SetScreen, store, Provider);
  Navigation.registerComponent('fc.MatchGame',     () => MatchGame, store, Provider);
  Navigation.registerComponent('fc.QuizScreen',     () => QuizScreen, store, Provider);
  Navigation.registerComponent('fc.LearnCardView',     () => LearnCardView, store, Provider);
  Navigation.registerComponent('fc.Stages',     () => Stages, store, Provider);
  Navigation.registerComponent('fc.AddGroupScreen',     () => AddGroupScreen, store, Provider);
  Navigation.registerComponent('fc.AddSetScreen',     () => AddSetScreen, store, Provider);
  Navigation.registerComponent('fc.CardsScreen',     () => CardsScreen, store, Provider);
  Navigation.registerComponent('fc.ImageViewer',     () => ImageViewer, store, Provider);
  Navigation.registerComponent('fc.GroupDetailsScreen',     () => GroupDetailsScreen, store, Provider);
  Navigation.registerComponent('fc.UpgradeScreen',     () => UpgradeScreen, store, Provider);
  Navigation.registerComponent('fc.AboutScreen',     () => AboutScreen, store, Provider);
  Navigation.registerComponent('fc.IntroSwiper',     () => IntroSwiper, store, Provider);
}

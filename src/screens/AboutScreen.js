import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    StatusBar,
    Dimensions,
    Image,
    TextInput,
    Linking,
    BackAndroid,
    AsyncStorage,
    Share
} from 'react-native'
const { width: Dwidth, height: D_height } = Dimensions.get('window');
//import Share from 'react-native-send-intent'

import { inject, observer } from 'mobx-react'
@inject('App') @observer
export default class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
          credit_english: false,
        }
    }
    _renderHeader(section) {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title}</Text>
      </View>
    );
  }
  goToIntro() {
        this.props.App.rootNavigator.dismissLightBox()
        this.props.App.rootNavigator.push({
            screen: 'fc.IntroSwiper',
            passProps: {
            },
            navigatorStyle: {
                navBarHidden: true,
                statusBarTextColorSchemeSingleScreen: 'dark'
            }
        });
  }
  _renderContent(section) {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
      </View>
    );
  }
    render() {
        var percent_height = number => number/100 * D_height
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return (
          <View style={[styles.container, {backgroundColor: isDarkTheme? darkTheme.cardBackground : '#fafafa'}]}>
              <View style={[styles.header, {backgroundColor: '#4257b2'}]}>
                  <View style={{flex: 6, alignItems: 'center', justifyContent: 'flex-end'}}>
                    <Image source={require('./img/icon.png')} style={{width: 85, height: 85}} />
                  </View>
                  <View style={{flex: 4, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontFamily: 'IranSans', fontSize: 15, color: 'white'}}>لایتباکس - جعبه لایتنر و آزمون</Text>
                    <Text style={{fontFamily: 'IranSans', fontSize: 10, color: 'white', marginBottom: -10, marginTop: 5}}>نسخه {this.props.App.appVersion}</Text>
                  </View>
              </View>
              <View style={styles.body}>
                <View style={{flex: 1.75, flexDirection: 'row', borderBottomWidth: 1, borderColor: 'grey'}}>
                  <TouchableOpacity onPress={()=> Share.share({message: 'اپلیکیشن لایتباکس - جعبه لایتنر و ازمون\n فلش کارت های اماده، آزمون گیر، بازی و .... از کافه بازار دانلود کنید\n http://cafebazaar.ir/app/ir.rezania.flashcard/?l=fa', title: 'اشتراک گذاری'})} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={isDarkTheme? require('./img/share_light.png') : require('./img/share.png')} style={{width: 25, height: 25}} />
                    <Text style={{fontFamily: 'IranSans', fontSize: 14, color: isDarkTheme? '#fafafa' : 'grey'}}>اشتراک</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Linking.openURL('mail:heavenr1619@gmail.com')} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontFamily: 'Icons', fontSize: 25, color: isDarkTheme? '#fafafa' : '#000'}}>email</Text>
                    <Text style={{fontFamily: 'IranSans', fontSize: 14, color: isDarkTheme? '#fafafa' : 'grey'}}>ایمیل</Text>
                  </TouchableOpacity>
                  <TouchableOpacity  onPress={()=> Linking.openURL('https://telegram.me/litebox_app')} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={isDarkTheme? require('./img/telegram_light.png'): require('./img/telegram.png')} style={{width: 25, height: 25}} />
                    <Text style={{fontFamily: 'IranSans', fontSize: 14, marginTop: 2, color: isDarkTheme? '#fafafa' : 'grey'}}>کانال</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 3}}>
                  <ScrollView style={{padding: 15}}>
                    <TouchableOpacity onPress={this.goToIntro.bind(this)} style={{height: percent_height(7.5), width: '100%', marginTop: '0.5%', marginBottom: '0.5%', justifyContent: 'center', alignItems: 'flex-end'}}>
                        <Text style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : '#000', fontSize: 14 * this.props.App.fontSizeScale}}>راهنمای استفاده از برنامه</Text>
                    </TouchableOpacity>
                    <View style={{height: percent_height(7.5), width: '100%', marginTop: '0.5%', marginBottom: '0.5%', justifyContent: 'center', alignItems: 'flex-end'}}>
                        <Text onPress={() => Linking.openURL('bazaar://details?id=ir.rezania.flashcard')} style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : '#000', fontSize: 14 * this.props.App.fontSizeScale}}>رای به برنامه</Text>
                    </View>
                  </ScrollView>
                </View>
              </View>
          </View>

        );
    }
}

var Divider = () => <View style={{width: '100%', height: 1.25, backgroundColor: '#eee'}} />

var styles = StyleSheet.create({
  container: {
    width: 250,
    height: 350,
    borderRadius: 5
  },
  header: {
    flex: 4,
    elevation: 3,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5
  },
  body: {
      flex: 5
  },
  TitleText: {
      fontSize: 20,
      color: '#fff',
      fontFamily: 'IranSans'
  },
  card: {
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
    width: Dwidth - 20,
    backgroundColor: '#fff',
    borderRadius: 3,
    padding: 10,
    elevation: 2
  }
});

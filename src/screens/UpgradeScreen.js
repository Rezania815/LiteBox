import React, { Component } from 'react'
import { View, Text, Dimensions, ToastAndroid, TouchableNativeFeedback, TextInput, AsyncStorage, Switch } from 'react-native'
import {
	Container,
	Header,
	Title,
	Left,
	Right,
	Body,
	Icon,
    Content
} from 'native-base'
import uuid from 'uuid/v4'
import { inject, observer } from 'mobx-react'
var { width: D_width, height: D_height } = Dimensions.get('window')
import CafeBazaar from 'react-native-cafe-bazaar'
var Intent = require('react-native-send-intent')
require('./ToFarsiDigit')

@inject('App') @observer
class UpgradeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isBazaarInstalled: true,
            price: undefined
        }
    }
    componentDidMount() {
        var { serverURL } = this.props.App
        Intent.isAppInstalled('com.farsitel.bazaar').then((isInstalled) => {
            if(isInstalled) {
                this.setState({isBazaarInstalled: true})
                fetch(`${serverURL}/price`)
                .then(res => res.json())
                .then(resData => this.setState({price: resData.price}))
            } else {
                this.setState({isBazaarInstalled: false})
            }
            
        });
    }
    buyPro() {
        if(!this.state.isBazaarInstalled) {
            return ToastAndroid.show('لطفا ابتدا اپلیکیشن بازار را روی دستگاه خود نصب کنید', ToastAndroid.LONG)
        }
        var payload = uuid()
        CafeBazaar.open()
        .then(() => CafeBazaar.purchase('unlock_pro', payload, 1))
        .then((details) => {
            details = JSON.parse(details)
            console.log(details)

            if(details.mPurchaseState == 0) {
                ToastAndroid.show('نسخه حمایتی فعال شد. با تشکر', ToastAndroid.SHORT)
                this.props.App.rootNavigator.dismissLightBox()
                this.props.App.purchaseDetails = details
                AsyncStorage.setItem('purchaseDetails', JSON.stringify(details))
                this.props.App.isPro = true
                return 
            }
            return CafeBazaar.close()
        })
        .catch(err => ToastAndroid.show('متاسفانه مشکلی پیش آمد، لطفا دوباره امتحان نمایید', ToastAndroid.SHORT))
    }
    render() {
        var height = 225, width = 300
        var percent_height = number => number/100 * height
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return (
            <View style={{backgroundColor:  isDarkTheme? darkTheme.background : '#fff', minHeight: 255, width: 300, elevation: 4, borderRadius: 5}}>
                <Header style={{borderTopRightRadius: 5, borderTopLeftRadius: 5}}>
                    <Left />
                    <Body />
                    <Right><Title style={{fontFamily: 'IranSans', fontSize: 18}}>کاربر گرامی</Title></Right>
                </Header>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-between', width, padding: '5%'}}>
                    <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : '#000', fontSize: 16}}>
                            برای استفاده از قابلیت آزمون گیر، ویرایش جعبه و دریافت گروه های آماده غیررایگان نسخه حمایتی را فعال نمایید           
                        </Text>
                        {!this.state.isBazaarInstalled?<Text style={{fontFamily: 'IranSans', color: 'green', fontSize: 16}}>
                            برای فعال سازی ابتدا باید اپلیکیشن بازار را روی دستگاه خود نصب کنید
                        </Text> : null}
                    </View>

                    <TouchableNativeFeedback onPress={this.buyPro.bind(this)}>
                        <View style={{width: '100%', height: percent_height(20), marginTop: '7.5%', backgroundColor: 'blue', elevation: 4, borderRadius: 5, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontFamily: 'IranSans', color: 'white', fontSize: 18}}>فعال سازی {this.state.price? '(' + this.state.price.toFaDigit() + ' تومان' + ')' : ''}</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        )
    }
}

var Divider = () => <View style={{width: '100%', height: 1, backgroundColor: '#000'}} />

export default UpgradeScreen
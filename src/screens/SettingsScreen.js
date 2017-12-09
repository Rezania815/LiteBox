import React, { Component } from 'react'
import { View, Text, Switch, Dimensions, Slider, ToastAndroid } from 'react-native'
import { inject, observer } from 'mobx-react'

const { width: D_width, height: D_height } = Dimensions.get('window')

@inject('App') @observer
class SettingsScreen extends Component {
    goToUpgrade() {
        this.props.App.rootNavigator.showLightBox({
            screen: 'fc.UpgradeScreen',
            passProps: {
                
            },
			style: {
				backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
				tapBackgroundToDismiss: true // dismisses LightBox on background taps (optional)
			}
        });
    }
    goToAbout() {
        this.props.App.rootNavigator.showLightBox({
            screen: 'fc.AboutScreen',
			style: {
				backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
				tapBackgroundToDismiss: true // dismisses LightBox on background taps (optional)
			}
        });        
    }
    render() {
        var percent_height = number => number/100 * D_height
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return (
            <View style={{flex: 1, padding: 10}}>
                <View style={{height: percent_height(7.5), width: '100%', marginTop: '2.5%', marginBottom: '1.5%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Switch 
                        value={this.props.App.isDarkTheme} 

                        onValueChange={(boolean) => {
                                this.props.App.isDarkTheme = boolean
                        }}/>
                    <Text style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : 'grey', fontSize: 14 * this.props.App.fontSizeScale}}>حالت شب</Text>
                </View>
                <Divider />
                <View style={{height: percent_height(7.5), width: '100%', marginBottom: '1.5%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Slider 
                        value={this.props.App.fontSizeScale} 
                        style={{width: '50%'}}
                        minimumValue={0.5}
                        maximumValue={1.5}
                        onValueChange={(value) => {
                            this.props.App.fontSizeScale = value
                        }}/>
                    <Text style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : 'grey', fontSize: 14 * this.props.App.fontSizeScale}}>اندازه خط</Text>
                </View>
                <Divider />
                <View style={{height: percent_height(7.5), width: '100%', marginBottom: '1.5%',  justifyContent: 'center', alignItems: 'flex-end'}}>
                    {<Text onPress={!this.props.App.isPro? this.goToUpgrade.bind(this): () => ToastAndroid.show('نسخه حمایتی قبلا فعال شده است', ToastAndroid.SHORT)} style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : 'grey', fontSize: 14 * this.props.App.fontSizeScale}}>{!this.props.App.isPro? 'فعال سازی نسخه حمایتی' : 'نسخه حمایتی فعال شده است'}</Text>}
                </View>
                <Divider />
                <View style={{height: percent_height(7.5), width: '100%', marginBottom: '1.5%',  justifyContent: 'center', alignItems: 'flex-end'}}>
                    <Text onPress={this.goToAbout.bind(this)} style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : 'grey', fontSize: 14 * this.props.App.fontSizeScale}}>درباره برنامه</Text>
                </View>
            </View>
        )
    }
}

var Divider = () => <View style={{width: '100%', height: 1.25, backgroundColor: '#ccc'}} />

export default SettingsScreen
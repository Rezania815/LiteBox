import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, PixelRatio, AsyncStorage, ToastAndroid, Image, TouchableOpacity, I18nManager } from 'react-native'
import {
	Container,
	Header,
	Title,
	CardItem,
	Content,
	Footer,
	FooterTab,
	Button,
	Left,
	Right,
	Body,
	Icon
} from 'native-base'
const { width: D_width } = Dimensions.get('window')
import Groups from './Groups'
import StoreScreen from './Store/StoreScreen'
import StatusScreen from './StatusScreen'
import SettingsScreen from './SettingsScreen'

import IntroSwiper from './IntroSwiper'

//import Text from 'react-native-text'

I18nManager.allowRTL(false);

import { observer, inject } from 'mobx-react'

console.disableYellowBox = true

@inject('App', 'SetsRecords', 'AppData') @observer
export default class Main extends Component {
    constructor(props) {
        super(props);
        var { navigator } = this.props
        this.props.App.rootNavigator = navigator
		this.goToAddGroup = this.goToAddGroup.bind(this)
    }
	renderAdd() {
		//42.5
		var dimention = 42.5
		return (
			<TouchableOpacity
				onPress={this.goToAddGroup}
				style={{
					backgroundColor: 'orange',
					elevation: 2,
					width: dimention,
					height: dimention,
					borderRadius: 180,
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<Icon name="md-add" style={{ fontSize: 25, color: '#212121' }} />
			</TouchableOpacity>
		)
	}
    goToAddGroup() {
        this.props.App.rootNavigator.showLightBox({
            screen: 'fc.AddGroupScreen',
            passProps: {
                
            },
			style: {
				backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
				tapBackgroundToDismiss: true // dismisses LightBox on background taps (optional)
			}
        });
	}
	checkNewVersion() {
		fetch(`${this.props.App.serverURL}/version`)
		.then(res => res.toString())
		.then(res)
	}
	componentWillUnmount() {
		
	}
	componentDidMount() {
        AsyncStorage.getItem('SetsRecords', (err, val) => {
			if(val === null) return
            this.props.SetsRecords.Sets = JSON.parse(val)
			//alert(val)
        })
        AsyncStorage.getItem('AppData', (err, val) => {
			if(val === null) return this.props.App.isLoadingAppData = false
			this.props.AppData.Groups = JSON.parse(val)
			this.props.App.isLoadingAppData = false
        })
	}
    render() {
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return(
            <Container style={{backgroundColor: isDarkTheme? darkTheme.background : '#fafafa'}}>
                <Header>
                <Left>
                    {/*<Icon name="md-search" style={{color: '#fff', marginLeft: 5}} />*/}
                </Left>
                <Body />
                <Right>
					<Text style={{color: '#fff', fontFamily: 'IranSans', fontSize: 18}}>
						{
							this.props.App.currentTab === 'homeTab'? 'لایتباکس' :
							this.props.App.currentTab === 'storeTab'? 'فروشگاه' :
							this.props.App.currentTab === 'statusTab'? 'وضعیت' :
							this.props.App.currentTab === 'settingsTab'? 'تنظیمات' :
							null
						}
					</Text>
				</Right>
                </Header>
                <View style={{flex: 1}}>
					{
						this.props.App.currentTab === 'homeTab'? <Groups /> :
						this.props.App.currentTab === 'storeTab'? <StoreScreen /> :
						this.props.App.currentTab === 'statusTab'? <StatusScreen /> :
						this.props.App.currentTab === 'settingsTab'? <SettingsScreen /> :
						null
					}
                </View>
                <Footer style={{backgroundColor: isDarkTheme? darkTheme.footerBackground : '#fff', elevation: 8}}>
                <FooterTab style={{backgroundColor: isDarkTheme? darkTheme.footerBackground : '#fff'}}>
                    <Button full onPress={() => this.props.App.currentTab = 'settingsTab'}>
						
                        <Icon								style={{
									color:
										this.props.App.currentTab === 'settingsTab'
											? '#4153b5'
											: 'lightblue',
								}} name="md-settings" />
						

                        <Text								style={{
									color:
										this.props.App.currentTab === 'settingsTab'
											? '#4153b5'
											: 'lightblue',
									fontSize: 11 / PixelRatio.getFontScale(),
									fontFamily: 'IranSans'
								}}>تنظیمات</Text>							
						
                    </Button>
                    <Button full onPress={() => ToastAndroid.show('این بخش فعلا در دسترس نیست', ToastAndroid.SHORT)}>
							<Text
								style={{
									color:
										this.props.App.currentTab === 'statusTab'
											? '#4153b5'
											: 'lightblue',
									fontFamily: 'Icons',
									fontSize: 24
								}}
							>equalizer</Text>
                        <Text								style={{
									color:
										this.props.App.currentTab === 'statusTab'
											? '#4153b5'
											: 'lightblue',
									fontSize: 11 / PixelRatio.getFontScale(),
									fontFamily: 'IranSans'
								}}>وضعیت</Text>
                    </Button>
                    <Button style={{width: 45}}>
                        {this.renderAdd()}
                    </Button>
                    <Button full onPress={() => this.props.App.currentTab = 'storeTab'}>
							<Icon
								name="md-appstore"
								style={{
									color:
										this.props.App.currentTab === 'storeTab'
											? '#4153b5'
											: 'lightblue'
								}}
							/>
                        <Text								style={{
									color:
										this.props.App.currentTab === 'storeTab'
											? '#4153b5'
											: 'lightblue',
									fontSize: 11 / PixelRatio.getFontScale(),
									fontFamily: 'IranSans'
								}}>فروشگاه</Text>
                    </Button>
                    <Button full onPress={() => this.props.App.currentTab = 'homeTab'}>
							<Icon
								name="md-home"
								style={{
									color:
										this.props.App.currentTab === 'homeTab'
											? '#4153b5'
											: 'lightblue',
								}}
							/>
                        <Text								style={{
									color:
										this.props.App.currentTab === 'homeTab'
											? '#4153b5'
											: 'lightblue',
									fontSize: 11 / PixelRatio.getFontScale(),
									fontFamily: 'IranSans'
								}}>گروه ها</Text>
                    </Button>
                </FooterTab>
                </Footer>
            </Container>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header : {
        flex: 3,
        flexDirection: 'row'
    },
    body: {
        flex: 23
    },
    footer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'brown'
    },
    TitleText: {
        fontSize: 23,
        color: '#fff',
        fontFamily: 'IranSans',
        marginRight: 10,

    }
})
import React, { Component } from 'react'
import { View, Text, Dimensions, TouchableNativeFeedback, TextInput, AsyncStorage, Switch } from 'react-native'
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

@inject('App', 'AppData') @observer
class AddGroupScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            groupName: '',
            image: ''
        }
        this.addGroup = this.addGroup.bind(this)
    }
    addGroup() {
        this.props.AppData.Groups.push({
            _id: uuid(),
            groupName: this.state.groupName,
            image: this.state.image || '',
            sets: []
        })
        this.props.App.rootNavigator.dismissLightBox()
        AsyncStorage.setItem('AppData', JSON.stringify(this.props.AppData.Groups))
    }
    render() {
        var height = 200, width = 300
        var percent_height = number => number/100 * height
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return (
            <View style={{backgroundColor:  isDarkTheme? darkTheme.background : '#fff', height: 200, width: 300, elevation: 4}}>
                <Header>
                    <Left />
                    <Body />
                    <Right><Title style={{fontFamily: 'IranSans', fontSize: 18}}>گروه جدید</Title></Right>
                </Header>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-between', width, height, padding: '5%'}}>
                    <View style={{height: percent_height(20), width: '100%', marginBottom: '1.5%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <TextInput underlineColorAndroid={isDarkTheme? '#fafafa' : 'grey'} onChangeText={text => this.setState({groupName: text})} style={{width: '65%', fontSize: 14 * this.props.App.fontSizeScale}} />
                        <Text style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : 'grey', fontSize: 14 * this.props.App.fontSizeScale}}>نام گروه</Text>
                    </View>
                    <TouchableNativeFeedback onPress={this.addGroup}>
                        <View style={{width: '100%', height: percent_height(20), marginTop: '7.5%', backgroundColor: 'blue', elevation: 4, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontFamily: 'IranSans', color: 'white', fontSize: 18 * this.props.App.fontSizeScale}}>ایجاد گروه</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        )
    }
}

var Divider = () => <View style={{width: '100%', height: 1, backgroundColor: '#000'}} />

export default AddGroupScreen
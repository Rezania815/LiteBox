import React, { Component } from 'react'
import { View, Text, Image, AsyncStorage } from 'react-native'
import { inject, observer } from 'mobx-react'


@inject('AppData', 'App') @observer
class GroupDetailsScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isDownloading: false
        }
    }
    downloadGroup() {
        this.setState({isDownloading: true})
        fetch(`${this.props.App.serverURL}/group/${this.props.group._id}`)
        .then(res => res.json())
        .then(resData => {
            this.setState({downloaded: true, isDownloading: false, downloadedGroup: resData})
            this.props.AppData.Groups.push(JSON.parse(resData))
            AsyncStorage.setItem('AppData', JSON.stringify(this.props.AppData.Groups))
        })
    }
    componentWillUnmount() {
        //kssssssssss
    }
    render() {
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        if(!this.props.hasOwnProperty('group')) {
            return null
        }
        return (
            <View style={{width: 200, height: 250, backgroundColor: isDarkTheme? darkTheme.background : '#fff', justifyContent: 'center', borderRadius: 5}}>
                    <View style={{height: '20%', backgroundColor: '#4257b2', justifyContent: 'center', paddingRight: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                        <Text style={{fontFamily: 'IranSans', color: '#fff', fontSize: 16}}>گروه</Text>
                    </View>
                    <Image source={{uri: this.props.group.image}} style={{width: '26%', height: '30%', position: 'absolute', top: '10%', left: 10, zIndex: 10}} />
                    <View style={{padding: 10, flex: 1, alignItems: 'flex-end', justifyContent: 'space-between'}}>
                        <View style={{width: '70%'}}>
                            <Text style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : '#000'}}>{this.props.group.groupName}</Text>
                        </View>
                        <View style={{width: '100%'}}>
                            <Text style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : '#000'}}>تعداد جعبه ها: {this.props.group.sets_number}</Text>
                        </View>
                        <View style={{width: '100%'}}>
                            <Text style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : '#000'}}>تعداد کل کارت ها: {this.props.group.cards_number}</Text>
                        </View>
                        <View style={{width: '100%', height: '25%', alignItems: 'center'}}>
                            <View style={{backgroundColor: 'green', width: '75%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
                                <Text style={{fontFamily: 'IranSans', color: '#fff'}}>
                                    {!this.state.isDownloading?
                                        !this.state.downloaded?
                                        <Text onPress={this.downloadGroup.bind(this)}>دریافت گروه</Text>
                                        : <Text>دانلود شد</Text> 
                                    : 
                                        <Text>در حال دریافت...</Text>}
                                </Text>
                            </View>
                        </View>


                    </View>
            </View>
        )
    }
}

export default GroupDetailsScreen
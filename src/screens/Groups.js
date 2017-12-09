import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, AsyncStorage, ToastAndroid, Image, FlatList, InteractionManager, PopupMenuAndroid, } from 'react-native'
import { Icon } from 'native-base'
const { width: D_width } = Dimensions.get('window')
import toFaDigit from './ToFarsiDigit';
import { inject, observer } from 'mobx-react'
import { SharedElementTransition } from 'react-native-navigation'
import CafeBazaar from 'react-native-cafe-bazaar'

import Menu, { MenuContext, MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu';

@inject('App', 'AppData') @observer
export default class Groups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false
        }
    }
    goToGroup(group, image_key) {
        this.props.App.rootNavigator.push({
            screen: 'fc.GroupScreen',
            sharedElements: [group.image? image_key : undefined],
            passProps: {
                group,
                sharedImageId: image_key
            },
            navigatorStyle: {
                navBarHidden: true,
                statusBarTextColorSchemeSingleScreen: 'dark'
            }
        });
    }
    componentDidMount() {

    }
    renderGroup(data) {
        let Group = data.item
        var image_key = `${Group._id}_image`
        return <TouchableOpacity key={data.key} onPress={this.goToGroup.bind(this, Group, image_key)} style={styles.card}>
                    <SharedElementTransition sharedElementId={image_key}>
                        <Image source={{uri: Group.image}} style={{width: D_width / 3 - 20 , height: 125}} />
                    </SharedElementTransition>
                    <Text style={{color: 'black', fontFamily: 'IranSans', fontSize: 14 * this.props.App.fontSizeScale, margin: 15}}>{Group.groupName.toFaDigit()}</Text>
               </TouchableOpacity>       
    }
    render() {
        var Groups = this.props.AppData.Groups.toJS()
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return (
        <MenuContext style={{ flex: 1 }}>
            <View style={styles.conatiner}>
                {!this.props.App.isLoadingAppData?
                    Groups.length?<ScrollView contentContainerStyle={{flex: 1}}>
                    <View style={{flex: 1, flexWrap: 'wrap', flexDirection: 'row'}}>
                    {Groups.map((Group, i) => {
                        var image_key = `${Group._id}_image`
                        return <TouchableOpacity key={Group._id + i} onPress={this.goToGroup.bind(this, Group, image_key)} style={[styles.card, {backgroundColor: isDarkTheme? darkTheme.cardBackground : '#fff'}]}>
                                    {Group.image?<SharedElementTransition sharedElementId={image_key}>
                                        <Image source={{uri: Group.image}} style={{width: D_width / 3 - 20 , height: 125}} />
                                    </SharedElementTransition> : null}
                                    <Text style={{color: isDarkTheme? '#fafafa' : 'black', fontFamily: 'IranSans', fontSize: 14 * this.props.App.fontSizeScale, margin: 15, marginBottom: 35}}>{Group.groupName.toFaDigit()}</Text>
                                    <Menu onSelect={(value) => {
                                        this.props.AppData.Groups.splice(i, 1);
                                        AsyncStorage.setItem('AppData', JSON.stringify(this.props.AppData.Groups))
                                    }} style={{position: 'absolute', bottom: 2.5, right: 2.5}}>
                                        <MenuTrigger>
                                            <View style={{width: 12.5, height: 30}}>
                                               <Text style={{ fontSize: 20 }}>&#8942;</Text> 
                                            </View>  
                                        </MenuTrigger>
                                        <MenuOptions>
                                            <MenuOption value={1}>
                                            <Text>حذف گروه</Text>
                                            </MenuOption>
                                        </MenuOptions>
                                    </Menu>
                            </TouchableOpacity>
                    })}
                    </View>
                </ScrollView> 
                :
                <Text
                    style={{fontFamily: 'IranSans', textAlign: 'center', fontSize: 14 * this.props.App.fontSizeScale, color: isDarkTheme? '#fafafa' : 'grey'}}>
                        <Text style={{fontSize: 16, margin: 15}}>هنوز هیچ گروه فلش کارتی نیست</Text>{'\n'}
                        <Text style={{fontSize: 13}}>از بخش فروشگاه <Icon name="md-appstore" style={{color: 'grey', fontSize: 17}} /> گروه های آماده دانلود کنید یا</Text>{'\n'}
                        <Text style={{fontSize: 13}}>از بخش <Icon name="md-add" style={{color: 'grey', fontSize: 17,}} /> گروه فلش کارت خودتان را بسازید</Text>
                </Text>
                :
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color:isDarkTheme? '#fafafa' : '#000', fontFamily: 'IranSans'}}>در حال بارگذاری...</Text>
                </View>
                }
            </View>
        </MenuContext>
        );
    }
}


//width : D_width / 2 - 10
//height: 250


var styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        width: D_width / 3 - 10,
        marginHorizontal: 5,
        marginBottom: 10,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        elevation: 4
    },
    rowCard: {
        width: D_width - 20,
        marginHorizontal: 10,
        marginTop: 10,
        height: 100,
        backgroundColor: '#fff',
        justifyContent: 'center'
    }
})
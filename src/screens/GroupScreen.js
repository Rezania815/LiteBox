import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, AsyncStorage, TouchableOpacity, FlatList, ScrollView, Image } from 'react-native'
import {
	Container,
	Header,
	Title,
	Left,
	Right,
	Body,
	Icon
} from 'native-base'
const { width: D_width } = Dimensions.get('window')
import toFaDigit from './ToFarsiDigit'
import { inject, observer } from 'mobx-react'

import { SharedElementTransition } from 'react-native-navigation'

import Menu, {
    MenuContext,
    MenuOptions, 
    MenuOption,
    MenuTrigger 
} from 'react-native-menu';

const SHOW_DURATION = 240
const HIDE_DURATION = 200

@inject('App', 'AppData') @observer
export default class GroupScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Group: this.props.AppData.Groups.find(g => g._id == this.props.group._id)
        }
        this.renderSet = this.renderSet.bind(this)
        this.goToAddSet = this.goToAddSet.bind(this)
    }
    goToSet(set) {
        this.props.App.rootNavigator.push({
            screen: 'fc.SetScreen',
            passProps: {
                set,
                group_id: this.state.Group._id
            },
            navigatorStyle: {
                navBarHidden: true
            }
        });
    }
    goToAddSet() {
        this.props.App.rootNavigator.push({
            screen: 'fc.AddSetScreen',
            passProps: {
                group: this.state.Group,
                editing: false
            },
            navigatorStyle: {
                navBarHidden: true
            }
        });        
    }
    goToUpgrade() {
        this.props.App.rootNavigator.showLightBox({
            screen: 'fc.UpgradeScreen',
			style: {
				backgroundBlur: "dark",
				tapBackgroundToDismiss: true
			}
        });
    }
    renderSet(data) {
        var GroupSet = data.item
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return <TouchableOpacity key={data.key} onPress={this.goToSet.bind(this, GroupSet)} style={[styles.card, {backgroundColor: isDarkTheme? darkTheme.cardBackground: '#fff'}]}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text style={{fontFamily: 'IranSans', fontSize: 14 * this.props.App.fontSizeScale, color: isDarkTheme? '#fafafa' : 'grey', marginHorizontal: 10}}>{GroupSet.cards.length.toString().toFaDigit()} کارت</Text>
                    </View>
                    <View style={{flex: 2, justifyContent: 'center'}}>
                        <Text style={{fontFamily: 'IranSans', fontSize: 18 * this.props.App.fontSizeScale, color: isDarkTheme? '#fafafa' : '#455358', marginHorizontal: 10}}>{GroupSet.setName.toFaDigit()}</Text>
                    </View>
                    <Menu onSelect={(value) => {
                        if(!this.props.App.isPro) {
                            this.goToUpgrade()
                        }
                        let group_index = this.props.AppData.Groups.map(g => g._id).indexOf(this.state.Group._id)
                        let set_index = this.props.AppData.Groups[group_index].sets.map(s => s._id).indexOf(GroupSet._id)
                        this.props.AppData.Groups[group_index].sets.splice(set_index, 1);
                        AsyncStorage.setItem('AppData', JSON.stringify(this.props.AppData.Groups))
                    }} style={{position: 'absolute', bottom: 2.5, right: 5}}>
                        <MenuTrigger>
                            <View style={{width: 10, height: 30, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                                <Text style={{ fontSize: 20 }}>&#8942;</Text>
                            </View>
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption value={1}>
                            <Text>حذف جعبه از گروه</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
               </TouchableOpacity>        
    }
    render() {
        var Group = this.props.AppData.Groups.find(g => g._id == this.props.group._id)
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return (
        <MenuContext style={{ flex: 1 }}>
            <Container style={{backgroundColor: isDarkTheme? darkTheme.background : '#f0f0f0'}}>
                <Header>
                    <Left style={{flexDirection: 'row'}}>
                        <Text onPress={() => this.props.App.rootNavigator.pop()} style={{color: '#fff', fontFamily: 'Icons', fontSize: 22}}>&#xE5C4;</Text>

                    </Left>
                    <Body />
                    <Right><Text style={{fontFamily: 'IranSans', fontSize: 17, color: '#fff'}}>گروه</Text></Right>
                </Header>
                <View style={{height: 100, width:D_width, backgroundColor: isDarkTheme? darkTheme.headerBackground : '#fff', elevation: 3, flexDirection: 'row'}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        {Group.image? 
                                <SharedElementTransition
                                    style={{height: 75, width: 50}}
                                    sharedElementId={this.props.sharedImageId}
                                    showDuration={SHOW_DURATION}
                                    hideDuration={HIDE_DURATION}
                                    animateClipBounds
                                    showInterpolation={{
                                        type: 'linear',
                                        easing: 'FastInSlowOut'
                                    }}
                                    hideInterpolation={{
                                        type: 'linear',
                                        easing: 'FastOutSlowIn'
                                    }}
                                >
                                    <Image
                                        style={{height: 100, width: 75}}
                                        source={{ uri: Group.image }}
                                    />
                                </SharedElementTransition>
                        : null}                    
                    </View>
                    <View style={{flex: 4.5}}>
                        <View style={{flex: 2, justifyContent: 'center'}}>
                            <Text style={{marginRight: 10, fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : 'grey', fontSize: 14 * this.props.App.fontSizeScale}}>{Group.sets.length.toString().toFaDigit()} جعبه</Text>
                        </View>
                        <View style={{flex: 3, marginRight: 10}}>
                            <Text style={{color: isDarkTheme? '#fafafa' : '#000', fontSize: 20 * this.props.App.fontSizeScale, fontFamily: 'IranSans'}}><Text style={{color: isDarkTheme? 'grey' : 'grey', fontSize: 17 * this.props.App.fontSizeScale}}>نام گروه :‌ </Text>{Group.groupName.toFaDigit()}</Text>
                        </View>
                    </View>
                </View>
                <FlatList 
                    data={Group.sets} 
                    renderItem={this.renderSet.bind(this)}
                    keyExtractor={(item, index) => item._id}
                />
                {/*<ScrollView>{this.state.Group.sets.map((GroupSet, i) => {
                    return <TouchableOpacity key={`set${i}`} onPress={this.goToSet.bind(this, GroupSet)} style={styles.card}>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                    <Text style={{fontFamily: 'IranSans', fontSize: 14, marginHorizontal: 10}}>{GroupSet.cards.length.toString().toFaDigit()} کارت</Text>
                                </View>
                                <View style={{flex: 2, justifyContent: 'center'}}>
                                    <Text style={{fontFamily: 'IranSans', fontSize: 20, color: '#455358', marginHorizontal: 10}}>{GroupSet.setName.toFaDigit()}</Text>
                                </View>
                           </TouchableOpacity>
                })}
                </ScrollView>*/}
                <FAB onPress={this.goToAddSet} />
            </Container>
        </MenuContext>
        ); 
    }
}

var FAB = props => <TouchableOpacity onPress={() => props.onPress()} style={styles.fab}><Text style={{fontWeight: 'bold', fontSize: 20, color: '#fff'}}>+</Text></TouchableOpacity>

var styles = StyleSheet.create({
    card: {
        width: D_width - 40,
        marginHorizontal: 20,
        marginTop: 10,
        height: 80,
        justifyContent: 'center',
        elevation: 1,
        padding: 5
    },
    fab: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        height: 50,
        width: 50,
        backgroundColor: 'orange',
        borderRadius: 180,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4
    }
});
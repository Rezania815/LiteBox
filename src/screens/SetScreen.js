import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, ScrollView, FlatList, TouchableOpacity, Image, InteractionManager, ActivityIndicator , StatusBar } from 'react-native'
import {
    Container,
    Header,
    Title,
    Left,
    Right,
    Body,
    Icon
} from 'native-base'
var { width: D_width, height: D_height } = Dimensions.get('window');
import tts from 'react-native-android-speech'
import toFaDigit from './ToFarsiDigit'

import { SharedElementTransition } from 'react-native-navigation'

import { observer, inject } from 'mobx-react'

import * as Animatable from 'react-native-animatable'; 
var isDetailViewVisibile = true


@inject('App', 'AppData') @observer
export default class SetScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
             CardSet: this.props.set,
             isReady: false
        }
        this.renderCard = this.renderCard.bind(this)
    }
    speakCard(text) {
        tts.speak({
            text: text, // Mandatory 
            pitch:  1.5, // Optional Parameter to set the pitch of Speech, 
            forceStop : true , //  Optional Parameter if true , it will stop TTS if it is already in process 
            language : 'en' // Optional Paramenter Default is en you can provide any supported lang by TTS 
        }).then(isSpeaking=>{
            console.log(isSpeaking);
        }).catch(error=>{
            console.log(error)
        });
    }
    componentDidMount() {
        isDetailViewVisibile = true
      InteractionManager.runAfterInteractions(() => {
        this.setState({isReady: true});    
      });
    }
    goToMatchGame(cards) {
        this.props.App.rootNavigator.push({
            screen: 'fc.MatchGame',
            passProps: {
                cards,
                set_id: this.state.CardSet._id
            },
            navigatorStyle: {
                navBarHidden: true
            }
        });
    }
    goToQuiz(cards) {
        this.props.App.rootNavigator.push({
            screen: 'fc.QuizScreen',
            passProps: {
                cards
            },
            navigatorStyle: {
                navBarHidden: true
            }
        });
    }
    goToStages(set) {   
        this.props.App.rootNavigator.push({
            screen: 'fc.Stages',
            passProps: {
                set
            },
            navigatorStyle: {
                navBarHidden: true
            }
        });   
    }
    goToCardsScreen(set) {
        this.props.App.rootNavigator.push({
            screen: 'fc.CardsScreen',
            passProps: {
                set
            },
            navigatorStyle: {
                navBarHidden: true
            }
        });        
    }
    goToImageViewer(imageURI, image_key) {
        this.props.App.rootNavigator.showLightBox({
            screen: 'fc.ImageViewer',
            passProps: {
                image: imageURI,
            },
            style: {
                backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
                tapBackgroundToDismiss: true // dismisses LightBox on background taps (optional)
            }
        });        
    }
    renderCard(data) {
        card = data.item
        let image_key = card[2] + '_image'
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return <View key={data.key} style={[styles.card, { flexDirection: 'row', backgroundColor: isDarkTheme? darkTheme.cardBackground : '#fff'}]}>
                    <View style={{flex: 2, justifyContent: 'center', flexDirection: 'row'}}>
                        {card.length > 3? <View style={{flex: 1}}>
                            <TouchableOpacity onPress={this.goToImageViewer.bind(this, card[3], image_key)}>
                                    <Image source={{uri: card[3]}} style={{width: 60, height: 60}} />
                            </TouchableOpacity>
                            </View> 
                        : null}
                        <View style={{flex: 1.75}}><Text style={{marginRight: 10, textAlign: 'left', fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : '#000', fontSize: 14 * this.props.App.fontSizeScale}}>{card[0]}</Text></View>
                    </View>
                    <View ref="divider" style={{flex: 0.01, backgroundColor: '#d1d1d1'}} />
                    <View style={{flex: 2, alignItems: 'flex-start', flexDirection: 'row' }}>
                        <View style={{flex: 3, justifyContent: 'center', paddingHorizontal: 10, flexDirection: 'row'}}>
                            <View><Text style={{color: isDarkTheme? '#fff' : 'grey', fontFamily: 'IranSans', textAlign: 'left', fontSize: 14 * this.props.App.fontSizeScale}}>{card[1]}</Text></View>
                            {card.length > 3? <View style={{flex: 1}}>
                                <TouchableOpacity onPress={this.goToImageViewer.bind(this, card[4], image_key)}>
                                    <Image source={{uri: card[4]}} style={{width: 60, height: 60}} />
                                </TouchableOpacity>
                            </View> : null}
                        </View>
                        <TouchableOpacity style={{flex: 1.05, justifyContent: 'center'}} onPress={this.speakCard.bind(this, card[0] + ' ' + card[1])}>
                            <Icon name="md-volume-up" style={{marginLeft: 10,fontFamily: 'Icons', fontSize: 23, color: isDarkTheme? '#fff' : 'grey'}} />
                        </TouchableOpacity>
                    </View>
                </View>
    }
    goToEditSet() {
        this.props.App.rootNavigator.push({
            screen: 'fc.AddSetScreen',
            passProps: {
                set: this.state.CardSet,
                group_id: this.props.group_id,
                editing: true
            },
            navigatorStyle: {
                navBarHidden: true
            }
        });        
    }
    render() {
        var CardSet = this.props.AppData.Groups.find(g => g._id == this.props.group_id).sets.find(s => s._id == this.props.set._id)
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="blue" />
                <Header>
                    <Left>
                            <Text onPress={() => this.props.App.rootNavigator.pop()} style={{color: '#fff', fontFamily: 'Icons', fontSize: 22}}>&#xE5C4;</Text>
                    </Left>
                    <Left>
                        <Text 
                                style={{color: '#fff', fontFamily: 'Icons', fontSize: 20, marginLeft: -15}}
                                onPress={this.goToEditSet.bind(this)}
                        >
                            mode_edit
                        </Text>
                    </Left>
                    <Body />
                    <Right><Title style={{fontFamily: 'IranSans', fontSize: 18}}>جعبه</Title></Right>
                </Header>
                <Animatable.View ref="details" style={{height: D_height / 3, width: D_width, backgroundColor: isDarkTheme? darkTheme.headerBackground : '#fff'}}>
                    <View style={{flex: 2, justifyContent: 'center'}}>
                        <Text style={{marginRight: 10, fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : 'grey', fontSize: 14 * this.props.App.fontSizeScale}}>{CardSet.cards.length.toString().toFaDigit()} کلمه</Text>
                    </View>
                    <View style={{flex: 8, marginRight: 10}}>
                        <Text style={{color: isDarkTheme? '#fafafa' : '#000', fontSize: 21 * this.props.App.fontSizeScale, fontFamily: 'IranSans'}}><Text style={{color: 'grey', fontSize: 17 * this.props.App.fontSizeScale}}>نام جعبه : </Text>{CardSet.setName.toFaDigit()}</Text>
                    </View>
                </Animatable.View>
                <Animatable.View ref="buttonsCon" style={{position: 'absolute', top: D_height / 3 - 44, left: 0, height: 100, width: D_width, backgroundColor: isDarkTheme? darkTheme.background : '#f0f0f0'}}>
                    <View style={{position: 'absolute', left: 0, top: 0, backgroundColor: isDarkTheme? darkTheme.headerBackground : '#fff', height: 50, width: D_width}}></View>
                    <View style={{position: 'absolute', left: 0, bottom: 0, height: 50, width: D_width}}></View>
                    <TouchableOpacity onPress={() => this.goToCardsScreen(CardSet)} style={{position: 'absolute', right: 10, top: 0, width: D_width / 4 - 10, height: 100, borderWidth: 1, borderColor: isDarkTheme? 'grey' : '#d1d1d1', marginHorizontal: 5, borderBottomWidth: 5, borderBottomColor: '#3ccfcf', backgroundColor: isDarkTheme? darkTheme.cardBackground : '#fff', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontFamily: 'Icons', fontSize: 30, margin: 10, color: isDarkTheme? '#5e92f3' : '#4153b5'}}>&#xE3E0;</Text>
                        <Text style={{color:isDarkTheme? 'lightblue' : '#3ccfcf' , fontSize: 17, fontFamily: 'IranSans'}}>کارت ها</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.goToStages(CardSet)} style={{position: 'absolute', right: 6.5 + D_width / 4, top: 0, width: D_width / 4 - 10, height: 100, borderWidth: 1, borderColor: isDarkTheme? 'grey' : '#d1d1d1', backgroundColor: isDarkTheme? darkTheme.cardBackground : '#fff', borderBottomWidth: 5, borderBottomColor: '#3ccfcf', marginHorizontal: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontFamily: 'Icons', fontSize: 30, margin: 10, color: isDarkTheme? '#5e92f3' : '#4153b5'}}>&#xE54B;</Text>
                        <Text style={{color:isDarkTheme? 'lightblue' : '#3ccfcf' , fontSize: 17, fontFamily: 'IranSans'}}>یادگیری</Text>
                    </TouchableOpacity>
                    <TouchableOpacity elevation={5} onPress={() => this.goToMatchGame(CardSet.cards)} style={{position: 'absolute', right: 3.5 + D_width / 4 * 2, top: 0, width: D_width / 4 - 10, height: 100, borderWidth: 1, borderColor: isDarkTheme? 'grey' : '#d1d1d1', backgroundColor: isDarkTheme? darkTheme.cardBackground : '#fff', borderBottomWidth: 5, borderBottomColor: '#3ccfcf', marginHorizontal: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontFamily: 'Icons', fontSize: 30, margin: 10, color: isDarkTheme? '#5e92f3' : '#4153b5'}}>&#xE871;</Text>
                        <Text style={{color: isDarkTheme? 'lightblue' : '#3ccfcf', fontSize: 17, fontFamily: 'IranSans'}}>بازی</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.goToQuiz.bind(this, CardSet.cards)} style={{position: 'absolute', right: D_width / 4 * 3, top: 0, width: D_width / 4 - 10, height: 100, borderWidth: 1, borderColor: isDarkTheme? 'grey' : '#d1d1d1', backgroundColor: isDarkTheme? darkTheme.cardBackground : '#fff', borderBottomWidth: 5, borderBottomColor: '#3ccfcf', marginHorizontal: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontFamily: 'Icons', fontSize: 30, margin: 10, color: isDarkTheme? '#5e92f3' : '#4153b5'}}>&#xE877;</Text>
                        <Text style={{color:isDarkTheme? 'lightblue' : '#3ccfcf', fontSize: 17, fontFamily: 'IranSans'}}>آزمون</Text>
                    </TouchableOpacity>
                </Animatable.View>
                <View style={{height: D_height , width: D_width, backgroundColor: isDarkTheme? darkTheme.background : '#f0f0f0'}}>
                    <View style={{flex: 5, marginTop: 15}}>
                        {this.state.isReady?  
                            <FlatList 
                                data={CardSet.cards} 
                                renderItem={this.renderCard.bind(this)} 
                                scrollEventThrottle={16}
                                keyExtractor={(item, index) => item[2]}
                                onScroll={e => {
                                    if(e.nativeEvent.contentOffset.y > 0 && isDetailViewVisibile) {
                                        clearTimeout(this.hideDetailsTimeout)
                                        this.hideDetailsTimeout = setTimeout(() => {
                                            this.refs.details.transitionTo({height: 0})
                                        }, 250)
                                        isDetailViewVisibile = false
                                    }
                                    if(e.nativeEvent.contentOffset.y === 0) {
                                        this.refs.details.transitionTo({height: D_height / 3})
                                        isDetailViewVisibile = true
                                    }                                
                                }}
                            />
                        : 
                            <ActivityIndicator size="large" />
                        }
                    </View>
                </View>                
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        height: D_height,
        width: D_width
    },
    card: {
        width: D_width - 20,
        marginHorizontal: 10,
        marginBottom: 10,
        minHeight: 65,
        backgroundColor: '#fff',
        padding: 10
    }
});

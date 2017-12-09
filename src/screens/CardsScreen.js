import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import {
	Container,
	Header,
	Title,
	Left,
	Right,
	Body,
	Icon
} from 'native-base'
import FlipCard from 'react-native-flip-card'
import { inject, observer } from 'mobx-react'
import tts from 'react-native-android-speech'

var { width: D_width } = Dimensions.get('window')

@inject('App') @observer
class CardsScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cards: this.props.set.cards
        }
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
    renderCard(data) {
        let card = data.item
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return (
        <View style={{height: 250, width: D_width, marginTop: 10, alignItems: 'center'}}>
            <FlipCard
                flipHorizontal
                flipVertical={false}
                prespective={1000}
                style={{borderWidth: 0}}
            >
                <View style={[styles.card, {backgroundColor: isDarkTheme? darkTheme.cardBackground : '#eee'}]}>
                    <Text style={{fontFamily: 'IranSans', fontSize: 20 * this.props.App.fontSizeScale, color: isDarkTheme? '#fafafa' : '#000'}}>{card[0]}</Text>
                    <View style={{position: 'absolute', bottom: 10, right: 10, justifyContent: 'center', alignItems: 'center', zIndex: 500}}>
                         <TouchableOpacity onPress={this.speakCard.bind(this, card[0])} style={{width: 40, height: 40, borderRadius: 180, backgroundColor: 'grey', borderColor: '#fff', borderWidth: 2, justifyContent: 'center', alignItems: 'center', zIndex: 500}}>
                            <Text style={{fontFamily: 'Icons', fontSize: 23 * this.props.App.fontSizeScale, color: '#fff'}}>&#xE050;</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.card, {backgroundColor: isDarkTheme? darkTheme.cardBackground : '#eee'}]}>
                    <Text style={{fontFamily: 'IranSans', fontSize: 20 * this.props.App.fontSizeScale, color: isDarkTheme? '#fafafa' : '#000'}}>{card[1]}</Text>
                    <View style={{position: 'absolute', bottom: 10, right: 10, justifyContent: 'center', alignItems: 'center'}}>
                         <TouchableOpacity onPress={this.speakCard.bind(this, card[1])} style={{width: 40, height: 40, borderRadius: 180, backgroundColor: 'grey', borderColor: '#fff', borderWidth: 2, justifyContent: 'center', alignItems: 'center', zIndex: 500}}>
                            <Text style={{fontFamily: 'Icons', fontSize: 23 * this.props.App.fontSizeScale, color: '#fff'}}>&#xE050;</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </FlipCard>
        </View>
        )
    }
    render() {
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return (
            <View style={{flex: 1, backgroundColor: isDarkTheme? darkTheme.background : '#fff'}}>
                <Header>
                    <Left style={{flexDirection: 'row'}}>
                        <Text onPress={() => this.props.App.rootNavigator.pop()} style={{color: '#fff', fontFamily: 'Icons', fontSize: 22}}>&#xE5C4;</Text>
                    </Left>
                    <Body />
                    <Right><Title style={{fontFamily: 'IranSans', fontSize: 18}}>مطالعه کارت ها</Title></Right>
                </Header>
                    <FlatList
                        style={{flex: 1, width: '100%'}}
                        data={this.state.cards} 
                        renderItem={this.renderCard.bind(this)} 
                    />
            </View>
        )
    }
}

var styles = {
    card: {
        height: 250,
        width: 250,
        elevation: 4,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    }
}

export default CardsScreen
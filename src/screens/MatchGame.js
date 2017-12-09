import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, AsyncStorage, TouchableWithoutFeedback, StatusBar, Image } from 'react-native'
import {
	Container,
	Header,
	Title,
	Left,
	Right,
	Body,
	Icon
} from 'native-base'
const { width: D_width, height: D_height } = Dimensions.get('window')
import tts from 'react-native-android-speech'
import uuid from 'uuid/v4'
import { inject, observer } from 'mobx-react'
import * as Animatable from 'react-native-animatable'; 
require('./ToFarsiDigit')

let HEADER_HEIGHT = 55
let WAITING_FOR_SECOND_CARD_SELECT = false
let ELPASSED_SEC = 0

String.prototype.makeShort = function() {
    if(this.length > 50) {
        return `${this.slice(0, 50)}...`
    }
    return this.toString()
}


@inject('App') @observer
export default class MatchGame extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cards: this.props.cards.concat(),
            set_id: this.props.set_id,
            gameCards: [],
            first_card: '',
            second_card: '',
            correct_cards_ids: [],
            wrong_cards_ids: [],
            gameFinished: false,
            speakEnabled: false,
            BigAddedSecondWhenWrongVisible: false,
            gameFinished: false
        }
    }
    makeGameCards(cards) {
        let shuffledCards = this.shuffleArray(cards.concat())
        let gameCards = []
        let i = 0;
        for(let card of shuffledCards) {
            if(i === 6) break 
            gameCards.push({_id: uuid(), main_card_id: card[2], val: card[0], image: card.length > 3? card[3]: ''})
            gameCards.push({_id: uuid(), main_card_id: card[2], val: card[1], image: card.length > 3? card[4]: ''})
            i++
        }
        console.log(gameCards)
        return this.shuffleArray(gameCards)
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
        this.setState({gameCards: this.makeGameCards(this.state.cards)})
    }
    componentWillUnmount() {
        this.setState({first_card_id: ''})
        WAITING_FOR_SECOND_CARD_SELECT = false
        ELPASSED_SEC = 0
        
    }
    checkMatch(first_card_id, second_card_id) {
        let first_card = this.state.gameCards.find(card => card._id === first_card_id)
        let second_card = this.state.gameCards.find(card => card._id === second_card_id)

        if(first_card.main_card_id === second_card.main_card_id) {
            return true
        }  
        return false
    }
    handleCardPress(_id) {
        clearTimeout(this.wrongTimeout)
        if(this.state.speakEnabled) {
            this.speakCard(this.state.gameCards.find(card => card._id == _id).val)
        }
        if(WAITING_FOR_SECOND_CARD_SELECT) {
            let second_card_id = _id
            //if same card pressed
            if(this.state.first_card_id === second_card_id) {
                this.setState({first_card_id: ''})
                WAITING_FOR_SECOND_CARD_SELECT = false
                return
            }
            if(this.checkMatch(this.state.first_card_id, second_card_id)) {
                //correct
                //alert('درست')
                if(this.state.correct_cards_ids.length + 2 == this.state.gameCards.length) return this.setState({gameFinished: true})
                this.setState({ 
                    first_card_id: '',
                    correct_cards_ids: [...this.state.correct_cards_ids, this.state.first_card_id, second_card_id],
                })

            } else {
                //wrong
                //alert('غلط')
                this.setState({
                    first_card_id: '',
                    wrong_cards_ids: [this.state.first_card_id, second_card_id]
                })
                ELPASSED_SEC+= 1
                if(!this.state.BigAddedSecondWhenWrongVisible) {
                    this.setState({BigAddedSecondWhenWrongVisible: true}) 
                } else {
                    this.setState({BigAddedSecondWhenWrongVisible: false}) 
                } 
                this.wrongTimeout = setTimeout(() => {
                    this.setState({
                        wrong_cards_ids: [],
                        BigAddedSecondWhenWrongVisible: false
                    })
                    
                }, 1000)
            }
            WAITING_FOR_SECOND_CARD_SELECT = false
            //check if first card is related to second card
        } else if(!WAITING_FOR_SECOND_CARD_SELECT) {
            this.setState({first_card_id: _id})
            WAITING_FOR_SECOND_CARD_SELECT = true
        }
    } 
    renderGameCards() {
        let width = (D_width - 7.5) / 3 - 10
        let height = (D_height - HEADER_HEIGHT - 32.5) / 4 - 10
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        
        return (
            <View style={{flex: 1, flexWrap: 'wrap', flexDirection: 'row', padding: 7.5 /2, backgroundColor: isDarkTheme? darkTheme.background : '#fafafa'}}>
                {this.state.gameCards.map((card, i) => {
                    var themeBackground = isDarkTheme? darkTheme.cardBackground : '#fff'
                    let backgroundColor = this.state.first_card_id === card._id? '#ffd957' : //yellow
                        this.state.correct_cards_ids.includes(card._id)? '#5fc694' : //green
                        this.state.wrong_cards_ids.includes(card._id)? '#ff9584' : themeBackground //red
                    let opacity =this.state.correct_cards_ids.includes(card._id)? 0 : 1
                    return (
                        <TouchableWithoutFeedback
                            onPress={this.handleCardPress.bind(this, card._id)}
                            disabled={this.state.correct_cards_ids.includes(card._id)}
                            key={`card${i}`}>
                                <View 
                                    style={{width, height, backgroundColor, margin: 5, borderWidth: 2, borderColor: isDarkTheme? darkTheme.headerBackground : '#dadee0', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                                    {card.image?<Image source={{uri: card.image}} style={{width: width - 30, height: height - 30}} /> : null}
                                    <Text style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : 'grey', fontSize: 14 * this.props.App.fontSizeScale}}>{card.val.makeShort()}</Text>
                                </View>
                        </TouchableWithoutFeedback>

                    )
                })}
            </View>
        )
    }
    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    renderBigAddedSecondWhenWrong() {
        return (
            <Animatable.View ref="bigAddedSecondWhenWrong" style={{position: 'absolute', top: 200, left: 100, opacity: 1}}>
                <Animatable.Text style={{color: 'brown', fontSize: 30}}>
                    + 1 ثانیه
                </Animatable.Text>
            </Animatable.View>
        )
    }
    render() {
        console.log(this.state.correct_cards_ids)
        return (
            <Container style={{backgroundColor: '#fff'}}>
                <Header style={{height: HEADER_HEIGHT}}>
                    <Left style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text onPress={() => this.props.App.rootNavigator.pop()} style={{color: '#fff', fontFamily: 'Icons', fontSize: 22, marginRight: 10}}>&#xE5C4;</Text>
                        {this.state.speakEnabled?
                            <Icon onPress={() => this.setState({speakEnabled: false})} name="md-volume-up" style={{color: '#fff'}} />
                        :
                            <Icon onPress={() => this.setState({speakEnabled: true})} name="md-volume-down" style={{color: '#fff'}} />}
                    </Left>
                    <Body />
                    <Right><TimeCounter finished={this.state.gameFinished} /></Right>
                </Header>
                <View style={{flex: 1}}>
                    {this.state.gameFinished?
                    <GameFinishedScreen 
                        elpassed_sec={ELPASSED_SEC} 
                        set_id={this.state.set_id} 
                        rePlay={() => {
                            WAITING_FOR_SECOND_CARD_SELECT = false
                            this.setState({
                                gameCards: this.makeGameCards(this.state.cards), 
                                gameFinished: false,
                                correct_cards_ids: [],
                                wrong_cards_ids: []
                            })
                            ELPASSED_SEC = 0;
                        }}
                    /> :
                     this.renderGameCards()}
                </View>
                {this.state.BigAddedSecondWhenWrongVisible? <BigAddedSecondWhenWrong /> : null}
            </Container>
        )
    }
}


class TimeCounter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            elpassed_sec: 0
        }
    }
    componentDidMount() {
        this.timeInterval = setInterval(() => {
            this.setState({elpassed_sec: ELPASSED_SEC + 0.1})
            ELPASSED_SEC+=0.1
        }, 100)
    }
    componentWillUnmount() {
        clearInterval(this.timeInterval)
    }
    shouldComponentUpdate(nextProp, nextState) {
        if(this.props.finished !== nextProp.finished && nextProp.finished) {
            clearInterval(this.timeInterval)
            return true
        }
        if(this.state.elpassed_sec !== nextState.elpassed_sec) {
            return true
        }
        if(this.props.finished !== nextProp.finished && !nextProp.finished) {
            this.timeInterval = setInterval(() => {
                this.setState({elpassed_sec: ELPASSED_SEC + 0.1})
                ELPASSED_SEC+=0.1
            }, 100)
            return true
        }
        return false
    }
    render() {
        return (
            <Text style={{color: '#fff', fontSize: 14}}>{this.state.elpassed_sec.toFixed(1)} ثانیه</Text>
        )
    }
}


class BigAddedSecondWhenWrong extends Component {
    constructor(props) {
        super(props)
        this.state = {
            opacity: 1,
            top: D_height * 38 / 100,
            left: D_width * 38 / 100
        }
    }
    componentDidMount() {
        this.refs.view.transitionTo({opacity: 0, top: D_height * 5 / 100, left: D_width * 72 / 100}, 750)
    }
    render() {
        return (
            <Animatable.View ref="view" style={{position: 'absolute', opacity: this.state.opacity, top: this.state.top, left: this.state.left}}> 
                <Text style={{color: 'brown', fontSize: 30, fontFamily: 'IranSans'}}>
                    1 ثانیه +
                </Text>                
            </Animatable.View>
        )
    }
}


@inject('SetsRecords', 'App') @observer
class GameFinishedScreen extends Component {
    componentDidMount() {
        fetch(`${this.props.App.serverURL}/stats/game_finished?point=${this.props.elpassed_sec.toString()}`)
        .then(res => res.json())
        .then(resData => console.log(resData))
    }
    shouldComponentUpdate() {
        return false;
    }
    render() {
        var is_new_record, previous_point
        let set_records = this.props.SetsRecords.Sets.find(set => set._id === this.props.set_id)
        //alert(JSON.stringify(set_records))
        let set_index = this.props.SetsRecords.Sets.map(set => set._id).indexOf(this.props.set_id)
        //alert(JSON.stringify(set_records))
        if(set_index > -1) {
            if(set_records.hasOwnProperty('match_game')) {
                if(parseFloat(set_records.match_game.record, 10) > this.props.elpassed_sec) {
                    is_new_record = true
                    this.props.SetsRecords.Sets[set_index]['match_game']['record'] = this.props.elpassed_sec.toFixed(1);
                    //alert('new record')
                } else {
                    is_new_record = false
                    //alert('no new record')
                }
            } else {
                is_new_record = true
                
                this.props.SetsRecords.Sets[set_index] = Object.assign({}, this.props.SetsRecords.Sets[set_index], {match_game: {record: this.props.elpassed_sec.toFixed(1)}})
                //['match_game']['record'] = ; 
                //alert('first game. so new record')  
            }
        } else {
            is_new_record = true
            this.props.SetsRecords.Sets.push({_id: this.props.set_id, match_game: {record: this.props.elpassed_sec.toFixed(1)}})
            //alert('first game and first in all app feature. so new record')
        }
        AsyncStorage.setItem('SetsRecords', JSON.stringify(this.props.SetsRecords.Sets))
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text onPress={() => this.props.rePlay()} style={{fontFamily: 'Icons', fontSize: 55, color: '#4257b2'}}>replay</Text>
                <Text style={{fontFamily: 'IranSans', fontSize: 35}}>{this.props.elpassed_sec.toFixed(1).toFaDigit()} <Text style={{fontSize: 26}}>ثانیه</Text></Text>
                <Text style={{fontFamily: 'IranSans', fontSize: 22}}>{is_new_record? 'رکورد جدید' : ''}</Text>
                <Text style={{fontFamily: 'IranSans', fontSize: 22}}>{!is_new_record? 'بهترین رکورد: ' + this.props.SetsRecords.Sets.find(set => set._id === this.props.set_id).match_game.record.toFaDigit() : ''}</Text>
            </View>           
        )
    }
}


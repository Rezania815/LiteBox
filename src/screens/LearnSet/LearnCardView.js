// first we get cards from previous screen
// then we show cards to user and ask him if he knew the back or not
// if he knew, we put the card inside stage2 of learning in set records
// then after 24 hours we unlock stage 2 
// this procedure will continue till stage 4
// when all cards transfered to stage 4, learning has completed.

import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, AsyncStorage, BackHandler, Image } from 'react-native'
import tts from 'react-native-android-speech'
import Ghostwriter from 'react-native-ghostwriter';
var { width: D_width, height: D_height } = Dimensions.get('window')
import Button from 'react-native-flat-button'
import { inject, observer } from 'mobx-react'


@inject('SetsRecords', 'App') @observer
export default class LearnCardView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            set: Object.assign({}, this.props.set),
            cards: this.props.set.cards.concat(),
            pos: 0,
            side: 0
        }
    }
    componentDidMount() {
        //alert(JSON.stringify(this.props.SetsRecords))
    }
    flipCard() {
        this.setState({side: 1})
    }
    changePos(val) {
         let cards = this.state.cards.filter(card => this.props.stage_cards.includes(card[2]))
        if(this.state.pos + val == cards.length) {
            //alert('تمام')
            this.setState({stage_emptied: true})
            return true;
        }
        /*if(this.state.pos + val < 0) {
            this.setState({pos: cards.length - 1});
            return true;            
        }*/
        this.setState({pos: this.state.pos + val, side: 0});
        this.speakCard(cards[this.state.pos + val][0]);
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
    I_did_knew(card_id) {
        if(this.props.stage_number === 4) { // if we are in latest stage. just go next card
            return this.changePos(+1)
        }
        let set_records = this.props.SetsRecords.Sets.find(set => set._id == this.state.set._id)
        let set_index = this.props.SetsRecords.Sets.map(set => set._id).indexOf(this.state.set._id)

        //add the card to next stage
        this.props.SetsRecords.Sets[set_index]['learn']['stage' + (this.props.stage_number + 1).toString()].cards.push(card_id)
        
        //remove the card from its stage
        let card_index = this.props.SetsRecords.Sets[set_index]['learn']['stage' + this.props.stage_number].cards.indexOf(card_id)
        this.props.SetsRecords.Sets[set_index]['learn']['stage' + this.props.stage_number].cards.splice(card_index, 1)

        // add unlockDate to next stage if already not set
        if(!this.props.SetsRecords.Sets[set_index]['learn']['stage' + (this.props.stage_number+1)].unlockDate) {
            var onHourLater = new Date();
            onHourLater.setTime(onHourLater.getTime() + 1000 * 60  * 60 *  (this.props.stage_number + 1) ** 2);
            this.props.SetsRecords.Sets[set_index]['learn']['stage' + (this.props.stage_number+1)].unlockDate = onHourLater / 1000
        }
        AsyncStorage.setItem('SetsRecords', JSON.stringify(this.props.SetsRecords.Sets))
        this.changePos(0)
    }
    I_did_not_know(card_id) {
        
        let set_records = this.props.SetsRecords.Sets.find(set => set._id == this.state.set._id)
        let set_index = this.props.SetsRecords.Sets.map(set => set._id).indexOf(this.state.set._id)

        //add the card to first stage
        this.props.SetsRecords.Sets[set_index]['learn']['stage1'].cards.push(card_id)
        
        //remove the card from current stage
        let card_index = this.props.SetsRecords.Sets[set_index]['learn']['stage' + this.props.stage_number].cards.indexOf(card_id)
        this.props.SetsRecords.Sets[set_index]['learn']['stage' + this.props.stage_number].cards.splice(card_index, 1)

        AsyncStorage.setItem('SetsRecords', JSON.stringify(this.props.SetsRecords.Sets))
        if(this.props.stage_number == 1) {
            this.changePos(+1)
        } else {
            this.changePos(0)
        }
        
    }
    renderCardView() {
        let stage_number = this.props.stage_number
        let cards = this.state.cards.filter(card => this.props.stage_cards.includes(card[2]))
        var CARD_SIZE = D_width - 25;
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme  
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 5, justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity
                       style={[{width: CARD_SIZE, height: CARD_SIZE, backgroundColor: isDarkTheme? darkTheme.cardBackground : '#fff'}, styles.card]}
                       onPress={this.flipCard.bind(this)}>
                            <View style={{position: 'absolute', left: 10, top: 10}}>
                                <Text style={{color: isDarkTheme? '#fafafa' : 'grey', fontSize: 14 * this.props.App.fontSizeScale}}>{(this.state.pos + 1) + ' / ' + cards.length}</Text>
                            </View>
                            {cards[this.state.pos].length> 3?<Image source={{uri: cards[this.state.pos][this.state.side + 3]}} style={{width: 55, height: 55}} /> : null}
                            <Text style={{color: isDarkTheme? '#fafafa' : '#000', fontSize: 31 * this.props.App.fontSizeScale, fontFamily: 'Yekan'}}>{cards[this.state.pos][this.state.side]}</Text>
                    </TouchableOpacity>      
                    <View style={{position: 'absolute', bottom: -15, right: 30, justifyContent: 'center', alignItems: 'center', zIndex: 500}}>
                         <TouchableOpacity onPress={this.speakCard.bind(this, cards[this.state.pos][0])} style={{width: 60, height: 60, borderRadius: 180, backgroundColor: 'grey', borderColor: '#fff', borderWidth: 2, justifyContent: 'center', alignItems: 'center', zIndex: 500}}>
                            <Text style={{fontFamily: 'Icons', fontSize: 23 * this.props.App.fontSizeScale, color: '#fff'}}>&#xE050;</Text>
                        </TouchableOpacity>
                    </View>             
                </View>

                <View style={{flex: 2, flexDirection: 'row'}}>
                    {this.state.side == 0? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Button
                            type="primary"
                            onPress={this.flipCard.bind(this)}
                            containerStyle={styles.buttonContainer}
                            shadowHeight={5}
                            >
                                نمایش پاسخ
                        </Button>
                    </View> :
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Button
                                type="primary"
                                onPress={this.I_did_not_know.bind(this, cards[this.state.pos][2])}
                                containerStyle={{width: 150, height: 50, marginVertical: 5}}
                                shadowHeight={5}
                                >
                                    بلد نبودم
                            </Button>
                        </View>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Button
                                type="primary"
                                onPress={this.I_did_knew.bind(this, cards[this.state.pos][2])}
                                containerStyle={{width: 150, height: 50, marginVertical: 5}}
                                shadowHeight={5}
                                >
                                    بلد بودم
                            </Button>
                        </View>
                    </View>}
                </View>
            </View>
        )
    }
    render() {
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme  
        return (
            <View style={[styles.container, {backgroundColor: isDarkTheme? darkTheme.background : '#fafafa'}]}>
                <View style={{height: 55, width: D_width, backgroundColor: '#4257b2', elevation: 4}}>
                    <TouchableOpacity onPress={() => {}} style={{position: 'absolute', top: 65/2/2, left: 10, justifyContent: 'center'}}><Text style={{color: '#fff', fontFamily: 'Icons', fontSize: 22}}>&#xE5C4;</Text></TouchableOpacity>
                    <View style={{flex: 5, justifyContent: 'center'}}>
                        <Text style={{color: '#fff', fontFamily: 'IranSans', marginRight: 7.5}}>خانه {this.props.stage_number}</Text>
                    </View>
                </View>
                {!this.state.stage_emptied?
                    this.renderCardView()
                :
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: isDarkTheme? '#fff' : '#000', fontSize: 21, fontFamily: 'IranSans'}}>کارت های این خانه مرور شد</Text>
                    </View>
                }
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        borderRadius: 10, 
        elevation: 4, 
        padding: 15, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    buttonContainer: {
        width: 200,
        height: 50,
        marginVertical: 5
    },
})




/*@inject('SetsRecords') @observer
export default class FlashCardScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            set: Object.assign({}, this.props.set),
            cards: this.props.set.cards.concat(),
            pos: 0,
            side: 0,
        }
    }
    componentDidMount() {
        //this.speakCard(this.state.cards[0][0]);

        //filter unlearned cards from set records
        let index_of_set_in_records = this.props.SetsRecords.Sets.map(set => set._id).indexOf(this.state.set._id)
        if(index_of_set_in_records > -1) {
            this.setState({
                cards: this.state.cards.filter(card => !this.props.SetsRecords.Sets[index_of_set_in_records].learned_cards.includes(card[2]))
            })
        }
    }
    flipCard() {
        this.setState({side: 1})
    }
    changePos(val) {
        if(this.state.pos + val >= this.state.cards.length) {
            this.setState({pos: 0});
            return true;
        }
        if(this.state.pos + val < 0) {
            this.setState({pos: this.state.cards.length - 1});
            return true;            
        }
        this.setState({pos: this.state.pos + val, side: 0});
        this.speakCard(this.state.cards[this.state.pos + val][0]);
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
    I_did_knew(card_id) {
        //alert(JSON.stringify(this.props.SetsRecords.Sets))
        //checl if set already has records
        let SetRecord = this.props.SetsRecords.Sets.find(set => set._id == this.state.set._id)
        if(SetRecord) {
            //if this card was not already learned (just in case)
            if(!SetRecord.learned_cards.includes(card_id)) {
                let set_index = this.props.SetsRecords.Sets.map(set => set._id).indexOf(this.state.set._id)
                this.props.SetsRecords.Sets[set_index].learned_cards.push(card_id)
                this.changePos(1)
                return
            }
        }
        //else if no recoed found for the set add one
        this.props.SetsRecords.Sets.push({_id: this.state.set._id, learned_cards: [card_id]})
        this.changePos(1)
    }
    I_did_not_know(card_id) {
        this.changePos(1)
    }
    render() {
        var CARD_SIZE = D_width - 25;
        return (
            <View style={styles.container}>
                <View style={{height: 55, width: D_width, backgroundColor: '#4257b2', elevation: 4}}>
                    <TouchableOpacity onPress={() => {}} style={{position: 'absolute', top: 65/2/2, left: 10, justifyContent: 'center'}}><Text style={{color: '#fff', fontFamily: 'Icons', fontSize: 22}}>&#xE5C4;</Text></TouchableOpacity>
                    <View style={{flex: 5}}></View>
                </View>
                <View style={{flex: 5, justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity
                       style={[{width: CARD_SIZE, height: CARD_SIZE}, styles.card]}
                       onPress={this.flipCard.bind(this)}>
                            <View style={{position: 'absolute', left: 10, top: 10}}>
                                <Text>{(this.state.pos + 1) + ' / ' + this.state.cards.length}</Text>
                            </View>
                            <Text style={{color: '#000', fontSize: 31, fontFamily: 'Yekan'}}>{this.state.cards[this.state.pos][this.state.side]}</Text>
                    </TouchableOpacity>
                    <View style={{position: 'absolute', bottom: -15, right: 30, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity onPress={this.speakCard.bind(this, this.state.cards[this.state.pos][0])} style={{width: 60, height: 60, borderRadius: 180, backgroundColor: 'grey', borderColor: '#fff', borderWidth: 2, justifyContent: 'center', alignItems: 'center', zIndex: 5}}>
                            <Text style={{fontFamily: 'Icons', fontSize: 23, color: '#fff'}}>&#xE050;</Text>
                        </TouchableOpacity>
                    </View>                    
                </View>
                <View style={{flex: 2, flexDirection: 'row'}}>
                    {this.state.side == 0? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Button
                            type="primary"
                            onPress={this.flipCard.bind(this)}
                            containerStyle={styles.buttonContainer}
                            shadowHeight={5}
                            >
                                نمایش پاسخ
                        </Button>
                    </View> :
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Button
                                type="primary"
                                onPress={this.I_did_not_know.bind(this, this.state.cards[this.state.pos][2])}
                                containerStyle={{width: 150, height: 50, marginVertical: 5}}
                                shadowHeight={5}
                                >
                                    بلد نبودم
                            </Button>
                        </View>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Button
                                type="primary"
                                onPress={this.I_did_knew.bind(this, this.state.cards[this.state.pos][2])}
                                containerStyle={{width: 150, height: 50, marginVertical: 5}}
                                shadowHeight={5}
                                >
                                    بلد بودم
                            </Button>
                        </View>
                    </View>}
 
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0'
    },
    card: {
        borderRadius: 10, 
        elevation: 4, 
        padding: 15, 
        backgroundColor: '#fff', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    buttonContainer: {
        width: 200,
        height: 50,
        marginVertical: 5
    },
});*/
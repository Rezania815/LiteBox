// first we get cards from previous screen
// then we show cards to user and ask him if he knew the back or not
// if he knew, we put the card inside stage2 of learning in set records
// then after 24 hours we unlock stage 2 
// this procedure will continue till stage 4
// when all cards transfered to stage 4, learning has completed.
// if he did not know a card, it'll return to stage 1 

import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TouchableHighlight, BackHandler, ToastAndroid } from 'react-native'
import Ghostwriter from 'react-native-ghostwriter';
var { width: D_width, height: D_height } = Dimensions.get('window')
import { inject, observer } from 'mobx-react'
import {
	Container,
	Header,
	Title,
	Left,
	Right,
	Body,
	Icon
} from 'native-base'

@inject('SetsRecords', 'App') @observer
export default class Stages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            set: Object.assign({}, this.props.set),
            cards: this.props.set.cards.concat()
        }
    }
    componentDidMount() {
        //alert(this.formatDateToString(1544466666))
        /*setInterval(() => {
            if(this.refs.stage_view) {
                this.forceUpdate()
            }
            
        }, 1000)*/
    }
    goToLearnCardView(stage_number, stage_cards) {
        if(stage_cards.length === 0) {
            return ToastAndroid.show('خانه خالی است', ToastAndroid.SHORT)
        }
        this.props.App.rootNavigator.push({
            screen: 'fc.LearnCardView',
            passProps: {
                set: this.state.set,
                stage_number,
                stage_cards // actually card "ids" array!
            },
            navigatorStyle: {
                navBarHidden: true
            }
        }); 
        
    }
    formatDateToString(seconds) {
        unix = seconds * 1000 * 60
        if(unix < 0) {
            var isNegative = true
        }
        var oneHour = 1000 * 60 * 60 * 60
        var oneMin = 1000 * 60 * 60
        var oneSec = 1000 * 60
        if(unix > 0) {
            if(unix < oneHour) {
                var hours = 'not_enough'
                var remaining_after_hours_cut = unix
            } else {
                var hours = Math.floor(unix / (oneHour))
                var remaining_after_hours_cut = unix % (oneHour)
            }
            
            if(unix < oneMin) {
                var mins = "not_enough"
                remaining_after_mins_cut = unix
            } else {
                var mins =  Math.floor(remaining_after_hours_cut / (oneMin))
                var remaining_after_mins_cut = remaining_after_hours_cut % (oneMin)
            }
            
            var secs = remaining_after_mins_cut / (oneSec)

            return `${hours == 'not_enough'? '' : hours + ' ساعت و '}${mins == 'not_enough'? 'کم تر از یک دقیقه' : mins + ' دقیقه'} ${isNegative? 'قبل': 'دیگر'}`
        }
        
    }
    renderStages() {
        var set_records = this.props.SetsRecords.Sets.find(set => set._id === this.state.set._id)
        //check if a record already defined for this set
        if(set_records) {
            //if learn record found for the set, get it
            if(set_records.hasOwnProperty('learn')) {
                var learn_record = set_records.learn
            //if has'nt a learn property add one!   
            } else {
                let set_index = this.props.SetsRecords.Sets.map(set => set._id).indexOf(this.state.set._id)
                var learn_record = {
                    stage1: {
                        cards: [...this.state.cards.map(card => card[2])],
                        unlocked: true,
                    },
                    stage2: {
                        cards: [],
                        unlocked: false,
                        unlockDate: undefined
                    },
                    stage3: {
                        cards: [],
                        unlocked: false,
                        unlockDate: undefined
                    },
                    stage4: {
                        cards: [],
                        unlocked: false,
                        unlockDate: undefined
                    }
                }
                this.props.SetsRecords.Sets[set_index]['learn'] = learn_record
                learn_record = this.props.SetsRecords.Sets.find(set => set._id === this.state.set._id).learn
            }

        // if set record was not defined already
        } else {
            var learn_record = {
                    stage1: {
                        cards: [...this.state.cards.map(card => card[2])],
                        unlocked: true,
                    },
                    stage2: {
                        cards: [],
                        unlocked: false,
                        unlockDate: undefined
                    },
                    stage3: {
                        cards: [],
                        unlocked: false,
                        unlockDate: undefined
                    },
                    stage4: {
                        cards: [],
                        unlocked: false,
                        unlockDate: undefined
                    }
                }
            this.props.SetsRecords.Sets.push({
                _id: this.state.set._id,
                learn: learn_record
            })
            learn_record = this.props.SetsRecords.Sets.find(set => set._id === this.state.set._id).learn
        }
        let stage2_remaining_time_to_unlock = learn_record.stage2.unlockDate - new Date() / 1000
        let stage3_remaining_time_to_unlock = learn_record.stage3.unlockDate - new Date() / 1000
        let stage4_remaining_time_to_unlock = learn_record.stage4.unlockDate - new Date() / 1000

        let stage_height = 125

        let all_card_length = learn_record.stage1.cards.length + learn_record.stage2.cards.length + learn_record.stage3.cards.length + learn_record.stage4.cards.length
        let stage1_progress_percentage = learn_record.stage1.cards.length / all_card_length
        let stage2_progress_percentage = learn_record.stage2.cards.length / all_card_length
        let stage3_progress_percentage = learn_record.stage3.cards.length / all_card_length
        let stage4_progress_percentage = learn_record.stage4.cards.length / all_card_length

        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme  
        return (
            <View ref="stage_view" style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                    <TouchableHighlight disabled={learn_record.stage2.unlockDate <  new Date() / 1000? false : !learn_record.stage2.unlocked} onPress={this.goToLearnCardView.bind(this, 2, learn_record.stage2.cards)} style={[styles.stageContainer, {width: '39.5%', height: stage_height, backgroundColor: isDarkTheme? darkTheme.cardBackground : '#fff', borderWidth: 3, borderRightWidth: 0, opacity: learn_record.stage2.unlockDate <  new Date() / 1000? 1 :learn_record.stage2.unlocked? 1 : 0.5, borderColor: isDarkTheme? darkTheme.headerBackground : 'grey'}]}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{height: stage2_progress_percentage * stage_height, position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: '#4257b2'}}></View>
                            <Text style={{fontFamily: 'IranSans', fontSize: 14 * this.props.App.fontSizeScale}}>خانه دوم</Text>
                            <Text style={{fontFamily: 'IranSans', fontSize: 14 * this.props.App.fontSizeScale}}>{learn_record.stage2.cards.length} کارت</Text>
                            <Text style={{fontFamily: 'IranSans', fontSize: 14 * this.props.App.fontSizeScale}}>
                                {Number.isNaN(stage2_remaining_time_to_unlock)? 'قفل' : stage2_remaining_time_to_unlock > 0? this.formatDateToString(stage2_remaining_time_to_unlock.toFixed(0)) : learn_record.stage2.cards.length === 0? 'خالی' : 'آماده مطالعه'}
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight disabled={!learn_record.stage1.unlocked} onPress={this.goToLearnCardView.bind(this, 1, learn_record.stage1.cards)} style={[styles.stageContainer, {width: '40%', height: stage_height, backgroundColor: isDarkTheme? darkTheme.cardBackground : '#fff', borderWidth: 3, opacity: learn_record.stage1.unlocked? 1 : 0.5 ,borderColor: isDarkTheme? darkTheme.headerBackground : 'grey'}]}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{height: stage1_progress_percentage * stage_height, position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: '#4257b2'}} />
                            <Text style={{fontFamily: 'IranSans', fontSize: 14 * this.props.App.fontSizeScale}}>خانه اول</Text>
                            <Text style={{fontFamily: 'IranSans', fontSize: 14 * this.props.App.fontSizeScale}}>{learn_record.stage1.cards.length} کارت</Text>
                            
                        </View>
                    </TouchableHighlight>

                </View>
                <View style={{flexDirection: 'row'}}>
                    <TouchableHighlight disabled={learn_record.stage4.unlockDate <  new Date() / 1000? false : !learn_record.stage4.unlocked} onPress={this.goToLearnCardView.bind(this, 4, learn_record.stage4.cards)} style={[styles.stageContainer, {width: '39.5%', height: stage_height, backgroundColor: isDarkTheme? darkTheme.cardBackground : '#fff', borderWidth: 3, borderTopWidth: 0, borderRightWidth: 0, borderColor: isDarkTheme? darkTheme.headerBackground : 'grey', opacity: learn_record.stage4.unlockDate <  new Date() / 1000? 1 :learn_record.stage4.unlocked? 1 : 0.5}]}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{height: stage4_progress_percentage * stage_height, position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: '#4257b2'}} />
                            <Text style={{fontFamily: 'IranSans', fontSize: 14 * this.props.App.fontSizeScale}}>خانه چهارم</Text>
                            <Text style={{fontFamily: 'IranSans', fontSize: 14 * this.props.App.fontSizeScale}}>{learn_record.stage4.cards.length} کارت</Text>
                            <Text style={{fontFamily: 'IranSans', fontSize: 14 * this.props.App.fontSizeScale}}>
                                {Number.isNaN(stage4_remaining_time_to_unlock)? 'قفل' : stage4_remaining_time_to_unlock > 0? this.formatDateToString(stage4_remaining_time_to_unlock.toFixed(0)) + ' دیگر' :  learn_record.stage4.cards.length === 0? 'خالی' : 'آماده مطالعه'}
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight disabled={learn_record.stage3.unlockDate <  new Date() / 1000? false : !learn_record.stage3.unlocked} onPress={this.goToLearnCardView.bind(this, 3, learn_record.stage3.cards)} style={[styles.stageContainer, {width: '40%', height: stage_height, backgroundColor: isDarkTheme? darkTheme.cardBackground : '#fff', borderWidth: 3, borderTopWidth: 0, borderColor: isDarkTheme? darkTheme.headerBackground : 'grey', opacity: learn_record.stage3.unlockDate <  new Date() / 1000? 1 :learn_record.stage3.unlocked? 1 : 0.5}]}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{height: stage3_progress_percentage * stage_height, position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: '#4257b2'}} />
                            <Text style={{fontFamily: 'IranSans', fontSize: 14 * this.props.App.fontSizeScale}}>خانه سوم</Text>
                            <Text style={{fontFamily: 'IranSans', fontSize: 14 * this.props.App.fontSizeScale}}>{learn_record.stage3.cards.length} کارت</Text>
                            <Text style={{fontFamily: 'IranSans', fontSize: 14 * this.props.App.fontSizeScale}}>
                                {Number.isNaN(stage3_remaining_time_to_unlock)? 'قفل' : stage3_remaining_time_to_unlock > 0? this.formatDateToString(stage3_remaining_time_to_unlock.toFixed(0)) + ' دیگر' : learn_record.stage3.cards.length === 0? 'خالی' : 'آماده مطالعه'}
                            </Text>
                        </View>
                    </TouchableHighlight>


                </View>

            </View>
        )
    }
    handleStagePress(stage_number, stage_cards) {
        this.setState({showing_stage_number: stage_number, showing_stage_cards: stage_cards, stagesScreenVisible: false})
    }
    render() {
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return (
            <View style={[styles.container, {backgroundColor: isDarkTheme? darkTheme.background : '#fafafa'}]}>
                <Header>
                    <Left>
                        <Text onPress={() => this.props.App.rootNavigator.pop()} style={{color: '#fff', fontFamily: 'Icons', fontSize: 22, marginRight: 10}}>&#xE5C4;</Text>
                    </Left>
                    <Body />
                    <Right><Title style={{fontFamily: 'IranSans', fontSize: 18}}>یادگیری</Title></Right>
                </Header>
                {this.renderStages()}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    stageContainer: {
        width: '40%',
        height: '25%'
    }
})


//#4257b2

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
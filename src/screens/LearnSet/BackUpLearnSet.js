// first we get cards from previous screen
// then we show cards to user and ask him if he knew the back or not
// if he knew, we put the card inside stage2 of learning in set records
// then after 24 hours we unlock stage 2 
// this procedure will continue till stage 4
// when all cards transfered to stage 4, learning has completed.

import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, BackHandler } from 'react-native'
import tts from 'react-native-android-speech'
import Ghostwriter from 'react-native-ghostwriter';
var { width: D_width, height: D_height } = Dimensions.get('window')
import Button from 'react-native-flat-button'
import { inject, observer } from 'mobx-react'


@inject('SetsRecords', 'App') @observer
export default class FlashCardScreen extends Component {
    constructor(props) {
        super(props);
		this.props.App.rootNavigator.setOnNavigatorEvent(
			this.onNavigatorEvent.bind(this)
		)
        this.state = {
            set: Object.assign({}, this.props.set),
            cards: this.props.set.cards.concat(),
            pos: 0,
            side: 0,
            stagesScreenVisible: true
        }
    }
	onNavigatorEvent(event) {
		if (event.id === 'backPress') {
            if(!this.state.stagesScreenVisible) {
                this.setState({stagesScreenVisible: true})
                return
            }
            //this.props.App.rootNavigator.pop()
		}
	}
    componentDidMount() {
        //this.speakCard(this.state.cards[0][0]);

        //filter unlearned cards from set records
/*        let index_of_set_in_records = this.props.SetsRecords.Sets.map(set => set._id).indexOf(this.state.set._id)
        if(index_of_set_in_records > -1) {
            this.setState({
                cards: this.state.cards.filter(card => !this.props.SetsRecords.Sets[index_of_set_in_records].learned_cards.includes(card[2]))
            })
        }*/
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
        let set_records = this.props.SetsRecords.Sets.find(set => set._id == this.state.set._id)
        let set_index = this.props.SetsRecords.Sets.map(set => set._id).indexOf(this.state.set._id)

        //add the card to next stage
        this.props.SetsRecords.Sets[set_index]['learn']['stage' + (this.state.showing_stage_number + 1).toString()].cards.push(card_id)
        
        //remove the card from its stage
        let card_index = this.props.SetsRecords.Sets[set_index]['learn']['stage' + this.state.showing_stage_number].cards.indexOf(card_id)
        this.props.SetsRecords.Sets[set_index]['learn']['stage' + this.state.showing_stage_number].cards.splice(card_index, 1)

        this.changePos(+1)

    }
    I_did_not_know(card_id) {
        this.changePos(1)
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
        }
        return (
            <View style={{flex: 1, alignItems: 'center'}}>
                <TouchableOpacity onPress={this.handleStagePress.bind(this, 1, learn_record.stage1.cards)} style={{width: 125, height: 50, borderWidth: 3, borderColor: '#000', margin: 5}}>
                    <Text>{learn_record.stage1.cards.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleStagePress.bind(this, 2, learn_record.stage2.cards)} style={{width: 125, height: 50, borderWidth: 3, borderColor: '#000', margin: 5}}>
                    <Text>{learn_record.stage2.cards.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleStagePress.bind(this, 3, learn_record.stage3.cards)} style={{width: 125, height: 50, borderWidth: 3, borderColor: '#000', margin: 5}}>
                    <Text>{learn_record.stage3.cards.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleStagePress.bind(this, 4, learn_record.stage4.cards)} style={{width: 125, height: 50, borderWidth: 3, borderColor: '#000', margin: 5}}>
                    <Text>{learn_record.stage4.cards.length}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    handleStagePress(stage_number, stage_cards) {
        this.setState({showing_stage_number: stage_number, showing_stage_cards: stage_cards, stagesScreenVisible: false})
    }
    renderCardView() {
        let stage_number = this.state.showing_stage_number
        let cards = this.state.cards.filter(card => this.state.showing_stage_cards.includes(card[2]))
        var CARD_SIZE = D_width - 25;
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 5, justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity
                       style={[{width: CARD_SIZE, height: CARD_SIZE}, styles.card]}
                       onPress={this.flipCard.bind(this)}>
                            <View style={{position: 'absolute', left: 10, top: 10}}>
                                <Text>{(this.state.pos + 1) + ' / ' + cards.length}</Text>
                            </View>
                            <Text style={{color: '#000', fontSize: 31, fontFamily: 'Yekan'}}>{cards[this.state.pos][this.state.side]}</Text>
                    </TouchableOpacity>
                    <View style={{position: 'absolute', bottom: -15, right: 30, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity onPress={this.speakCard.bind(this, cards[this.state.pos][0])} style={{width: 60, height: 60, borderRadius: 180, backgroundColor: 'grey', borderColor: '#fff', borderWidth: 2, justifyContent: 'center', alignItems: 'center', zIndex: 5}}>
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
        
        return (
            <View style={styles.container}>
                <View style={{height: 55, width: D_width, backgroundColor: '#4257b2', elevation: 4}}>
                    <TouchableOpacity onPress={() => {}} style={{position: 'absolute', top: 65/2/2, left: 10, justifyContent: 'center'}}><Text style={{color: '#fff', fontFamily: 'Icons', fontSize: 22}}>&#xE5C4;</Text></TouchableOpacity>
                    <View style={{flex: 5}}><Text>مرحله {this.state.showing_stage_number}</Text></View>
                </View>
                {this.state.stagesScreenVisible? this.renderStages() : this.renderCardView()}
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
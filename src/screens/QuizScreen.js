import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, FlatList, TouchableNativeFeedback, ToastAndroid, TextInput, Button, Switch } from 'react-native'
import {
	Container,
	Header,
	Title,
	Left,
	Right,
	Body,
	Icon
} from 'native-base'
import { inject, observer } from 'mobx-react'

const { width: D_width, height: D_height } = Dimensions.get('window')


@inject('App') @observer
export default class QuizScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cards: this.props.cards,
            questions: [],
            questPos: 0,
            answerWasCorrect: 'not defined!',
            quizSettings: {
                make_question_from_front: true,
                make_question_from_back: false,
                instant_show_answer: true,
                user_question_number: this.props.cards.length.toString()
            },
            userAnswer: {val: '', main_card_id: ''},
            quizStarted: false,
            quizFinished: false,
            corrects: [],
            wrongs: []
        }
    }
    componentDidMount() {
        
    }
    makeQuestions(cards) {
        console.log('jj')
        cards = this.shuffleArray(cards.concat())
        console.log(cards)
        let questions = []
        let makeWrongAnswers = (currectAnswer, questionIsFrontOrBack) => {
            let wrongAnswers = []
            let shuffledCards = this.shuffleArray(cards.concat())
            let i = 0
            for(let card of shuffledCards) {
                if(i === 3) break;
                if(card[2] == currectAnswer.main_card_id) continue
                wrongAnswers.push({val: card[1 - questionIsFrontOrBack], img: card.length > 3? card[1 - questionIsFrontOrBack + 3] : '', main_card_id: card[2]})
                i++
            }
            i=0;
            return wrongAnswers
        }
        let j=0
        for(let card of cards) {
            if(j == this.state.quizSettings.user_question_number) break;
            if(this.state.quizSettings.make_question_from_front && this.state.quizSettings.make_question_from_back) {
                var frontOrBack = Math.floor(Math.random() * 2);
            }
            if(this.state.quizSettings.make_question_from_front && !this.state.quizSettings.make_question_from_back){
               var frontOrBack = 0
               //console.log('front')
            }
            if(!this.state.quizSettings.make_question_from_front && this.state.quizSettings.make_question_from_back){
                var frontOrBack = 1
            }      
            let correctAnswer = {val: card[1 - frontOrBack], img: card.length > 3? card[1 - frontOrBack + 3] : '', main_card_id: card[2]}
            let wrongAnswers = makeWrongAnswers(correctAnswer, frontOrBack)
            questions.push({
                text: card[frontOrBack],
                img: card.length > 3? card[frontOrBack + 3] : '',
                answers: this.shuffleArray([...wrongAnswers, correctAnswer]),
                correctAnswer,
                main_card_id: card[2]
            })
            j++
        }
        console.log(questions)
        this.setState({questions, quizStarted: true})
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
    checkAnswer(correctAnswer, userAnswer) {
        clearTimeout(this.nextQuestionTimeout)
        if(correctAnswer.main_card_id === userAnswer.main_card_id) {
            if(this.state.quizSettings.instant_show_answer) {
                this.setState({answerWasCorrect: true, userAnswer, lockTouch: true, corrects: [...this.state.corrects, this.state.questions[this.state.questPos]]})
            } else {
                this.setState({userAnswer, lockTouch: true, corrects: [...this.state.corrects, this.state.questions[this.state.questPos]]})
            }  
        } else {
            if(this.state.quizSettings.instant_show_answer) {
                this.setState({answerWasCorrect: false, userAnswer, lockTouch: true, wrongs: [...this.state.wrongs, {...this.state.questions[this.state.questPos], userAnswer}]})
            } else {
                this.setState({userAnswer, lockTouch: true, wrongs: [...this.state.wrongs, {...this.state.questions[this.state.questPos], userAnswer}]})
            }
        }
        this.nextQuestionTimeout = setTimeout(() => {
          this.goToNextQuestion()  
        }, 1000)
    }
    goToNextQuestion() {
        if(this.state.questions.length-1 === this.state.questPos) return this.setState({quizFinished: true})
        this.setState({questPos: this.state.questPos + 1, answerWasCorrect: 'not defined!', userAnswer: {val: '', main_card_id: ''}, lockTouch: false})
    }
    renderQuiz() {
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
                    {this.state.questions[this.state.questPos].img?
                    <Image source={{uri: this.state.questions[this.state.questPos].img}} style={{width: 65, height: 65}} />
                    :
                    null} 
                    <Text style={{fontSize: 25 * this.props.App.fontSizeScale, fontFamily: 'IranSans', marginRight: 10, color: isDarkTheme? '#fafafa' : 'grey'}}>
                        {this.state.questions[this.state.questPos].text}
                    </Text>
                </View>
                <View style={{flex: 2, flexWrap: 'wrap', flexDirection: 'row'}}>
                    {this.state.questions[this.state.questPos].answers.map((answer, i) => {
                        return <TouchableNativeFeedback 
                                    key={`answer${i+1}`}
                                    disabled={this.state.lockTouch}
                                    onPress={this.checkAnswer.bind(this, this.state.questions[this.state.questPos].correctAnswer, answer)}>
                                    <View style={{width: D_width / 2 - 30, margin: 15, borderColor: 'grey', padding: 10, borderWidth: 3, height: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: this.state.answerWasCorrect != "not defined!"? this.state.questions[this.state.questPos].correctAnswer.main_card_id === answer.main_card_id? '#2E7D32' : this.state.userAnswer.main_card_id == answer.main_card_id? '#DD2C00' : isDarkTheme? darkTheme.cardBackground : '#fff' : this.state.userAnswer.main_card_id == answer.main_card_id? 'blue' : isDarkTheme? darkTheme.cardBackground : '#fff'}}>
                                        {answer.img? <Image source={{uri: answer.img}} style={{width: 35, height: 35}} /> : null}
                                        <Text style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : 'grey', fontSize: 14 * this.props.App.fontSizeScale}}>{answer.val}</Text>
                                    </View>
                                    
                               </TouchableNativeFeedback>
                    })}
                </View>
                <View style={{flex: 1}}></View>
            </View>
        );
    }
    goToUpgrade() {
        this.props.App.rootNavigator.showLightBox({
            screen: 'fc.UpgradeScreen',
            passProps: {
                
            },
			style: {
				backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
				tapBackgroundToDismiss: true // dismisses LightBox on background taps (optional)
			}
        });
    }
    render() {
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return (
            <View style={{flex: 1, backgroundColor: isDarkTheme? darkTheme.background : '#fff'}}>
                <Header>
                    <Left>
                        <Text onPress={() => this.props.App.rootNavigator.pop()} style={{color: '#fff', fontFamily: 'Icons', fontSize: 22}}>&#xE5C4;</Text>
                    </Left>
                    <Body />
                    <Right><Title style={{fontFamily: 'IranSans', fontSize: 18}}>آزمون</Title></Right>
                </Header>
                {!this.state.quizFinished? this.state.quizStarted?
                    this.renderQuiz() 
                : 
                    <QuizIntroScreen 
                        start_exam={() => {
                            if(this.props.App.isPro) {
                                this.makeQuestions(this.state.cards.concat())
                            } else {
                                this.goToUpgrade()
                            }
                        }}
                        quizSettings={this.state.quizSettings} 
                        cards_number={this.state.cards.length}
                        on_instant_show_answer_switch={(boolean) => {
                            var quizSettings = this.state.quizSettings

                            quizSettings.instant_show_answer = boolean
                            this.setState({quizSettings})
                        }} 
                        on_make_question_from_front_switch={(boolean) => {
                            var quizSettings = this.state.quizSettings
                            if(!quizSettings.make_question_from_back && !boolean) {
                                quizSettings.make_question_from_back = true
                            }
                            quizSettings.make_question_from_front = boolean
                            this.setState({quizSettings})
                        }}
                        on_make_question_from_back_switch={(boolean) => {
                            var quizSettings = this.state.quizSettings
                            if(!quizSettings.make_question_from_front && !boolean) {
                                quizSettings.make_question_from_front = true
                            }
                            quizSettings.make_question_from_back = boolean
                            this.setState({quizSettings})
                        }}
                        on_change_user_question_number={text => {
                            let numbers = '0123456789۱۲۳۴۵۶۷۸۹۰'
                            let newText = ''
                            for (var i=0; i < text.length; i++) {
                                if(numbers.indexOf(text[i]) > -1) {
                                        newText = newText + text[i];
                                }
                                else {
                                    return ToastAndroid.show(`فقط عدد انگلیسی وارد کنید`, ToastAndroid.SHORT)
                                }
                            }
                            text = newText
                            if(parseInt(text, 10)  === 0) {
                                return ToastAndroid.show(`تعداد باید بیشتر از صفر باشد`, ToastAndroid.SHORT)
                            }
                            if(parseInt(text, 10) > this.state.cards.length) {
                                return ToastAndroid.show(`حداکثر ${this.state.cards.length}`, ToastAndroid.SHORT)
                            }
                            var quizSettings = this.state.quizSettings
                            quizSettings.user_question_number = text
                            this.setState({quizSettings})                           
                        }}
                    />
                :
                    <QuizResultScreen 
                        corrects={this.state.corrects}
                        wrongs={this.state.wrongs}     
                    />
                }
            </View>
        )
    }
}

@inject('App') @observer
class QuizIntroScreen extends Component {
    render() {
        var percent_height = number => number/100 * D_height
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return (
            <View style={{flex: 1, backgroundColor: isDarkTheme? darkTheme.background : '#fafafa', alignItems: 'center', width: D_width, height: D_height, padding: '5%'}}>
                <TouchableNativeFeedback onPress={() => this.props.start_exam()}>
                    <View style={{width: '100%', height: percent_height(10), backgroundColor: 'blue', elevation: 4, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontFamily: 'IranSans', color: 'white', fontSize: 18 * this.props.App.fontSizeScale}}>شروع آزمون</Text>
                    </View>
                </TouchableNativeFeedback>

                <View style={{height: percent_height(7.5), width: '100%', marginTop: '7.5%', marginBottom: '1.5%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TextInput underlineColorAndroid={isDarkTheme? '#fafafa' : 'grey'} value={this.props.quizSettings.user_question_number} onChangeText={text => this.props.on_change_user_question_number(text)} keyboardType="numeric" style={{width: '25%', color: isDarkTheme? '#fafafa' : '#000'}} />
                    <Text style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : 'grey', fontSize: 14 * this.props.App.fontSizeScale}}>تعداد سوال (حداکثر {this.props.cards_number})</Text>
                </View>
                <Divider />
                <View style={{height: percent_height(7.5), width: '100%', marginTop: '2.5%', marginBottom: '1.5%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Switch value={this.props.quizSettings.make_question_from_front}  onValueChange={(boolean) => this.props.on_make_question_from_front_switch(boolean)}/>
                    <Text style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : 'grey', fontSize: 14 * this.props.App.fontSizeScale}}>طرح سوال از روی کارت</Text>
                </View>
                <Divider />
                <View style={{height: percent_height(7.5), width: '100%', marginTop: '2.5%', marginBottom: '1.5%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Switch value={this.props.quizSettings.make_question_from_back}  onValueChange={(boolean) => this.props.on_make_question_from_back_switch(boolean)} />
                    <Text style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : 'grey', fontSize: 14 * this.props.App.fontSizeScale}}>طرح سوال از پشت کارت</Text>
                </View>
                <Divider />
                <View style={{height: percent_height(7.5), width: '100%', marginTop: '2.5%', marginBottom: '1.5%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Switch value={this.props.quizSettings.instant_show_answer} onValueChange={(boolean) => this.props.on_instant_show_answer_switch(boolean)} />
                    <Text style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : 'grey', fontSize: 14 * this.props.App.fontSizeScale}}>مشاهده فوری جواب</Text>
                </View>
                <Divider />
            </View>
        )
    }
}

var Divider = () => <View style={{width: '100%', height: 1, backgroundColor: 'grey'}} />

@inject('App') @observer
class QuizResultScreen extends Component {
    renderWrong(data) {
        let wrong = data.item
        return (
            <View style={{width: 200, height: 275, marginLeft: 10, borderWidth: 2, borderColor: '#eee'}}>
                <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                    <Image source={{uri: wrong.img}} style={{width: 40, height: 40}} />
                    <Text style={{fontFamily: 'IranSans', fontSize: 15 * this.props.App.fontSizeScale}}>{wrong.text}</Text>
                </View>
                <View style={{flex: 2, padding: 7.5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: 'red'}}>
                            <Image source={{uri: wrong.userAnswer.img}} style={{width: 40, height: 40}} />                  
                            <Text style={{fontFamily: 'IranSans', fontSize: 15 * this.props.App.fontSizeScale, color: 'red'}}>
                                {wrong.userAnswer.val}
                            </Text>
                </View>
                <View style={{flex: 2, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                        <Image source={{uri: wrong.correctAnswer.img}} style={{width: 40, height: 40}} />   
                        <Text style={{fontFamily: 'IranSans', fontSize: 15 * this.props.App.fontSizeScale, color: '#fff', padding: 5}}>
                            {wrong.correctAnswer.val}
                        </Text>
                </View>             
            </View>
        )
    }
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ScrollView contentContainerStyle={{flex: 1}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontFamily: 'IranSans', fontSize: 25, color: 'black'}}>تمام شد!</Text>
                        <Text style={{fontFamily: 'IranSans', fontSize: 14 * this.props.App.fontSizeScale}}>تعداد غلط ها: {this.props.wrongs.length}</Text>
                        <Text style={{fontFamily: 'IranSans', fontSize: 14 * this.props.App.fontSizeScale}}>تعداد درست ها: {this.props.corrects.length}</Text>
                    </View>
                    {this.props.wrongs.length > 0? <View style={{flex: 1.5, justifyContent: 'center'}}>
                        <Text style={{fontFamily: 'IranSans', marginRight: 7.5, color: '#000', fontSize: 14 * this.props.App.fontSizeScale}}>غلط ها: </Text>
                        <FlatList 
                            data={this.props.wrongs}
                            renderItem={this.renderWrong.bind(this)}
                            horizontal
                        />
                    </View> : null}
                </ScrollView>
            </View>
        )
    }
}


/*export default class QuizScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cards: this.props.cards.concat(),
            fronts: [],
            backs: [],
            questPos: 0,
            Questions: [{question: '', answers: [], answer: '', WrongState: false, CorrectState: false}],
            isFinished: false
        }
    }

    MakeAllQuestions() {
        var cards = this.state.cards;
        var shuffledCards = this.shuffleArray(cards.concat());
        var fronts = [];
        var backs = [];
        var Questions =[];
        for(let i=0; i< shuffledCards.length; i++) {
            fronts.push(shuffledCards[i][0]);
            backs.push(shuffledCards[i][1]);
        }
        for(let t=0; t<shuffledCards.length; t++) {
        var randomFrontOrBackAsQuestion = Math.floor(Math.random() * 2) + 1; // generate 1 or 2 randomaticaly
        if(randomFrontOrBackAsQuestion === 1) {
            var question = fronts[t];
            var answer = backs[t];
        } else if(randomFrontOrBackAsQuestion === 2) {
            var question = backs[t];
            var answer = fronts[t];
        };
        randomCorrectAnswerPosition = Math.floor(Math.random() * 4) + 1;
        var answers = [];
        var shffledBacks = this.shuffleArray(backs.concat());
        var shffledFronts = this.shuffleArray(fronts.concat());
            if(randomFrontOrBackAsQuestion === 1) {
                var indexOfAnswerInShuffledBacks = shffledBacks.indexOf(answer);
                shffledBacks.splice(indexOfAnswerInShuffledBacks, 1)
            } else if(randomFrontOrBackAsQuestion === 2) {
                var indexOfAnswerInShuffledFronts = shffledFronts.indexOf(answer);
                shffledFronts.splice(indexOfAnswerInShuffledFronts, 1)
            }  
        for(let i=1; i<=4; i++) {
            if(randomCorrectAnswerPosition == i) {
                answers.push(answer);
                continue;
            }
            if(randomFrontOrBackAsQuestion === 1) {
                answers.push(shffledBacks[i-1])
            } else if(randomFrontOrBackAsQuestion === 2) {
                answers.push(shffledFronts[i-1])
            }
        }
        console.log(Questions)
        Questions.push({question, answers, answer, WrongState: false, CorrectState: false})
        } 
        this.setState({Questions})
    }
    checkAnswer(answer) {
        if(this.state.questPos >= this.state.Questions.length - 1)
        {
            this.setState({isFinished: true})
            return;
        }
        if(answer == this.state.Questions[this.state.questPos].answer) {
            this.setState(state => state.Questions[this.state.questPos].CorrectState = true);
            setTimeout(()=> {
                this.setState(state => state.questPos++);
                this.setState(state => {state.Questions[this.state.questPos].CorrectState= false})
            }, 1000)
            
        } else {
            this.setState(state => state.Questions[this.state.questPos].WrongState = true);
            setTimeout(()=> {
                this.setState(state => state.questPos++);
                this.setState(state => {state.Questions[this.state.questPos].WrongState= false})
            }, 1000)
        }

    }
    renderQuiz() {
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 25, fontFamily: 'IranSans', marginRight: 10}}>{this.state.Questions[this.state.questPos].question}</Text>
                </View>
                <View style={{flex: 2, flexWrap: 'wrap', flexDirection: 'row'}}>
                    {this.state.Questions[this.state.questPos].answers.map(answer => {
                        return <TouchableOpacity onPress={this.checkAnswer.bind(this, answer)} style={{width: D_width / 2 - 30, margin: 15, height: 100, backgroundColor: this.state.Questions[this.state.questPos].WrongState == true? 'red' : this.state.Questions[this.state.questPos].CorrectState == true? 'green': 'white', borderWidth: 2, borderColor: 'grey', justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontFamily: 'IranSans'}}>{answer}</Text>
                               </TouchableOpacity>
                    })}
                </View>
                <View style={{flex: 1}}></View>
            </View>
        );
    }
    componentDidMount() {
        this.MakeAllQuestions();
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
    renderResults() {
        return (
            <View style={{flex: 1}}>
                <Text>sds</Text>
            </View>
        );
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{height: 55, width: D_width, backgroundColor: '#4257b2'}}>
                    <TouchableOpacity onPress={() => this.props.App.rootNavigator.pop()} style={{position: 'absolute', top: 65/2/2, left: 10, justifyContent: 'center'}}><Text style={{color: '#fff', fontFamily: 'Icons', fontSize: 22}}>&#xE5C4;</Text></TouchableOpacity>
                    <View style={{flex: 5}}></View>
                    <View style={{position: 'absolute', top: 65/2/2, right: 10, justifyContent: 'center'}}><Text style={{color: '#fff', fontSize: 15}}> {this.state.questPos+1} / {this.state.Questions.length}</Text></View>
                </View>
                {!this.state.isFinished? this.renderQuiz() : this.renderResults()}
            </View>
        );
    }
}*/

var styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
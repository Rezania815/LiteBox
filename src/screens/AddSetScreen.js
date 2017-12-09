import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, TextInput, AsyncStorage, TouchableNativeFeedback, ToastAndroid } from 'react-native'
import {
    Container,
    Header,
	Title,
	Left,
	Right,
	Body,
	Icon,
    Content,
    Input,
    Item 
} from 'native-base'
import shortid from 'shortid'
import uuid from 'uuid/v4'
import { observer, inject } from 'mobx-react'

@inject('AppData', 'App') @observer
class AddSetScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editing: this.props.editing,
            setName: this.props.editing? this.props.set.setName : '',
            cards: this.props.editing? this.props.set.cards.concat() : [],
            editing_set_id: this.props.editing? this.props.set._id : '',
            group_id: this.props.editing? this.props.group_id : '',
            group: this.props.group
        }
        this.renderSetDetails = this.renderSetDetails.bind(this)
        this.addSet = this.addSet.bind(this)
    }
    goToUpgrade() {
        this.props.App.rootNavigator.showLightBox({
            screen: 'fc.UpgradeScreen',
            passProps: {},
			style: {
				backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
				tapBackgroundToDismiss: true // dismisses LightBox on background taps (optional)
			}
        });
    }
    componentDidMount() {
        if(!this.props.App.isPro && this.props.editing) {
            this.goToUpgrade()
        }
    }
    renderCardInput(data) {
        let card = data.item
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return (
            <View key={data.key} style={[styles.cardContainer, {backgroundColor: isDarkTheme? darkTheme.cardBackground : '#fff'}]}>
                <Item>
                    <Input 
                        value={card[0]}
                        placeholder="روی کارت"
                        multiline
                        style={{color: isDarkTheme? '#fafafa' : '#000', fontSize: 14 * this.props.App.fontSizeScale}}
                        onChangeText={text => {
                            let cards = this.state.cards
                            let card_index = cards.map(c => c[2]).indexOf(card[2])
                            cards[card_index][0] = text
                            this.setState({cards})
                        }}
                    />
                </Item>
                <Item>
                    <Input 
                        value={card[1]} 
                        placeholder="پشت کارت"
                        multiline
                        style={{color: isDarkTheme? '#fafafa' : '#000', fontSize: 14 * this.props.App.fontSizeScale}}
                        onChangeText={text => {
                            let cards = this.state.cards
                            let card_index = cards.map(c => c[2]).indexOf(card[2])
                            cards[card_index][1] = text
                            this.setState({cards})
                        }}
                    />
                </Item>
                <View style={{position: 'absolute', top: 7.5, left: 7.5}}>
                    <Text 
                        style={{fontFamily: 'Icons', fontSize: 17, color: isDarkTheme? '#fafafa' : 'grey'}}
                        onPress={() => {
                            let cards = this.state.cards
                            let card_index = cards.map(c => c[2]).indexOf(card[2])
                            cards.splice(card_index, 1)
                            this.setState({cards})
                        }}
                    >delete</Text>
                </View>
            </View>
        )
    }
    renderSetDetails() {
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return (
            <View style={{height: 165, width: '100%', backgroundColor: isDarkTheme? darkTheme.headerBackground : '#fff', justifyContent: 'center'}}>
                <View style={{width: '85%', marginLeft: '7.5%'}}>
                    <Text style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' :'#000', fontSize: 14 * this.props.App.fontSizeScale}}>نام جعبه: </Text>
                    <Item>
                        <Input
                            value={this.state.setName} 
                            style={{color: isDarkTheme? '#fafafa' : '#000', fontSize: 14 * this.props.App.fontSizeScale}}
                            onChangeText={(text) => this.setState({setName: text})} 
                            placeholder="نام جعبه"
                        />
                    </Item>
                </View>
            </View>
        )
    }
    renderFooter() {
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return (
            <View>
                <TouchableNativeFeedback onPress={() => {
                    let cards = this.state.cards
                    cards.push(['', '', shortid.generate()])
                    this.setState({cards})
                }}>
                    <View style={{height: 65, marginBottom: 55, padding: 7.5, backgroundColor: isDarkTheme? darkTheme.background : '#eee'}}>
                        <View style={{flex: 1, backgroundColor: '#eee', borderStyle: 'dashed', borderColor: '#ccc', borderWidth: 3, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontFamily: 'IranSans', fontSize: 17 * this.props.App.fontSizeScale}}>افزودن کارت</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    }
    renderMain() {
        return (
            <View style={{height: '100%', width: '100%'}}>
                <FlatList 
                    data={this.state.cards} 
                    renderItem={this.renderCardInput.bind(this)}
                    keyExtractor={(item, index) => item[2]}
                    ListHeaderComponent={this.renderSetDetails}
                    ListFooterComponent={this.renderFooter.bind(this)}
                /> 
            </View>  
        )
    }
    addSet() {
        if(!this.state.setName) {
            return ToastAndroid.show('نام جعبه را وارد کنید', ToastAndroid.SHORT)
        }
        if(this.state.cards.filter(card => card[0] && card[1]).length < 2) {
            return ToastAndroid.show('حداقل اطلاعات دو کارت را کامل وارد کنید', ToastAndroid.SHORT)
        }
        let group_index = this.props.AppData.Groups.map(g => g._id).indexOf(this.state.group._id)
        this.props.AppData.Groups[group_index].sets.push({
            _id: uuid(), 
            setName: this.state.setName, 
            cards: this.state.cards
        })
        this.props.App.rootNavigator.pop()
        AsyncStorage.setItem('AppData', JSON.stringify(this.props.AppData.Groups))
    }
    editSet() {
        if(!this.state.setName) {
            return ToastAndroid.show('نام جعبه را وارد کنید', ToastAndroid.SHORT)
        }
        if(this.state.cards.filter(card => card[0] && card[1]).length < 2) {
            return ToastAndroid.show('حداقل اطلاعات دو کارت را کامل وارد کنید', ToastAndroid.SHORT)
        }
        var Groups = this.props.AppData.Groups.toJS()
        let group_index = Groups.map(g => g._id).indexOf(this.state.group_id)
        let set_index = Groups[group_index].sets.map(s => s._id).indexOf(this.state.editing_set_id)
        Groups[group_index].sets[set_index].cards =  this.state.cards
        Groups[group_index].sets[set_index].setName =  this.state.setName
        this.props.AppData.Groups = Groups
        this.props.App.rootNavigator.pop()
        AsyncStorage.setItem('AppData', JSON.stringify(Groups))
    }
    render() {
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return (
            <Container style={{backgroundColor: isDarkTheme? darkTheme.background : '#eee'}}>
                <Header>
                    <Left>
                        <Text 
                            style={{color: '#fff', fontFamily: 'Icons', fontSize: 23}}
                            onPress={() => this.props.App.rootNavigator.pop()}
                        >
                            arrow_back
                        </Text>
                    </Left>
                    <Left>
                        <Text 
                            style={{color: '#fff', fontFamily: 'Icons', fontSize: 23, marginLeft: -15}}
                            onPress={() => {
                                if(!this.props.App.isPro && this.props.editing) {
                                    return this.goToUpgrade()
                                }
                                if(this.state.editing) {
                                    this.editSet()
                                } else {
                                    this.addSet()
                                }
                            }}
                        >
                            check
                        </Text>
                    </Left>
                    <Body />
                    <Right><Title style={{fontFamily: 'IranSans', fontSize: 18}}>{this.state.editing? 'ویرایش جعبه' : 'افزودن جعبه'}</Title></Right>
                </Header>
                {this.renderMain()}
            </Container>
        )
    }
}


var styles = StyleSheet.create({
    cardContainer: {
        marginTop: 7.5,
        width: '95%',
        minHeight: 150,
        marginLeft: '2.5%',
        elevation: 4,
        padding: '2.5%'
    }
})

export default AddSetScreen
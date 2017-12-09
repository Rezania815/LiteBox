import React, { Component } from 'react'
import { View, Text, Dimensions, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native'
var { width: D_width, height: D_height } = Dimensions.get('window');
class AddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        front: '',
        back: ''
    }
  }
  addCard() {
    this.state.front || this.state.back? this.state.front? this.state.back? this.props.onAdd(this.state.front, this.state.back) : alert('پشت کارت رو بنویس') : alert('روی کارت رو بنویس') : alert('پشت و روی کارت رو بنویس');
  }
  render() {
    return (
      <View style={{position: 'absolute', width: D_width, height: D_height, top: 0, left: 0}}>
        <View style={{position: 'absolute', width: D_width, height: D_height, backgroundColor: '#000', opacity: 0.5, top: 0, left: 0}}></View>
        <View style={{position: 'absolute', top: D_width/4, left: D_width/5/2, width: D_width - (D_width/5), height: 350, backgroundColor: '#fff', borderRadius: 10, elevation: 5}}>
          <View style={{flex: 2, justifyContent: 'center'}}>
            <Text style={{fontFamily: 'Yekan', color: '#000', fontSize: 20, marginRight: 15}}>کارت جدید</Text>
          </View>
          <View style={{flex: 3}}>
            <TextInput placeholder="روی کارت" onChangeText={(text) => this.setState({front: text})} style={{marginHorizontal: 20, height: 80}}></TextInput>
          </View>
          <View style={{flex: 3}}>
            <TextInput placeholder="پشت کارت" onChangeText={(text) => this.setState({back: text})} style={{marginHorizontal: 20, height: 80}}></TextInput>
          </View>
          <View style={{flex: 2, flexDirection: 'row'}}>
            <View style={{flex: 3}}></View>
            <TouchableOpacity onPress={this.addCard.bind(this)} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: 'green', fontFamily: 'Yekan', fontSize: 15}}>افزودن</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.props.onCancel()} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: 'green', fontFamily: 'Yekan', fontSize: 15}}>لغو</Text>              
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
export default class EditSet extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            cards: this.props.data,
            AddModalVisible: false
        }
    }
    addCard() {
        this.setState({AddModalVisible: true});
    }
    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>
                <View style={{height: 55, width: D_width, backgroundColor: '#4257b2'}}>
                    <View style={{position: 'absolute', top: 65/2/2, left: 10, justifyContent: 'center'}}><Text style={{color: '#fff', fontFamily: 'Icons', fontSize: 20}}>&#xE5C4;</Text></View>
                    <View style={{flex: 5}}></View>
                    <View style={{position: 'absolute', top: 65/2/2, left: 50, justifyContent: 'center'}}><Text style={{color: '#fff', fontFamily: 'Yekan', fontSize: 17}}>ویرایش کارت ها</Text></View>
                </View>
                <View style={{flex: 1, marginBottom: 60}}>
                    <ScrollView>{this.state.cards.map((card, i)=> {
                        return (
                            <View style={styles.card}>
                                <View style={{flex: 1}}>
                                    <TextInput ref={"frontInput" + (i+1).toString()} placeholder="روی کارت" value={card[0]}></TextInput>
                                </View>
                                <View style={{flex: 1}}>
                                    <TextInput placeholder="پشت کارت" value={card[1]}></TextInput>
                                </View>
                            </View>
                        );
                    })}</ScrollView>
                </View>
                <View style={{position: 'absolute', bottom: 0, left: 0, height: 50, width: D_width, flexDirection: 'row', backgroundColor: 'grey'}}>
                    <View style={{flex: 1}}>
                        
                    </View>
                    <View style={{flex: 1}}>
                    
                    </View>
                    <TouchableOpacity onPress={this.addCard.bind(this)} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: '#fff', fontFamily: 'Yekan', fontSize: 16}}> + جدید</Text>
                    </TouchableOpacity>
                </View>
                {this.state.AddModalVisible? <AddModal onAdd={(front, back)=> { this.setState(state => state.cards.push([front, back])); this.setState({AddModalVisible: false}) }} onCancel={() => this.setState({AddModalVisible: false})}/> : null}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    card: {
        height: 60,
        width: D_width - 30,
        marginTop: 10,
        marginHorizontal: 15,
        backgroundColor: '#fff',
        flexDirection: 'row'
    }
})
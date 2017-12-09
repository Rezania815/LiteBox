import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, Button, TouchableNativeFeedback, StatusBar } from 'react-native'

import Swiper from 'react-native-swiper'
import { Navigation } from 'react-native-navigation'

class IntroSwiper extends Component {
    constructor(props) {
        super(props)
        this.state = {
            swiper_index: 0
        }
    }
    componentDidMount() {
        if(this.props.first_visit) {
            fetch(`https://ar-flashcard.herokuapp.com/stats/first_visit`)
            .then(res => res.json())
            .then(resData => {console.log(resData)})
        }
    }
    goToMain(group, image_key) {
        Navigation.startSingleScreenApp({
            screen: {
                screen: 'fc.Main', 
                navigatorStyle: {
                    navBarHidden: true
                },
                navigatorButtons: {} 
            },
            animationType: 'slide-down'
        });
    }
    render() {
        var colors = ['#00bcd5', '#0bb48d', '#AB47BC', '#FF5722', '#4DB6AC']
        return (
            <View style={{flex: 1}}>
                <Swiper style={[styles.wrapper]} showsButtons loop={false} onMomentumScrollEnd={(e, state, context) => {
                    if(!state.isScrolling) {
                        this.setState({swiper_index: state.index})
                    }     
                }}>
                    <View style={styles.slide1}>
                        <Text style={styles.text}>یادگیری آسان، سریع و هوشمندانه</Text>
                        <Image source={require('./img/learn.png')} style={{height: '55%', width: '40%'}} />
                        
                        <Text style={styles.description}>لایتباکس از روش یادگیری جعبه لایتنر با تکیه بر فراخوانی فعال و تکرار فاصله دار کارت ها استفاده میکند و برای استفاده در محیط موبایل بهینه شده است</Text>     
                    </View>
                    <View style={styles.slide2}>
                        <Text style={styles.text}>حالت شب</Text>
                        <Image source={require('./img/swiper_dark.png')} style={{height: '55%', width: '40%'}} />
                        <Text style={styles.description}>اگر شب ها مطالعه میکنید، حالت شب را فعال کنید، این قابلیت کمک میکند تا بدون اسیب به چشم راحت تر مطالعه کنید</Text>
                    </View>
                    <View style={styles.slide3}>
                        <Text style={styles.text}>فلش کارت های آماده</Text>
                        <Image source={require('./img/store.png')} style={{height: '55%', width: '40%'}} />
                        <Text style={styles.description}>از فروشگاه میتوانید به گروه های فلش کارت از پیش ساخته بسیاری دسترسی داشته باشید. و به راحتی آنها را به مجموعه شخصی خود اضافه کنید</Text>
                    </View>
                    <View style={styles.slide4}>
                        <Text style={styles.text}>ساختن فلش کارت</Text>
                        <Image source={require('./img/add_set.png')} style={{height: '55%', width: '40%'}} />
                        <Text style={styles.description}>به آسانی گروه ایجاد کنید، جعبه بسازید ، فلش کارت های خودتان را بنویسد و شروع به یادگیری کنید</Text>
                    </View>
                    <View style={[styles.slide5]}>
                        <Text style={styles.text}>آزمون و بازی</Text>
                        <Image source={require('./img/quiz.png')} style={{height: '55%', width: '40%'}} />
                        <Text style={[styles.description, {marginBottom: 0}]}>برا ارزیابی خودتان، آزمون بگیرید و نتایج را بررسی کنید، یادگیری را با بازی به سرگرمی تبدیل کنید</Text>
                        <TouchableNativeFeedback onPress={this.goToMain.bind(this)}>
                            <View style={{backgroundColor: '#4257b2', width: '25%', height: 45, elevation: 4, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontFamily: 'IranSans', fontSize: 16, color: '#fff'}}>شروع</Text>
                            </View>
                            
                        </TouchableNativeFeedback>
                    </View>
                </Swiper>
            </View>
        )
    }
}

var styles = StyleSheet.create({
  wrapper: {
      flex: 1,
      height: '100%',
      width: '100%'
  },
  slide1: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#00bcd5',
    paddingVertical: '7%'
  },
  slide2: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0bb48d',
    paddingVertical: '7%'
  },
  slide3: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#AB47BC',
    paddingVertical: '7%'
  },
  slide4: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FF5722',
    paddingVertical: '7%'
  },
  slide5: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#4DB6AC',
    paddingVertical: '10%'
  },
  text: {
    color: '#fff',
    fontSize: 21,
    fontFamily: 'IranSans'
  },
  description: {
      color: '#fff',
      fontSize: 17,
      fontFamily: 'IranSans',
      margin: '5%',
      marginBottom: '10%',
      textAlign: 'center'
  }
})

export default IntroSwiper
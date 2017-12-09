import React, { Component } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { SharedElementTransition } from 'react-native-navigation'
import { observer, inject } from 'mobx-react'
import {
	Container,
	Header,
	Title,
	Left,
	Right,
	Body,
	Icon,
    Content
} from 'native-base'


@inject('App') @observer
class ImageViewer extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        var height = 250, width = 250
        return (
            <View style={{height, width, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                            style={{height: 250, width: 250}}
                            source={{ uri: this.props.image }}
                    />
                </View>

            </View>
        )
    }
}

export default ImageViewer
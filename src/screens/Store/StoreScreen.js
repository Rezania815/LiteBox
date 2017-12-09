import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, TouchableNativeFeedback, AsyncStorage, RefreshControl, TouchableOpacity, Modal, FlatList } from 'react-native'
import { inject, observer } from 'mobx-react'
import { SharedElementTransition } from 'react-native-navigation'
import CafeBazaar from 'react-native-cafe-bazaar'


@inject('App', 'AppData') @observer
class StoreScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            store: [],
            isFetchingStore: false,
            showingGroup: null,
            modalVisible: false
        }
    }
    componentDidMount() {
        this.fetchStore()
    }
    fetchStore() {
        this.setState({isFetchingStore: true})
        fetch(`${this.props.App.serverURL}/store`)
        .then(res => res.json())
        .then(resData => {
            this.setState({store: resData, isFetchingStore: false})
/*            CafeBazaar.open()
            .then(() => CafeBazaar.loadOwnedItems())
            .then((details) => {
                purchasedItems = details
                return CafeBazaar.loadInventory(group_ids)
            })
            .then((details) => {
                 
                //alert(details)
                var inventory = JSON.parse(details)

                //alert(items_ids)
                this.setState({store: resData, purchasedItems, inventory, isFetchingStore: false})
                return CafeBazaar.close()
            })*/
        })
    }
    goToGroupDetails(group) {
        this.props.App.rootNavigator.showLightBox({
            screen: 'fc.GroupDetailsScreen',
            passProps: {
                group
            },
			style: {
				backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
				tapBackgroundToDismiss: true // dismisses LightBox on background taps (optional)
			}
        });
    }
    goToGroup(group, image_key) {
        this.props.App.rootNavigator.push({
            screen: 'fc.GroupScreen',
            sharedElements: [group.image? image_key : undefined],
            passProps: {
                group,
                sharedImageId: image_key
            },
            navigatorStyle: {
                navBarHidden: true,
                statusBarTextColorSchemeSingleScreen: 'dark'
            }
        });
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
        var Groups = this.props.AppData.Groups.toJS()
        var isDarkTheme = this.props.App.isDarkTheme,
            darkTheme = this.props.App.darkTheme
        return (
            <View style={{flex: 1, backgroundColor: isDarkTheme? darkTheme.background : '#eee'}}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isFetchingStore}
                            onRefresh={this.fetchStore.bind(this)}
                            title="Pull to refresh"
                            tintColor="#fff"
                            titleColor="#fff"
                        />
                    }
                >
                    {this.state.store.map((section, i) => {
                        return (
                            <View key={'section' + i} style={[styles.sectionContainer,{ backgroundColor: isDarkTheme? darkTheme.cardBackground: '#fff'}]}>
                                <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 10}}>
                                    <Text style={{fontFamily: 'IranSans', color: isDarkTheme? '#fff' : 'grey', fontSize: 14 * this.props.App.fontSizeScale}}>{section.name}</Text>
                                </View>
                                <View style={{flex: 3.25, justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 10, paddingBottom: 10, flexDirection: 'row'}}>
                                    <FlatList 
                                        containerStyle={{flex: 1, alignItems: 'flex-end'}}
                                        data={section.groups} 
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => item._id}
                                        renderItem={(data, i) => {
                                            var group = data.item
                                            let isDownloadedBefore = Groups.some(g => g._id == group._id)
                                            var image_key = `${group._id}_${section.name}_image`
                                            return (
                                                <TouchableNativeFeedback 
                                                    key={data.key} 
                                                    onPress={() => {
                                                        if(isDownloadedBefore) {
                                                            this.goToGroup(group, image_key)
                                                        } else if(group.paid) {
                                                            if(!this.props.App.isPro) {
                                                                this.goToUpgrade()
                                                            } else {
                                                                this.goToGroupDetails(group)
                                                            }
                                                        } else {
                                                            this.goToGroupDetails(group)
                                                        }
                                                    }}
                                                >
                                                    <View style={styles.groupContainer}>
                                                        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                                                            <SharedElementTransition 
                                                                sharedElementId={image_key} 
                                                                style={{width: '100%', height: '100%'}}
                                                            >
                                                                <Image 
                                                                    source={{uri: group.image}} 
                                                                    style={{width: '100%', height: '100%'}} 
                                                                />
                                                            </SharedElementTransition>
                                                        </View>
                                                        <View style={{flex: 1, padding: 5}}>
                                                            <Text style={{fontFamily: 'IranSans', color: isDarkTheme? '#fafafa' : '#000', fontSize: 13 * this.props.App.fontSizeScale}}>
                                                                {group.groupName}
                                                            </Text>
                                                        </View>
                                                        <View style={{flex: 0.5}}>
                                                            <Text style={{fontFamily: 'IranSans', color: isDarkTheme? 'lightgreen' : 'green', fontSize: 13 * this.props.App.fontSizeScale}}>
                                                                {isDownloadedBefore? 
                                                                    <Text style={{color: isDarkTheme? 'orange' : 'brown', fontSize: 14 * this.props.App.fontSizeScale}}>دانلود شده</Text> 
                                                                : group.paid? <Text style={{color: 'lightblue'}}>غیر رایگان</Text> : 
                                                                ''}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </TouchableNativeFeedback>
                                            )
                                        }}
                                    />
                                </View>
                            </View>
                        ) 
                    })}
                </ScrollView>
            </View>
        )
    }
}




/*

                <View style={styles.sectionContainer}>
                    <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 10}}>
                        <Text style={{fontFamily: 'IranSans'}}>بسته های برگزیده</Text>
                    </View>
                    <View style={{flex: 3.25, justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 10, paddingBottom: 10, flexDirection: 'row'}}>
                        <View style={styles.groupContainer}>
                            <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                                <Image 
                                    source={{uri: 'https://marketplace.canva.com/MAB___U-clw/1/0/thumbnail_large/canva-yellow-lemon-children-book-cover-MAB___U-clw.jpg'}} 
                                    style={{width: '100%', height: '100%'}} 
                                />
                            </View>
                            <View style={{flex: 1, backgroundColor: 'yellow', padding: 5}}>
                                <Text style={{fontFamily: 'IranSans', color: '#000', fontSize: 13}}>
                                    راهنمایی رانندگی
                                </Text>
                            </View>
                        </View>
                        <View style={styles.groupContainer}>
                            <View style={{flex: 2.25, justifyContent: 'center', alignItems: 'center'}}>
                                <Image 
                                    source={{uri: 'https://marketplace.canva.com/MAB___U-clw/1/0/thumbnail_large/canva-yellow-lemon-children-book-cover-MAB___U-clw.jpg'}} 
                                    style={{width: '100%', height: '100%'}} 
                                />
                            </View>
                            <View style={{flex: 1, backgroundColor: 'yellow', padding: 5}}>
                                <Text style={{fontFamily: 'IranSans', color: '#000', fontSize: 13}}>
                                    504 لغت کنکور!
                                </Text>
                            </View>
                            <View style={{flex: 0.75, backgroundColor: 'blue'}}>
                                <Text style={{fontFamily: 'IranSans', color: 'green', fontSize: 13}}>
                                    رایگان
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
 */

var styles = StyleSheet.create({
    sectionContainer: {
        height: 225,
        width: '100%',
        borderColor: '#eee',
        marginBottom: 7.5,
        backgroundColor: '#fff'
    },
    groupContainer: {
        maxWidth: 120,
        height: '100%',
        marginLeft: 7.5
    }
})

export default StoreScreen
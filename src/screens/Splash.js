import React, {useEffect} from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'
import PushNotification from "react-native-push-notification"


function Splash({navigation}) {
    useEffect(()=>{
        createChannels()
        setTimeout(()=>{
            navigation.replace('My Task')
        }, 2000)
    })

    const createChannels=()=>{
        PushNotification.createChannel(
            {
                channelId:'task-channel',
                channelName:"Task Channel"
            }
        )
    }
    return (
        <View style={styles.body}>
            <Image 
                style={styles.logo}
                source={require('../../assets/image/checklist.png')}
            />
            <Text style={styles.text}>
                To-Do List
            </Text>
        </View>
    )
}

const styles=StyleSheet.create({
    body:{
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#906E55'
    },
    logo:{
        width: 150,
        height: 150,
        margin: 10,
    },
    text:{
        fontSize: 40,
        color: '#ffffff',
        fontFamily:"NanumPenScript-Regular"
    }
})

export default Splash
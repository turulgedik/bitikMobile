import React, { Component } from 'react'
import {View,Text, TouchableOpacity} from 'react-native'
import {Actions} from 'react-native-router-flux'

export default class Register extends Component {
    render() {
        return (
            <View>
                <TouchableOpacity onPress={()=>{
                    Actions.pages()
                }}>
                    <Text>Register</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

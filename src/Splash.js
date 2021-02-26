import React, { Component } from 'react'
import { connect } from 'react-redux'
import {View,Image} from 'react-native'
import {loadUser} from './redux/actions/auth'

export class Splash extends Component {

    state={
        token:null
    }

    constructor(props){
        super(props)
        setTimeout(() => {
            this.getToken()
        }, 3000);
    }

    getToken=async()=>{
        try {
            const value = await AsyncStorage.getItem('token')
            this.setState({token:value},()=>{
                if(value!==null){
                    this.props.loadUser(value)
                }
            })
        } catch(e) {

        }
    }

    render() {
        return (
            <View style={{width:'100%',height:'100%',backgroundColor:'#0047CC'}}>
                <View style={{flex:1, alignItems:'flex-end'}}>
                    <Image source={require('../icons/splash1.png')} style={{height:'100%'}} resizeMode='contain'/>
                </View>
                <View style={{flex:1, alignItems:'center'}}>
                    <Image source={require('../icons/splash2.png')} style={{height:'100%'}} resizeMode='contain'/>
                </View>
                <View style={{flex:1, alignItems:'flex-end'}}>
                    <Image source={require('../icons/splash3.png')} style={{height:'100%'}} resizeMode='contain'/>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    loadUser
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash)

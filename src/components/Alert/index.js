import React, { Component } from 'react'
import MyModal from '../MyModal'
import {View,Text,TouchableOpacity, StyleSheet,Dimensions} from 'react-native'

let confirmHandler=null
const windowWidth = Dimensions.get('window').width;

export default class Alert extends Component {


    state={
        title:'',
        message:'',
        confirmText:'Evet',
        confirmState:true,
    }

    constructor(props){
        super(props)
    }

    show=()=>{
        this._modal.onShow()
    }

    confirm=()=>{
        if(confirmHandler!==null)
            confirmHandler()
        
        this._modal.onClose()
    }
    confirmHandler=(fnc)=>{
        confirmHandler=fnc
    }
    setMessage=(text)=>{
        this.setState({message:text})
    }
    setTitle=(text)=>{
        this.setState({title:text})
    }
    setConfirmText=(text)=>{
        this.setState({confirmText:text})
    }
    setConfirmState=(state)=>{
        this.setState({confirmState:state})
    }

    render() {
        return (
            <MyModal ref={node=>(this._modal=node)}>
                <View style={styles.background}>
                    <View style={{width:'100%', marginBottom:25, justifyContent:'center'}}>
                        <Text style={styles.title}>{this.state.title}</Text>
                    </View>
                    <Text>{this.state.message}</Text>
                    {
                        this.state.confirmState?
                        <TouchableOpacity style={styles.confirmButton} onPress={()=>{
                            this.confirm()
                        }}>
                            <Text style={{color:'white'}}>{this.state.confirmText}</Text>
                        </TouchableOpacity>:null
                    }
                    
                </View>
            </MyModal>
        )
    }
}

const styles=StyleSheet.create({
    background:{
        width:windowWidth*0.8,
        alignItems:'center',
        justifyContent:'center'
    },
    title:{
        fontSize:25,
        fontWeight:'bold',
    },
    confirmButton:{
        marginTop:25,
        width:'100%',
        height:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#2ecc71'
    }
})

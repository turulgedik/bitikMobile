import React, { Component } from 'react'
import {View,Text,TouchableOpacity,Image, StyleSheet} from 'react-native'
import icons from '../../Icons'
export default class DropDown extends Component {

    state={
        show:false
    }

    render() {
        return (
            <View style={styles.background}>
                <View style={styles.title}>
                    <Text style={{flex:1,fontSize:20}}>{this.props.name}</Text>
                    {this.props.children!==undefined?
                     <TouchableOpacity onPress={()=>{
                        const show=!this.state.show
                        this.setState({show:show})
                    }}>
                        <Image source={this.state.show?icons.Up:icons.Down} style={{width:20,height:20, tintColor:'black'}} resizeMode='contain'/>
                    </TouchableOpacity>
                    :null}
                </View>
                {
                    this.state.show?
                        this.props.children:null
                }
            </View>
        )
    }
}


const styles=StyleSheet.create({
    background:{
        width:'100%',
        overflow:'hidden'
    },
    title:{
        marginBottom:20,
        flexDirection:'row',
        width:'100%',
        height:50, 
        backgroundColor:'white',
        borderWidth:0.5,
        borderColor:'#e1e1e1', 
        alignItems:'center',
        paddingHorizontal:10
    }
})
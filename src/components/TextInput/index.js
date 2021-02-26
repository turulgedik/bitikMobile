import React from 'react'
import {View,TextInput,Image, Platform} from 'react-native'
import PropTypes from 'prop-types'

export default class CustomTextInput extends React.Component{

    state={
        onFocus:false
    }

    render(){
        
        const {...settings}=this.props.settings
        return(
            <View style={!this.state.onFocus?this.props.style:this.props.selectedStyle}>
                <View style={{flexDirection:'row', height:'100%', alignItems:'center', justifyContent:'center',padding:2}}>
                    {this.props.left}
                    <View style={{flex:1, height:'100%'}}>
                        <TextInput ref={node=>(this._text=node)} style={{height:'100%',color:this.props.color}} onFocus={()=>{
                                this.setState({onFocus:true})
                            }} onBlur={()=>{
                                this.setState({onFocus:false})
                            }} {...settings} />
                    </View>
                    {this.props.right}
                </View>
            </View>
        )
    }

}

TextInput.propTypes={
    value:PropTypes.string,
    placeHolder:PropTypes.string,
    selectedStyle:PropTypes.object,
    style:PropTypes.object,
    right:PropTypes.object,
    left:PropTypes.object,
    onChangeText:PropTypes.func,
    secureTextEntry:PropTypes.bool,
    settings:PropTypes.object,
    color:PropTypes.Color
}

TextInput.defaultProps={
    value:'',
    placeHolder:'',
    selectedStyle:null,
    style:null,
    right:null,
    left:null,
    onChangeText:null,
    secureTextEntry:false,
    settings:{},
    color:'',
}
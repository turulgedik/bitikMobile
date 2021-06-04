import React, { Component } from 'react'
import {styles} from './style'
import {View, Text, TouchableOpacity, Modal,KeyboardAvoidingView } from 'react-native'

export default class MyModal extends Component {

    constructor(props){
        super(props)
        this.state={
            visible:props.show===undefined?false:props.show,
            closeButton:props.closeButton===undefined?true:props.closeButton,
        }
    }

    onShow=()=>{
        this.setState({visible:true}) 
    }
    onClose=()=>{
        this.setState({visible:false})
    }

    render() {

        const childrenProps=React.Children.map(this.props.children,child=>{
            if(React.isValidElement(child)){
                return React.cloneElement(child,{modalClose:this.onClose})
            }
            return child
        })

        return (
            <Modal animationType="slide" transparent={true} visible={this.state.visible}>
                <KeyboardAvoidingView style={styles.background} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                    <View style={styles.contentView}>
                        {childrenProps}
                    </View>
                    {
                        this.state.closeButton?
                        <TouchableOpacity style={styles.closeButton} onPress={()=>{
                            this.onClose()
                        }}>
                            <Text style={{color:'white'}}>Kapat</Text>
                        </TouchableOpacity>
                        :null
                    }
                </KeyboardAvoidingView>
            </Modal>
        )
    }
}

import React, { Component } from 'react'
import {View,Text,TouchableOpacity,Image, ScrollView,FlatList, TextInput, Switch,KeyboardAvoidingView} from 'react-native'
import {styles} from './style'
import icons from '../../../Icons'
import { Actions, ActionConst} from 'react-native-router-flux'
import MyModal from '../../../components/MyModal'
import Alert from '../../../components/Alert'
import { connect } from 'react-redux'
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment'
import {getRollCall} from '../../../redux/actions/course'
import {IMAGE_URL} from '../../../redux/actions/host'

export class sCourseRollCall extends Component {
    
    state={
        rollcalls:[],
    }

    constructor(props){
        super(props)

        this.getRollCalls()
    }

    getRollCalls=()=>{
        
        this.props.getRollCall(this.props.id,(req)=>{
            this.setState({rollcalls:req})
        })
        
    }



    render() {
        
        const {id,user}=this.props

        return (
            <ScrollView>

                <View style={styles.title}>
                    <TouchableOpacity style={{height:'100%',width:50}} onPress={()=>{
                        Actions.pop()
                    }}>
                        <Image source={icons.Back} style={{height:'100%',width:'100%', tintColor:'#0A7ADD'}} resizeMode='contain'/>
                    </TouchableOpacity>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{color:'#042C5C',fontSize:20}}>Yoklama Raporu</Text>

                    </View>
                    <View style={{width:50}}>

                    </View>
                </View> 
                {
                    this.state.rollcalls.map((item,i)=>{
                        return(
                            <View style={{width:'100%',height:150,padding:10, borderBottomWidth:5,borderBottomColor:'#e74c3c'}}>
                                <View style={{height:50,width:'100%',flexDirection:'row',alignItems:'center'}}>
                                    <Image source={{uri:user.image}} style={{width:50,height:50,borderRadius:25,borderWidth:0.5,borderColor:'#1e1e1e'}} resizeMode='contain'/>
                                    <Text style={{marginLeft:10,fontSize:15}}>{user.first_name + ' '+user.last_name}</Text>
                                </View>
                                <View style={{flex:1,justifyContent:'center'}}>
                                    <Text>Öğretmen : {item._creator.first_name + ' ' + item._creator.last_name}</Text>
                                    <Text>Ders Adı : {item._timeTable.study.name}</Text>
                                    <Text>Tarih : {Moment(new Date(item.dateTime)).format('DD/MM/yyyy HH:mm')}</Text>
                                    <Text style={{color:'#e74c3c'}}>GELMEDİ</Text>
                                </View>
                            </View>
                        )
                    })
                }
            </ScrollView>
        )
    }
}


const mapStateToProps = (state) => ({
    user:state.User.user,

})

const mapDispatchToProps = {
    getRollCall
}

export default connect(mapStateToProps, mapDispatchToProps)(sCourseRollCall)
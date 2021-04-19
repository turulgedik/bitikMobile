import React, { Component } from 'react'
import { connect } from 'react-redux'
import {View,Text,TouchableOpacity,Image, ScrollView,FlatList, TextInput} from 'react-native'
import {styles} from './style'
import icons from '../Icons'
import {addHomeWork} from '../redux/actions/homework'
import Tabs from '../components/Tabs'
import Moment from 'moment'
import axios from 'axios'
import Alert from '../components/Alert'
import {TrDateTime} from '../components/TrDateTime'
import _ from 'lodash'
import {Actions} from 'react-native-router-flux'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import {BASE_URL} from '../redux/actions/host'
import MyModal from '../components/MyModal'

class HomeWork extends Component {

    constructor(props){
        super(props)
    }

    componentDidMount(){
        
    }

    daysInMonth = (month, year)=> {
        return new Date(year, month, 0).getDate();
    }

    updateWhoDo=(selectedHomeWork,studentID,type)=>{
        const data={
            homeWork:selectedHomeWork.id,
            type:type,
            student:studentID
        }

        this.props.addHomeWork(data,(req)=>{
            if(!req){
                this._alert.setTitle("Hata!")
                this._alert.setMessage("İşlem Sırasında bir şeyler yanlış gitti. Lütfen tekrar deneyiniz!")
                this._alert.setConfirmText('Tamam')
                this._alert.show()
            }
        })
    }

    render() {

        const {id,homeWork,students}=this.props
        const currentHomeWork=homeWork.find(h=>h.id===id)

        return (
            <ScrollView style={[styles.background,{marginTop:ifIphoneX(20,0)}]}>
                <MyModal ref={node=>(this._students=node)}>
                    <ScrollView style={styles.showMedia}>
                        <View style={{alignItems:'center',justifyContent:'center',flexDirection:'row',flexWrap:'wrap'}}>
                            {
                                students.filter(s=>s._class===currentHomeWork._class._account).map(item=>{
                                    const _state=currentHomeWork.whoDo.findIndex(w=>w._account.id===item._account.id)
                                    console.log(_state)
                                    return(
                                        <View style={{width:'33%',height:200, justifyContent:'center',alignItems:'center'}}>
                                            <TouchableOpacity style={{width:'90%',height:'90%',borderRadius:20,borderWidth:1,borderColor:'#34495e',backgroundColor:_state>-1?'#2ecc71':'white'}} onPress={()=>{
                                                this.updateWhoDo(currentHomeWork,item._account.id,_state>-1?2:1)
                                            }}>
                                                <View style={{flex:1,padding:5,width:'100%',alignItems:'center',justifyContent:'center'}}>
                                                    <Image source={{uri:BASE_URL+item._account.image}} style={{width:'100%',height:'100%'}} resizeMode='contain'/>
                                                </View>
                                                <View style={{height:50,width:'100%',alignItems:'center',justifyContent:'center'}}>
                                                    <Text>{item._account.first_name+" "+item._account.last_name}</Text>
                                                    <Text>({item.number})</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                            }
                            
                        </View>
                    </ScrollView>
                </MyModal>
                <Alert ref={node=>(this._alert=node)}/>
                <View style={styles.title}>
                    <TouchableOpacity style={{height:'100%',width:50}} onPress={()=>{
                        Actions.pop()
                    }}>
                        <Image source={icons.Back} style={{height:'100%',width:'100%', tintColor:'#0A7ADD'}} resizeMode='contain'/>
                    </TouchableOpacity>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{color:'#042C5C',fontSize:20}}>Ödev</Text>

                    </View>
                    <View style={{width:50}}>

                    </View>
                </View>

                <Text style={{fontSize:30,color:'#042C5C',marginBottom:20}}>Ödev Detay</Text>
                <View style={{marginBottom:20}}>
                    <Text>{currentHomeWork.homeWork}</Text>
                </View>

                <View style={{marginBottom:20,flexDirection:'row',alignItems:'center'}}>
                    <Text style={{fontSize:30,color:'#042C5C',flex:1}}>Yapanlar</Text>
                    <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} onPress={()=>{
                        this._students.onShow()
                    }}>
                        <Image source={icons.New} style={{width:40,height:40}} resizeMode='center'/>
                    </TouchableOpacity>
                </View>
                <View style={{marginBottom:20,flexDirection:'row',flexWrap:'wrap'}}>
                    {
                        currentHomeWork.whoDo.map((item,i)=>{

                            return(
                                <View style={{width:'33%',height:200,alignItems:'center',justifyContent:'center'}}>
                                    <View style={{width:'90%',flex:1}}>
                                        <Image source={item._account.image!==null?{uri:item._account.image}:icons.User} style={{width:'100%',height:'100%'}} resizeMode='contain'/>
                                    </View>
                                    <View style={{height:50,width:'100%', alignItems:'center',justifyContent:'center'}}>
                                        <Text>{item._account.first_name+" "+item._account.last_name}</Text>
                                        <Text>({item.number})</Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>

                <Text style={{fontSize:30,color:'#042C5C',flex:1}}>Görenler</Text>
                <View style={{marginBottom:20,flexDirection:'row',flexWrap:'wrap'}}>
                    {
                        currentHomeWork.wasSeen.map((item,i)=>{

                            return(
                                <View style={{width:'33%',height:200,alignItems:'center',justifyContent:'center'}}>
                                    <View style={{width:'90%',flex:1}}>
                                        <Image source={item.image!==null?{uri:item.image}:icons.User} style={{width:'100%',height:'100%'}} resizeMode='contain'/>
                                    </View>
                                    <View style={{height:50,width:'100%', alignItems:'center',justifyContent:'center'}}>
                                        <Text>{item.first_name+" "+item.last_name}</Text>
                                        
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => ({
    students:state.School.school.students,
    homeWork:state.HomeWork.homeworks,
})

const mapDispatchToProps = {
    addHomeWork
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeWork)

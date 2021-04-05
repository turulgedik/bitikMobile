import React, { Component } from 'react'
import {View,Text, TouchableOpacity, ScrollView, Image, FlatList, LogBox,Platform} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import icons from '../../Icons'
import {styles} from './style'
import { Avatar } from 'react-native-paper'
import { connect } from 'react-redux'
import {getSchool} from '../../redux/actions/school'
import _ from 'lodash'
import {Actions} from 'react-native-router-flux'
import {loginSocket} from '../../redux/actions/socket'
import {getReports} from '../../redux/actions/atReport'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import Alert from '../../components/Alert'
import {logOut} from '../../redux/actions/auth'
import {getRollCalls} from '../../redux/actions/rollcall'


LogBox.ignoreAllLogs(true)
class StudentHome extends Component {

    constructor(props){
        super(props)

        props.getSchool()
        props.loginSocket()
        props.getReports()
        props.getRollCalls(props.user.id)
    }
    message=(title,message)=>{
        this._alert.setTitle(title)
        this._alert.setMessage(message)
        this._alert.setConfirmText('Tamam')
        this._alert.show()
    }

    render() {
        const {classes,students,user,rollcalls}=this.props
        const group=_.groupBy(classes,'level')
        const student=students!==undefined || students!==null && user!==undefined || user!==null?students.find(s=>s._account.id===user.id):null
        console.log('student',student)
        const navigatorView=_.map(group,(elem,i)=>{
            const level=elem[0].level
            return(
                <TouchableOpacity style={styles.groupItem} onPress={()=>{
                    Actions.classes({level:level})
                }}>
                    <View style={{flex:1, justifyContent:'center',paddingHorizontal:10}}>
                        <Text style={{color:'white', fontSize:20}}>{level}. Sınıflar</Text>
                        <Text style={{color:'#80BBF0', fontSize:10}}>Sınıf Sayısı : {classes.filter(c=>c.level===level).length}</Text>
                    </View>
                    <View style={{paddingVertical:10, borderRadius:25, backgroundColor:'#489EEA', flexDirection:'row', alignItems:'center'}}>
                        <Text style={{marginLeft:10, flex:1, color:'white'}}>Öğrenci Sayısı</Text>
                        <Avatar.Text label={students.filter(s=>s.level===level).length} size={40} style={{marginRight:10,backgroundColor:'#8CC2F2'}} color='white'/>
                    </View>
                </TouchableOpacity>
            )
        })
        
        return (
            <ScrollView style={{padding:10,marginTop:ifIphoneX(20,0)}}>
                <Alert ref={node=>(this._alert=node)} />
                <View style={{height:50,width:'100%',flexDirection:'row',marginBottom:20}}>
                    <TouchableOpacity style={styles.notificationButton} onPress={()=>{
                         this.props.logOut()
                        this.message("Bildirim","Bildirim Bulunmamaktadır.")
                    }}>
                        <Image source={icons.Notification} style={{width:25,height:25, tintColor:'#F39200'}} resizeMode='contain'/>
                    </TouchableOpacity>
                    <View style={{flex:1, alignItems:'center',justifyContent:'center',height:50}}>
                        <Text style={{fontSize:30, color:'#042C5C'}}>Bi'Tıkla</Text>
                    </View>
                    <View style={{width:50,height:50}}>
                        
                    </View>
                    {/*
                    <TouchableOpacity style={styles.profileButton}>
                        <Image source={icons.User} style={{width:25,height:25, tintColor:'white'}} resizeMode='contain'/>
                    </TouchableOpacity>
                    */}
                </View>
                <View style={{alignItems:'center',justifyContent:'center',marginBottom:20}}>
                    <Text style={{fontSize:30,color:'#F39200'}}>{this.props.school.name}</Text>
                </View>
                <View style={{marginBottom:20,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:30,color:'#77869E'}}>{student!==null && student!==undefined?student._class.level+' - '+student._class.name +' Sınıfı '+
                    student.number + ' Numaralı':''}</Text>
                    <Text style={{fontSize:30,color:'#042C5C'}}>{user.first_name + " "+user.last_name}</Text>
                </View>
                <View style={{marginBottom:20,flexDirection:'row',flexWrap:'wrap'}}>
                    <TouchableOpacity style={styles.groupItem} onPress={()=>{
                        Actions.sRollCall({student:student})
                    }}>
                        <View style={{flex:1, justifyContent:'center',paddingHorizontal:10}}>
                            <Text style={{color:'white', fontSize:20}}>Devamsızlık Durumu</Text>
                        </View>
                        <View style={{paddingVertical:10, borderRadius:25, backgroundColor:'#489EEA', flexDirection:'row', alignItems:'center',justifyContent:'center'}}>
                            <Avatar.Text label={rollcalls.rollcalls.length} size={40} style={{backgroundColor:'#e74c3c'}} color='white'/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.groupItem} onPress={()=>{
                        Actions.classes('studentRollCall')
                    }}>
                        <View style={{flex:1, justifyContent:'center',paddingHorizontal:10}}>
                            <Text style={{color:'white', fontSize:20}}>Öğretmen Duyuruları</Text>
                        </View>
                        <View style={{paddingVertical:10, borderRadius:25, backgroundColor:'#489EEA', flexDirection:'row', alignItems:'center',justifyContent:'center'}}>
                            <Avatar.Text label='0' size={40} style={{backgroundColor:'#e74c3c'}} color='white'/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.groupItem} onPress={()=>{
                        Actions.classes('studentRollCall')
                    }}>
                        <View style={{flex:1, justifyContent:'center',paddingHorizontal:10}}>
                            <Text style={{color:'white', fontSize:20}}>İdare Duyuruları</Text>
                        </View>
                        <View style={{paddingVertical:10, borderRadius:25, backgroundColor:'#489EEA', flexDirection:'row', alignItems:'center',justifyContent:'center'}}>
                            <Avatar.Text label='0' size={40} style={{backgroundColor:'#e74c3c'}} color='white'/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.groupItem} onPress={()=>{
                        Actions.classes('studentRollCall')
                    }}>
                        <View style={{flex:1, justifyContent:'center',paddingHorizontal:10}}>
                            <Text style={{color:'white', fontSize:20}}>Ödev Takip</Text>
                        </View>
                        <View style={{paddingVertical:10, borderRadius:25, backgroundColor:'#489EEA', flexDirection:'row', alignItems:'center',justifyContent:'center'}}>
                            <Avatar.Text label='0' size={40} style={{backgroundColor:'#e74c3c'}} color='white'/>
                        </View>
                    </TouchableOpacity>
                </View>
                
                <Text style={{fontSize:30,color:'#77869E', marginBottom:20}}>HADİ DÜNYASINA KATIL</Text>
                <FlatList style={{marginBottom:20}} contentContainerStyle={{justifyContent:'center',flexDirection:'row',flexWrap:'wrap'}} data={[
                    {name:'Kanka', icon:icons.Logo, url:''},
                    {name:'Eğitim', icon:icons.Logo, url:''},
                    {name:'Mesaj', icon:icons.Logo, url:''},
                    {name:'Cevapla', icon:icons.Logo, url:''},
                ]} renderItem={({item,index})=>{
                    return(
                        <TouchableOpacity style={styles.myApps}>
                            <View style={{flex:1, justifyContent:'center',paddingHorizontal:10}}>
                                <Image source={item.icon} style={{width:'100%',height:'100%'}} resizeMode='contain'/>
                            </View>
                            <View style={{flex:0.5,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{color:'#0078E2'}}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}>

                </FlatList>

                <StatusBar hidden={true}/>
            </ScrollView>
        )
    }
}


const mapStateToProps = (state) => ({
    school:state.School.school,
    classes:state.School.school.classes,
    students:state.School.school.students,
    user:state.User.user,
    rollcalls:state.RollCall,
})

const mapDispatchToProps = {
    getSchool,
    loginSocket,
    getReports,
    getRollCalls,
    logOut
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentHome)

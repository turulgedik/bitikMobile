import React, { Component } from 'react'
import {View,Text, TouchableOpacity, ScrollView, Image, FlatList, LogBox,Platform,TextInput} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import icons from '../Icons'
import {styles} from './style'
import { Avatar } from 'react-native-paper'
import { connect } from 'react-redux'
import {getSchool} from '../redux/actions/school'
import _ from 'lodash'
import {Actions} from 'react-native-router-flux'
import {loginSocket} from '../redux/actions/socket'
import {getReports} from '../redux/actions/atReport'
import {getNotifications,addNotification} from '../redux/actions/notifications'
import {getCourses} from '../redux/actions/course'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import Alert from '../components/Alert'
import {logOut} from '../redux/actions/auth'
import MyModal from '../components/MyModal'
import Moment from 'moment'

LogBox.ignoreAllLogs(true)
class Home extends Component {

    constructor(props){
        super(props)
        props.getSchool()
        props.loginSocket()
        props.getReports()
        props.getNotifications()
        props.getCourses()

    }
    message=(title,message)=>{
        this._alert.setTitle(title)
        this._alert.setMessage(message)
        this._alert.setConfirmText('Tamam')
        this._alert.show()
    }

    updateWasSeen=(selected)=>{
        const data={
            notification:selected.id,
            type:3,
        }

        this.props.addNotification(data,(req)=>{
            if(!req){
                this._alert.setTitle("Hata!")
                this._alert.setMessage("İşlem Sırasında bir şeyler yanlış gitti. Lütfen tekrar deneyiniz!")
                this._alert.setConfirmText('Tamam')
                this._alert.show()
            }
        })
    }

    render() {
        const {classes,students,notifications,courses}=this.props
        const sortNotify=notifications.sort((a,b)=>new Date(b.dateTime)-new Date(a.dateTime))
        const group=_.groupBy(classes,'other')
        const navigatorView=_.map(group,(elem,i)=>{
            const level=elem[0].other
            let count=0
            elem.map(item=>{
                const studentCount=students.filter(s=>s._class===item._account).length
                count+=studentCount
            })
            return(
                <TouchableOpacity style={styles.groupItem} onPress={()=>{
                    Actions.classes({level:level})
                }}>
                    <View style={{flex:1, justifyContent:'center',paddingHorizontal:10}}>
                        <Text style={{color:'white', fontSize:20}}>{level}</Text>
                        <Text style={{color:'#80BBF0', fontSize:10}}>Sınıf Sayısı : {classes.filter(c=>c.other===level).length}</Text>
                    </View>
                    <View style={{paddingVertical:10, borderRadius:25, backgroundColor:'#489EEA', flexDirection:'row', alignItems:'center'}}>
                        <Text style={{marginLeft:10, flex:1, color:'white'}}>Öğrenci Sayısı</Text>
                        <Avatar.Text label={count} size={40} style={{marginRight:10,backgroundColor:'#8CC2F2'}} color='white'/>
                    </View>
                </TouchableOpacity>
            )
        })
        return (
            <ScrollView style={{padding:10,marginTop:ifIphoneX(20,0)}}>
                <Alert ref={node=>(this._alert=node)} />
                <MyModal ref={node=>(this._notify=node)}>
                    <ScrollView style={styles.showMedia}>
                        <Alert ref={node=>(this.showNoti=node)} />

                        <View style={{flexDirection:'row',width:'100%',marginBottom:10}}>
                            <View style={{flex:1,justifyContent:'center'}}>
                                <Text style={{fontSize:20,fontWeight:'bold'}}>Duyurular</Text>
                            </View>
                        </View>
                        <View style={{width:'100%',}}>
                            {sortNotify.map(item=>{
                                const {_creator,notification,dateTime,wasSeen}=item
                                const wasState=wasSeen.findIndex(w=>w.id===this.props.userID)
                                return(
                                    <TouchableOpacity style={{width:'100%', borderBottomWidth:0.5,borderColor:'#34495e',paddingHorizontal:5}} onPress={()=>{
                                        if(wasState===-1)
                                            this.updateWasSeen(item)
                                        this.showNoti.setTitle('Duyuru')
                                        this.showNoti.setMessage(notification)
                                        this.showNoti.setConfirmText('Tamam')
                                        this.showNoti.show()
                                    }}>
                                        <View style={{height:50,flexDirection:'row',width:'100%',alignItems:'center'}}>
                                            <Image source={icons.Teacher} style={{width:40,height:40}} resizeMode='contain'/>
                                            <Text style={{fontSize:20}}>{_creator.first_name+' '+_creator.last_name}</Text>
                                        </View>
                                        <View style={{height:50,justifyContent:'center'}}>
                                            <Text>{notification}</Text>
                                        </View>
                                        <View style={{height:50,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                            {
                                                wasState===-1?
                                                <View style={{flex:1}}>
                                                    <Image source={icons.WasSeen} style={{width:40,height:40,tintColor:'#34495e'}} resizeMode='contain'/>
                                                </View>:null
                                            }
                                            <Text style={{fontSize:12}}>{Moment(dateTime).format('yyyy-MM-DD')}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </ScrollView>
                </MyModal>
                <View style={{height:50,width:'100%',flexDirection:'row',marginBottom:20}}>
                    <TouchableOpacity style={styles.notificationButton} onPress={()=>{
                        
                        this._notify.onShow()
                    }}>
                        <Image source={icons.Notification} style={{width:25,height:25, tintColor:'#F39200'}} resizeMode='contain'/>
                    </TouchableOpacity>
                    <View style={{flex:1, alignItems:'center',justifyContent:'center',height:50,}}>
                        <Image source={icons.Logo2} style={{width:'100%',height:'100%'}} resizeMode='contain'/>
                    </View>
                    <TouchableOpacity style={[styles.notificationButton,{borderColor:'#e74c3c'}]} onPress={()=>{
                        this._alert.setTitle('Çıkış Yap')
                        this._alert.setMessage("Çıkış Yapılsın mı?")
                        this._alert.setConfirmText('Evet')
                        this._alert.confirmHandler(()=>{
                            this.props.logOut()
                        })
                        this._alert.show()
                        
                    }}>
                        <Image source={icons.Exit} style={{width:25,height:25, tintColor:'#e74c3c'}} resizeMode='contain'/>
                    </TouchableOpacity>
                    {/*
                    <TouchableOpacity style={styles.profileButton}>
                        <Image source={icons.User} style={{width:25,height:25, tintColor:'white'}} resizeMode='contain'/>
                    </TouchableOpacity>
                    */}
                </View>
                <View style={{alignItems:'center',justifyContent:'center',marginBottom:20}}>
                    <Text style={{fontSize:30,color:'#042C5C'}}>Sınıf Seç</Text>
                </View>

                <View style={{marginBottom:20,flexDirection:'row',flexWrap:'wrap'}}>
                    {navigatorView}
                </View>
                {
                    courses.length>0?
                    <View>
                        <Text style={{fontSize:20,color:'#042C5C', marginBottom:20}}>KURSLARINIZ</Text>
                        <View style={{marginBottom:20,flexDirection:'row',flexWrap:'wrap'}}>
                            {
                                courses.map((item,i)=>{
                                    return(
                                        <TouchableOpacity style={styles.groupItem} onPress={()=>{
                                            Actions.course({id:item.id})
                                        }}>
                                            <View style={{flex:1, justifyContent:'center',paddingHorizontal:10}}>
                                                <Text style={{color:'white', fontSize:20}}>{item.name}</Text>
                                                <Text style={{color:'#80BBF0', fontSize:15}}>{item.level}</Text>
                                            </View>
                                            <View style={{paddingVertical:10, borderRadius:25, backgroundColor:'#489EEA', flexDirection:'row', alignItems:'center'}}>
                                                <Text style={{marginLeft:10, flex:1, color:'white'}}>Öğrenci Sayısı</Text>
                                                <Avatar.Text label={item._students.length} size={40} style={{marginRight:10,backgroundColor:'#8CC2F2'}} color='white'/>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </View>:null
                }
                <Text style={{fontSize:20,color:'#042C5C', marginBottom:20}}>DİĞER UYGULAMALARIMIZ</Text>    
                {
                    /*
                
                <FlatList style={{marginBottom:20}} contentContainerStyle={{justifyContent:'center',flexDirection:'row',flexWrap:'wrap'}} data={[
                    {name:'Bilgi Yarışması', icon:icons.Logo, url:''},
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
                */
                }

               {
                   /*
                    
                    */
               }

                <StatusBar hidden={true}/>
            </ScrollView>
        )
    }
}


const mapStateToProps = (state) => ({
    classes:state.School.school.classes,
    students:state.School.school.students,
    user:state.User.auth,
    userID:state.User.user.id,
    notifications:state.Notification.notifications,
    courses:state.Course.courses,
})

const mapDispatchToProps = {
    getSchool,
    loginSocket,
    getReports,
    logOut,
    getNotifications,
    addNotification,
    getCourses
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

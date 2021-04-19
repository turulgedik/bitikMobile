import React, { Component } from 'react'
import { connect } from 'react-redux'
import {View,Text,TouchableOpacity,Image, ScrollView,FlatList, TextInput} from 'react-native'
import {styles} from './style'
import icons from '../../Icons'
import {getHomeWorks,addHomeWork} from '../../redux/actions/homework'
import Tabs from '../../components/Tabs'
import Moment from 'moment'
import axios from 'axios'
import Alert from '../../components/Alert'
import {TrDateTime} from '../../components/TrDateTime'
import _ from 'lodash'
import {Actions} from 'react-native-router-flux'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import MyModal from '../../components/MyModal'

class sHomeWork extends Component {

    constructor(props){
        super(props)

        const {student,classes}=props
        props.getHomeWorks()

        this.state={
            selectedHomeWork:null
        }
    }

    componentDidMount(){
        
    }

    daysInMonth = (month, year)=> {
        return new Date(year, month, 0).getDate();
    }

    updateWasSeen=(selectedHomeWork)=>{
        const data={
            homeWork:selectedHomeWork.id,
            type:3,
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

        const {student,classes,students,rollcalls,homeWork}=this.props
        const {selectedHomeWork}=this.state
        console.log('homeWorks',homeWork.length)
        const sortHomeWorks=homeWork.sort((a,b)=>new Date(b.dateTime)-new Date(a.dateTime))

        var today=TrDateTime(new Date(Moment(new Date()).format('YYYY-MM-DD')))
        var startDateForDay=TrDateTime(new Date())
        startDateForDay.add(-6)
        
        const dayReports=sortHomeWorks.filter(r=> {var time=new Date(r.day).getTime(); return(time>=startDateForDay.getTime() && time<=today.getTime())})
        
        const weekGroup=sortHomeWorks.reduce((r,a)=>{
            const week=Moment(new Date(a.day)).week()
            r[week]=[...r[week] || [],a]
            
            return r
        },{})

        const monthGroup=sortHomeWorks.reduce((r,a)=>{
            const month=new Date(a.day).getMonth()
            r[month]=[...r[month] || [],a]
            
            return r
        },{})
        
        return (
            <View style={[styles.background,{marginTop:ifIphoneX(20,0)}]}>
                {
                    selectedHomeWork!==null?
                    <MyModal ref={node=>(this._homeWork=node)}>
                        <View style={styles.alert}>
                            <Text style={{fontSize:25}}>Ödev</Text>
                            <ScrollView style={{width:'100%',marginVertical:10}}>
                                <Text>{selectedHomeWork.homeWork}</Text>
                            </ScrollView>
                            <View style={{width:'100%'}}>
                                <Text style={{fontSize:18,marginBottom:10}}>Öğretmen : {selectedHomeWork._creator.first_name+ ' '+selectedHomeWork._creator.last_name}</Text>
                                <Text style={{fontSize:12}}>Bitiş Tarihi : {selectedHomeWork.last_date}</Text>
                            </View>
                        </View>
                    </MyModal>:null
                }
                <Alert ref={node=>(this._alert=node)}/>
                <View style={styles.title}>
                    <TouchableOpacity style={{height:'100%',width:50}}  onPress={()=>{
                        Actions.pop()
                    }}>
                        <Image source={icons.Back} style={{height:'100%',width:'100%', tintColor:'#0A7ADD'}} resizeMode='contain'/>
                    </TouchableOpacity>
                    
                </View>
                <View style={{marginHorizontal:-10,flex:1}}>
                <View style={{width:'100%',flex:1}}>

                    <Tabs scrollEnabled={true}>
                        <Tabs.Item title='Ödev Takibi' component={
                            <ScrollView>
                                {
                                   sortHomeWorks.map((item,i)=>{
                                        const {_creator,homeWork,whoDo,wasSeen,last_date}=item
                                        const _state=whoDo.findIndex(w=>w._account.id===this.props.user.id)
                                        return(
                                            <TouchableOpacity style={{width:'100%',padding:10,flexDirection:'row', borderBottomWidth:5,borderBottomColor:'#34495e'}} onPress={()=>{
                                                this.setState({selectedHomeWork:item},()=>{
                                                    this._homeWork.onShow()
                                                    if(wasSeen.findIndex(w=>w.id===this.props.user.id)===-1)
                                                        this.updateWasSeen(item)
                                                })
                                            }}>
                                                <View style={{flex:1,padding:10}}>
                                                    <View style={{flexDirection:'row',height:50}}>
                                                        <View style={{height:'100%',width:50,justifyContent:'center',alignItems:'center'}}>
                                                            <Image source={icons.User} style={{height:40,width:40}} resizeMode='contain'/>
                                                        </View>
                                                        <View style={{height:'100%',flex:1,justifyContent:'center'}}>
                                                            <Text>{_creator.first_name+' '+_creator.last_name}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{padding:10}}>
                                                        <View style={{height:50,justifyContent:'center'}}>
                                                            <Text>{(homeWork.length>30)?homeWork.substring(0,30)+'...':homeWork}</Text>
                                                        </View>
                                                        <View>
                                                            <Text style={{fontSize:12}}>Bitiş Tarihi : {last_date}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{width:75,backgroundColor:_state===-1?'#c0392b':'#27ae60',alignItems:'center',justifyContent:'center'}}>
                                                    <Image source={_state===-1?icons.Not:icons.Okey} style={{width:40,height:40,tintColor:'white'}} resizeMode='contain'/>
                                                </View>
                                            </TouchableOpacity>
                                        )

                                   })
                                }
                            </ScrollView>
                        
                        }/>
                        
                    </Tabs>
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    classes:state.School.school.classes,
    students:state.School.school.students,
    rollcalls:state.RollCall,
    connecteds:state.Socket.connecteds,
    homeWork:state.HomeWork.homeworks,
    user:state.User.user,

})

const mapDispatchToProps = {
    getHomeWorks,
    addHomeWork
}

export default connect(mapStateToProps, mapDispatchToProps)(sHomeWork)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import {View,Text,TouchableOpacity,Image, ScrollView,FlatList, TextInput} from 'react-native'
import {styles} from './style'
import icons from '../../Icons'
import {getRollCalls,removeRollCall,addRollCall} from '../../redux/actions/rollcall'
import Tabs from '../../components/Tabs'
import Moment from 'moment'
import axios from 'axios'
import Alert from '../../components/Alert'
import {TrDateTime} from '../../components/TrDateTime'
import _ from 'lodash'
import {Actions} from 'react-native-router-flux'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import DropDown from '../../components/DropDown'

class sRollCallReport extends Component {

    constructor(props){
        super(props)

        const {student,classes}=props
        props.getRollCalls(student._account.id)
    }

    componentDidMount(){
        
    }

    daysInMonth = (month, year)=> {
        return new Date(year, month, 0).getDate();
    }

    render() {

        const {student,classes,students,rollcalls,connecteds}=this.props
        const _class=student._class
        const sortRollCalls=rollcalls.rollcalls.sort((a,b)=>new Date(b.day)-new Date(a.day))

        var today=TrDateTime(new Date(Moment(new Date()).format('YYYY-MM-DD')))
        var startDateForDay=TrDateTime(new Date())
        startDateForDay.add(-6)
        
        const dayReports=sortRollCalls.filter(r=> {var time=new Date(r.day).getTime(); return(time>=startDateForDay.getTime() && time<=today.getTime())})
        
        const weekGroup=sortRollCalls.reduce((r,a)=>{
            const week=Moment(new Date(a.day)).week()
            r[week]=[...r[week] || [],a]
            
            return r
        },{})

        const monthGroup=sortRollCalls.reduce((r,a)=>{
            const month=new Date(a.day).getMonth()
            r[month]=[...r[month] || [],a]
            
            return r
        },{})
        
        return (
            <View style={[styles.background,{marginTop:ifIphoneX(20,0)}]}>

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
                    <View style={{alignItems:'center',justifyContent:'center'}}>
                        <Text style={{color:'#042C5C', fontSize:20, marginBottom:20}}>Devamsızlık Raporu</Text>
                    </View>
                    <Tabs scrollEnabled={true}>
                        <Tabs.Item title='Günlük' component={
                            <ScrollView>
                                {
                                    _.map(_.groupBy(dayReports,'day'),(item,i)=>{
                                        var date=TrDateTime(new Date(i))
                                        console.log("timetable",item.length)
                                        return(
                                            <DropDown name={date.gun()}>
                                                {
                                                    item.map(x=>(
                                                        <View style={{width:'100%',padding:10,borderBottomColor:'#e1e1e1', borderBottomWidth:0.5}}>
                                                            <View style={{flexDirection:'row',alignItems:'center',marginBottom:5}}>
                                                                <Image source={icons.Study} style={{width:30,height:30,marginRight:10}} resizeMode='contain'/>
                                                                <Text>Ders : {x._timeTable.study.name} ({x.index}. Ders)</Text>
                                                            </View>
                                                            <View style={{flexDirection:'row',alignItems:'center',marginBottom:5}}>
                                                                <Image source={icons.Clock} style={{width:30,height:30,marginRight:10}} resizeMode='contain'/>
                                                                <Text>Saat : {x._timeTable.first_time} - {x._timeTable.last_time}</Text>
                                                            </View>
                                                            <View style={{flexDirection:'row',alignItems:'center',}}>
                                                                <Image source={icons.Date} style={{width:30,height:30,marginRight:10}} resizeMode='contain'/>
                                                                <Text>Tarih : {x.day}</Text>
                                                            </View>
                                                        </View>
                                                    ))
                                                }
                                            </DropDown>
                                        )
                                    })
                                }
                            </ScrollView>
                        
                        }/>
                        <Tabs.Item title='Haftalık' component={
                            <ScrollView>
                            {
                                _.map(weekGroup,(item,i)=>{
                                    var firstDate=TrDateTime(new Date(item[0].day))
                                    var lastDate=TrDateTime(new Date(item[item.length-1].day))
                                    console.log('item',item)
                                    return(
                                        <DropDown name={firstDate.getDate()+" - "+firstDate.ay()+" / "+lastDate.getDate()+" - "+lastDate.ay()+' Tarihleri Arası'}>
                                            {
                                                item.map(x=>(
                                                    <View style={{width:'100%',padding:10,borderBottomColor:'#e1e1e1', borderBottomWidth:0.5}}>
                                                        <View style={{flexDirection:'row',alignItems:'center',marginBottom:5}}>
                                                            <Image source={icons.Study} style={{width:30,height:30,marginRight:10}} resizeMode='contain'/>
                                                            <Text>Ders : {x._timeTable.study.name} ({x.index}. Ders)</Text>
                                                        </View>
                                                        <View style={{flexDirection:'row',alignItems:'center',marginBottom:5}}>
                                                            <Image source={icons.Clock} style={{width:30,height:30,marginRight:10}} resizeMode='contain'/>
                                                            <Text>Saat : {x._timeTable.first_time} - {x._timeTable.last_time}</Text>
                                                        </View>
                                                        <View style={{flexDirection:'row',alignItems:'center',}}>
                                                            <Image source={icons.Date} style={{width:30,height:30,marginRight:10}} resizeMode='contain'/>
                                                            <Text>Tarih : {x.day}</Text>
                                                        </View>
                                                    </View>
                                                ))
                                            }
                                        </DropDown>
                                    )
                                })
                            }
                            </ScrollView>
                        }/>
                        <Tabs.Item title='Aylık' component={
                            <ScrollView>
                            {
                                _.map(monthGroup,(item,i)=>{
                                    var monthDate=TrDateTime(new Date(item[0].day))
                                    const dayCount=this.daysInMonth(monthDate.getMonth()+1,monthDate.getFullYear())
                                    return(
                                        <DropDown name={monthDate.ay()}>
                                            {
                                                item.map(x=>(
                                                    <View style={{width:'100%',padding:10,borderBottomColor:'#e1e1e1', borderBottomWidth:0.5}}>
                                                        <View style={{flexDirection:'row',alignItems:'center',marginBottom:5}}>
                                                            <Image source={icons.Study} style={{width:30,height:30,marginRight:10}} resizeMode='contain'/>
                                                            <Text>Ders : {x._timeTable.study.name} ({x.index}. Ders)</Text>
                                                        </View>
                                                        <View style={{flexDirection:'row',alignItems:'center',marginBottom:5}}>
                                                            <Image source={icons.Clock} style={{width:30,height:30,marginRight:10}} resizeMode='contain'/>
                                                            <Text>Saat : {x._timeTable.first_time} - {x._timeTable.last_time}</Text>
                                                        </View>
                                                        <View style={{flexDirection:'row',alignItems:'center',}}>
                                                            <Image source={icons.Date} style={{width:30,height:30,marginRight:10}} resizeMode='contain'/>
                                                            <Text>Tarih : {x.day}</Text>
                                                        </View>
                                                    </View>
                                                ))
                                            }
                                        </DropDown>
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
    connecteds:state.Socket.connecteds
})

const mapDispatchToProps = {
    getRollCalls,
}

export default connect(mapStateToProps, mapDispatchToProps)(sRollCallReport)

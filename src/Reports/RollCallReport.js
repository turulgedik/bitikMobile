import React, { Component } from 'react'
import { connect } from 'react-redux'
import {View,Text,TouchableOpacity,Image, ScrollView,FlatList, TextInput} from 'react-native'
import {styles} from './style'
import icons from '../Icons'
import {getRollCalls,removeRollCall,addRollCall} from '../redux/actions/rollcall'
import Tabs from '../components/Tabs'
import Moment from 'moment'
import axios from 'axios'
import Alert from '../components/Alert'
import {TrDateTime} from '../components/TrDateTime'
import _ from 'lodash'
import {Actions} from 'react-native-router-flux'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import DropDown from '../components/DropDown'

class RollCallReport extends Component {

    constructor(props){
        super(props)

        const {id,classes}=props
        const _class=classes.find(c=>c._account===id)

        this.state={
            //selectedGroup:_class.groups.length>0?_class.groups[0]:null,
        }
    }

    componentDidMount(){
        this.props.getRollCalls()
    }

    daysInMonth = (month, year)=> {
        return new Date(year, month, 0).getDate();
    }

    render() {

        const {id,classes,students,rollcalls,connecteds}=this.props
        const _class=classes.find(c=>c._account===id)
        const con=connecteds!==undefined?connecteds.find(elem=>elem.id===_class._account):null
        const filter=rollcalls.rollcalls.filter(r=>r._class._account===id)
        const sortRollCalls=filter.sort((a,b)=>new Date(b.day)-new Date(a.day))
        
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
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{color:'#042C5C',fontSize:25}}>{_class.other + " / "+_class.name}</Text>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <Image source={icons.Users} style={{height:20,width:20}} resizeMode='contain'/>
                            <Text style={{fontSize:20}}>{students.filter(s=>s._class!==null&&s._class===id).length}</Text>
                        </View>
                    </View>
                    <View style={{...styles.profileButton}}>
                        
                    </View>
                </View>
                <View style={{marginHorizontal:-10,flex:1}}>
                <View style={{width:'100%',flex:1}}>
                    <View style={{alignItems:'center',justifyContent:'center'}}>
                        <Text style={{color:'#042C5C', fontSize:20, marginBottom:20}}>{_class.other+" / "+_class.name + " -  Yoklama Raporu"}</Text>
                    </View>
                    <Tabs scrollEnabled={true}>
                        <Tabs.Item title='Günlük' component={
                            <ScrollView>
                                {
                                    _.map(_.groupBy(dayReports,'day'),(item,i)=>{
                                        var date=TrDateTime(new Date(i))
                                        console.log("timetable",item.length)
                                        return(
                                            <DropDown name={date.gun() + " - "+i} key={i}>
                                                <View style={{width:'100%',paddingHorizontal:10}}>
                                                    {
                                                        item.map((item,i)=>{
                                                            return(
                                                                <DropDown name={item._timeTable.study.name + (item._students.length>0?(" - Gelmeyen Sayısı : "+item._students.length):" - Sınıf Tam")}>
                                                                    <ScrollView style={{flex:1}}>
                                                                        {
                                                                            item._students.map(item=>{
                                                                                return(
                                                                                    <View style={{height:50,width:'100%',flexDirection:'row',alignItems:'center'}}>
                                                                                        <Image source={{uri:item._account.image}} style={{width:35,height:35,marginRight:10}} resizeMode='contain'/>
                                                                                        <Text>{item._account.first_name+" "+item._account.last_name + " ("+item.number+")"}</Text>
                                                                                    </View>
                                                                                )
                                                                            })
                                                                        }
                                                                    </ScrollView>
                                                                </DropDown>
                                                            )
                                                        })
                                                    }
                                                </View>
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
                                    var firstDate=new TrDateTime(new Date(item[0].day))
                                    const f_month=firstDate.ay()
                                    console.log(f_month)
                                    var lastDate=new TrDateTime(new Date(item[item.length-1].day))
                                    var text = firstDate.getDate()+" - "+f_month+" / "+lastDate.getDate()+" - "+lastDate.ay()
                                    return(
                                        <DropDown name={text } key={i}>
                                            <View style={{width:'100%',paddingHorizontal:10}}>
                                                {
                                                    _.map(_.groupBy(item,'day'),(item,i)=>{
                                                        var date=TrDateTime(new Date(i))
                                                        return(
                                                            <DropDown name={date.gun() + " - "+i} key={i}>
                                                                <View style={{width:'100%',paddingHorizontal:10}}>
                                                                    {
                                                                        item.map((item,i)=>{
                                                                            return(
                                                                                <DropDown name={item._timeTable.study.name + (item._students.length>0?(" - Gelmeyen Sayısı : "+item._students.length):" - Sınıf Tam")}>
                                                                                    <ScrollView style={{flex:1}}>
                                                                                        {
                                                                                            item._students.map(item=>{
                                                                                                return(
                                                                                                    <View style={{height:50,width:'100%',flexDirection:'row',alignItems:'center'}}>
                                                                                                        <Image source={{uri:item._account.image}} style={{width:35,height:35,marginRight:10}} resizeMode='contain'/>
                                                                                                        <Text>{item._account.first_name+" "+item._account.last_name + " ("+item.number+")"}</Text>
                                                                                                    </View>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </ScrollView>
                                                                                </DropDown>
                                                                            )
                                                                        })
                                                                    }
                                                                </View>
                                                            </DropDown>
                                                        )
                                                    })
                                                    
                                                }
                                            </View>
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
                                    return(
                                        <DropDown name={monthDate.ay()} key={i}>
                                            <View style={{width:'100%',paddingHorizontal:10}}>
                                                {
                                                    _.map(_.groupBy(item,'day'),(item,i)=>{
                                                        var date=TrDateTime(new Date(i))
                                                        return(
                                                            <DropDown name={date.gun() + " - "+i} key={i}>
                                                                <View style={{width:'100%',paddingHorizontal:10}}>
                                                                    {
                                                                        item.map((item,i)=>{
                                                                            return(
                                                                                <DropDown name={item._timeTable.study.name + (item._students.length>0?(" - Gelmeyen Sayısı : "+item._students.length):" - Sınıf Tam")}>
                                                                                    <ScrollView style={{flex:1}}>
                                                                                        {
                                                                                            item._students.map(item=>{
                                                                                                return(
                                                                                                    <View style={{height:50,width:'100%',flexDirection:'row',alignItems:'center'}}>
                                                                                                        <Image source={{uri:item._account.image}} style={{width:35,height:35,marginRight:10}} resizeMode='contain'/>
                                                                                                        <Text>{item._account.first_name+" "+item._account.last_name + " ("+item.number+")"}</Text>
                                                                                                    </View>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </ScrollView>
                                                                                </DropDown>
                                                                            )
                                                                        })
                                                                    }
                                                                </View>
                                                            </DropDown>
                                                        )
                                                    })
                                                    
                                                }
                                            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(RollCallReport)

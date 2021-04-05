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

class ATReports extends Component {

    constructor(props){
        super(props)

        const {id,classes}=props
        const _class=classes.find(c=>c._account===id)

        this.state={
            //selectedGroup:_class.groups.length>0?_class.groups[0]:null,
        }
    }

    componentDidMount(){
        
    }

    daysInMonth = (month, year)=> {
        return new Date(year, month, 0).getDate();
    }

    render() {

        const {id,classes,connecteds}=this.props
        const _class=classes.find(c=>c._account===id)
        const con=connecteds!==undefined?connecteds.find(elem=>elem.id===_class._account):null
        const at=this.props.at.filter(s=>s._class===id)

        const sortReports=at.sort((a,b)=>new Date(b.day)-new Date(a.day))

        var today=TrDateTime(new Date(Moment(new Date()).format('YYYY-MM-DD')))
        var startDateForDay=TrDateTime(new Date())
        startDateForDay.add(-6)
        
        const todayReports=sortReports.filter(r=> Moment(new Date(r.dateTime)).format('YYYY-MM-DD')===Moment(new Date()).format('YYYY-MM-DD'))
        
        const dayReports=sortReports.filter(r=> {var time=new Date(Moment(r.dateTime).format('YYYY-MM-DD')).getTime(); return(time>=startDateForDay.getTime() && time<=today.getTime())})

        const monthReports=sortReports.filter(r=> {return(Moment(new Date(r.dateTime)).format('MM')===Moment(new Date()).format('MM'))})

        return (
            <View style={[styles.background,{marginTop:ifIphoneX(20,0)}]}>

                <Alert ref={node=>(this._alert=node)}/>
                <View style={styles.title}>
                    <TouchableOpacity style={{height:'100%',width:50}} onPress={()=>{
                        Actions.pop()
                    }}>
                        <Image source={icons.Back} style={{height:'100%',width:'100%', tintColor:'#0A7ADD'}} resizeMode='contain'/>
                    </TouchableOpacity>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{color:'#042C5C',fontSize:20}}>{_class.level + " / "+_class.name}</Text>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <Image source={icons.Users} style={{height:20,width:20}} resizeMode='contain'/>
                            <Text style={{fontSize:15}}>{}</Text>
                        </View>
                    </View>
                    <View style={{...styles.profileButton,backgroundColor:con!==null && con!==undefined?"#2ecc71":"#e74c3c"}}>
                        <Text style={{color:'white'}}>{con!==null && con!==undefined?"Açık":"Kapalı"}</Text>
                    </View>
                </View>
                <View style={{marginHorizontal:-10,flex:1}}>
                    {
                        <Tabs scrollEnabled={false} onChangeIndex={this.onChangeIndex}>
                            <Tabs.Item title='Bugün' component={
                                <ScrollView>
                                    {
                                        todayReports.map((elem,i)=>(
                                            <View style={{width:'100%', height:100, flexDirection:'row'}}>
                                                <View style={{flex:1,height:100,flexDirection:'row', alignItems:'center'}}>
                                                    <Image source={icons.Users} style={{width:50,height:50,tintColor:'red',marginRight:10}} />
                                                    <View style={{flex:1}}>
                                                        <View style={{flex:1,justifyContent:'center'}}>
                                                            <Text>{elem._creator.first_name+" "+elem._creator.last_name}</Text>
                                                            <Text>İşlem : {elem.command.description}</Text>
                                                        </View>
                                                        
                                                    </View>
                                                </View>
                                                <View style={{alignItems:'center',justifyContent:'center'}}>
                                                    <Text>Saat : {Moment(new Date(elem.dateTime)).format('hh:mm')}</Text>
                                                    <Text>Tarih : {Moment(new Date(elem.dateTime)).format('DD.MM.YYYY')}</Text>
                                                </View>
                                            </View>
                                        ))
                                    }
                                </ScrollView>
                            
                            }/>
                            <Tabs.Item title='Haftalık' component={
                                <ScrollView>
                                    {
                                        dayReports.map((elem,i)=>(
                                            <View style={{width:'100%', height:100, flexDirection:'row'}}>
                                                <View style={{flex:1,height:100,flexDirection:'row', alignItems:'center'}}>
                                                    <Image source={icons.Users} style={{width:50,height:50,tintColor:'red',marginRight:10}} />
                                                    <View style={{flex:1}}>
                                                        <View style={{flex:1,justifyContent:'center'}}>
                                                            <Text>{elem._creator.first_name+" "+elem._creator.last_name}</Text>
                                                            <Text>İşlem : {elem.command.description}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{alignItems:'center',justifyContent:'center'}}>
                                                    <Text>{Moment(new Date(elem.dateTime)).format('hh:mm')}</Text>
                                                    <Text>Tarih : {Moment(new Date(elem.dateTime)).format('DD.MM.YYYY')}</Text>
                                                </View>
                                            </View>
                                        ))
                                    }
                                </ScrollView>
                            }/>
                            <Tabs.Item title='Aylık' component={
                                <ScrollView>
                                    {
                                        monthReports.map((elem,i)=>(
                                            <View style={{width:'100%', height:100, flexDirection:'row'}}>
                                                <View style={{flex:1,height:100,flexDirection:'row', alignItems:'center'}}>
                                                    <Image source={icons.Users} style={{width:50,height:50,tintColor:'red',marginRight:10}} />
                                                    <View style={{flex:1}}>
                                                        <View style={{flex:1,justifyContent:'center'}}>
                                                            <Text>{elem._creator.first_name+" "+elem._creator.last_name}</Text>
                                                            <Text>İşlem : {elem.command.description}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{alignItems:'center',justifyContent:'center'}}>
                                                    <Text>{Moment(new Date(elem.dateTime)).format('hh:mm')}</Text>
                                                    <Text>Tarih : {Moment(new Date(elem.dateTime)).format('DD.MM.YYYY')}</Text>
                                                </View>
                                            </View>
                                        ))
                                    }
                                </ScrollView>
                            }/>
                        </Tabs>
                    }
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    classes:state.School.school.classes,
    at:state.AT.reports,
    connecteds:state.Socket.connecteds
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ATReports)

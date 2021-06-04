import React, { Component } from 'react'
import { connect } from 'react-redux'
import {View,Text,TouchableOpacity,Image, ScrollView,FlatList, TextInput,Dimensions} from 'react-native'
import {styles} from './style'
import icons from '../Icons'
import {getRollCalls,removeRollCall,addRollCall,saveRollCall} from '../redux/actions/rollcall'
import Tabs from '../components/Tabs'
import Moment from 'moment'
import MyModal from '../components/MyModal'
import axios from 'axios'
import DateTimePicker from '@react-native-community/datetimepicker';
import Alert from '../components/Alert'
import {Actions} from 'react-native-router-flux'
import {BASE_URL,IMAGE_URL} from '../redux/actions/host'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const windowWidth = Dimensions.get('window').width;

class RollCall extends Component {

    constructor(props){
        super(props)

        const {id,classes}=props
        const _class=classes.find(c=>c._account===id)

        this.state={
            //selectedGroup:_class.groups.length>0?_class.groups[0]:null,
            date:Moment(new Date()).format('yyyy-MM-DD'),
            datePicker:false,
            studys:[],
            selectedTimeTable:null,
            selectedStudyIndex:-1,
            year:'',
            month:'',
            day:'',
            saving:false,
            _students:[],
        }
    }

    componentDidMount(){
        this.props.getRollCalls()
    }
    componentDidUpdate(prevProps,prevState){
        if(prevState.selectedTimeTable!==this.state.selectedTimeTable){
            let currentRollCall=this.props.rollcalls.rollcalls.find(r=>(r._class._account===this.props.id && r.day===this.state.date) && (r._timeTable.id===this.state.selectedTimeTable.id && r.index===this.state.selectedStudyIndex))
            console.log(currentRollCall)
            this.setState({_students:currentRollCall!==undefined?currentRollCall._students:[],currentRoll:currentRollCall})
        }
    }

    saveRollCall=()=>{
        if(this.state.selectedTimeTable===null || this.state.selectedStudyIndex===-1){
            this._alert.setTitle('Hata!')
            this._alert.setMessage('Yoklama İçin Ders Seçmeniz Gerekmektedir.')
            this._alert.setConfirmText('Tamam')
            this._alert.show()

            return
        }

        this.setState({saving:true})

        let studentID=[]


        this.state._students.map(item=>{
            studentID.push(item._account.id)
            if(this.state.currentRoll!==undefined){
                if(this.state.currentRoll._students.findIndex(s=>s._account.id===item._account.id)<0)
                    this.sendPushNotification(item)
            }else{
                this.sendPushNotification(item)
            }
        })

        const data={
            class:this.props.id,
            timeTable:this.state.selectedTimeTable.id,
            day:this.state.date,
            index:this.state.selectedStudyIndex,
            students:studentID
        }
        this.props.saveRollCall(data,(req)=>{

            this.setState({saving:false})
        })
    }



    sendPushNotification = (_student) => {
        console.log('token',_student._account.push_token)
        const message=_student.number+" Numaralı ("+_student._account.first_name+" "+_student._account.last_name+") öğrencimiz "+
                    this.state.date+" tarihinde "+this.state.selectedTimeTable.study.name+" dersine katılmamıştır.\r\n www.akillitahtayonetimi.com"

        const config={
            headers:{
              'Content-Type':'application/json'
            }
          }
        
        axios.post('https://exp.host/--/api/v2/push/send',{
            to: _student._account.push_token,
            sound: 'default',
            title: 'Hadi Okulum',
            body: message,
            data: { someData: 'goes here' },
        },config)
        .then(res=>{
            console.log("respons",res.data)
        })

        

      };

      /*
    add=(id)=>{

        if(this.state.selectedTimeTable===null || this.state.selectedStudyIndex===-1){
            this._alert.setTitle('Hata!')
            this._alert.setMessage('Yoklama İçin Ders Seçmeniz Gerekmektedir.')
            this._alert.setConfirmText('Tamam')
            this._alert.show()

            return
        }

        const data={
            student:id,
            day:this.state.date,
            timeTable:this.state.selectedTimeTable.id,
            index:this.state.selectedStudyIndex+1
        }

        this.props.addRollCall(data,(req)=>{
            console.log(req);
        })
    }

    remove=(id)=>{
        this.props.removeRollCall(id,(req)=>{
            console.log(req)
        })
    }
    */

    addStudent=(student)=>{
        this.setState({_students:[...this.state._students,student]})
    }
    removeStudent=(student)=>{
        this.setState({_students:[...this.state._students.filter(s=>s._account.id!==student._account.id)]})
    }

    onChangeIndex=(index)=>{
        const _class=this.props.classes.find(c=>c._account===this.props.id)
        //this.setState({selectedGroup:_class.groups[index]})
    }

    render() {
        const {id,classes,students,rollcalls}=this.props
        const {_students,saving}=this.state
        const _class=classes.find(c=>c._account===id)
        var nowDate=new Date(this.state.date)
        /*
        const groups=_class.groups.map((elem,i)=>{
            return(
                <Tabs.Item title={elem.name} component={
                    <View style={{width:'100%',padding:10}}>
                        <Text style={{color:'#042C5C', fontSize:20, marginBottom:20}}>{_class.level+" / "+_class.name + " - "+ elem.name + " Yoklama Listesi"}</Text>
                        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                            {
                                students.filter(s=>s._group.id===elem.id).map(student=>{
                                    const roll=rollcalls.rollcalls.filter(r=>r._student._account.id===student._account.id &&
                                        r.index===(this.state.selectedStudyIndex+1) && r.day===this.state.date).length>0?
                                        rollcalls.rollcalls.find(r=>r._student._account.id===student._account.id):null
                                    return (
                                        <View style={styles.studentView}>
                                            <TouchableOpacity style={{...styles.student,backgroundColor:roll!==null?'#e74c3c':'white'}} onPress={()=>{
                                                if(roll===null){
                                                    
                                                    this.add(student._account.id)
                                                }else{
                                                    this.remove(roll.id)
                                                }
                                            }}>
                                                <Image source={icons.User} style={{flex:1,marginBottom:10}} resizeMode='contain'/>
                                                <Text>{student._account.first_name+" "+student._account.last_name}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                } key={i}/>
            )
        })
        */
        return (
            <View style={[styles.background,{marginTop:ifIphoneX(20,0)}]}>
                {
                    saving?
                    <MyModal show={true} closeButton={false}>
                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                            <Text>Lütfen Bekleyiniz...</Text>
                        </View>
                    </MyModal>
                    :null
                }
                <MyModal ref={node=>(this._myModal=node)}>
                    <View style={styles.modal}>
                        <MyModal ref={node=>(this._datePicker=node)}>
                            <View style={{width:windowWidth*0.8}}>
                                <View style={{height:50,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                                    <Text style={{fontSize:20,flex:1}}>Tarih Seçin</Text>
                                </View>
                                <View style={{width:'100%'}}>
                                    <DateTimePicker style={{width:'100%',}} value={new Date(this.state.date)} mode='date' display='default' locale='tr' onChange={(event,date)=>{
                                        this.setState({date:Moment(date).format('yyyy-MM-DD')})
                                    }}/>
                                </View>
                            </View>
                        </MyModal>
                        <Text style={{fontSize:20,color:'#042C5C',marginBottom:20}}>Tarih</Text>
                        <TouchableOpacity style={{alignItems:'center',justifyContent:'center', flexDirection:'row', marginBottom:20}} onPress={()=>{
                            this._datePicker.onShow()
                        }}>
                            <View style={styles.dateTextView}>
                                <Text>{Moment(this.state.date).format('YYYY')}</Text>
                            </View>
                            <View style={styles.dateTextView}>
                                <Text>{Moment(this.state.date).format('MM')}</Text>
                            </View>
                            <View style={{...styles.dateTextView,marginRight:0}}>
                                <Text>{Moment(this.state.date).format('DD')}</Text>
                            </View>
                        </TouchableOpacity>
                        <Text style={{fontSize:20,color:'#042C5C',marginBottom:20}}>Ders Seç</Text>
                        <ScrollView>
                            {
                                _class._timeTable.filter(t=>t.day===nowDate.getDay()).map((elem,i)=>{
                                    const selected=this.state.selectedStudyIndex===i?true:false
                                    return(
                                        <TouchableOpacity style={selected?styles.studyViewSelected:styles.studyView} onPress={()=>{
                                            this.setState({selectedTimeTable:elem,selectedStudyIndex:parseInt(i)})
                                        }}>
                                            <Text style={{paddingHorizontal:10}}>{(i+1)+". Ders - "+elem.study.name}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                            
                        </ScrollView>
                    </View>
                </MyModal>
                <Alert ref={node=>(this._alert=node)}/>
                <View style={styles.title}>
                    <TouchableOpacity style={{height:'100%',width:50}}  onPress={()=>{
                        Actions.pop()
                    }}>
                        <Image source={icons.Back} style={{height:'100%',width:'100%', tintColor:'#0A7ADD'}} resizeMode='contain'/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'center'}} onPress={()=>{
                        this._myModal.onShow()
                    }}>
                        <Text style={{color:'#042C5C',fontSize:20}}>Yoklama</Text>
                        <Text style={{color:'#042C5C',fontSize:11}}>Ders : {this.state.selectedTimeTable===null?'Seç':
                            (this.state.selectedStudyIndex+1)+". Ders - "+ this.state.selectedTimeTable.study.name}
                        </Text>
                    </TouchableOpacity>
                    <View style={{width:50,height:50}}>
                        
                    </View>
                </View>
                <ScrollView style={{marginHorizontal:-10,flex:1}}>
                    <View style={{width:'100%',padding:10}}>
                        <Text style={{color:'#042C5C', fontSize:20, marginBottom:20}}>{_class.other+" / "+_class.name + " Yoklama Listesi"}</Text>
                        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                            {
                                students.filter(s=>s._class!==null&&s._class===id).map(student=>{
                                    var firstNameArray=student._account.first_name.split(' ')
                                    let first_name=firstNameArray[0]
                                    if(firstNameArray.length>1){
                                        const newName=firstNameArray[0].length>firstNameArray[1].length?firstNameArray[0].charAt(0)+'. '+firstNameArray[1]:
                                            firstNameArray[0]+' '+firstNameArray[1].charAt(0)+'.'
                                        first_name=newName
                                    }
                                    const roll=_students.findIndex(s=>s._account.id===student._account.id)>-1?true:false
                                    return (
                                        <View style={styles.studentView}>
                                            <TouchableOpacity style={{...styles.student,backgroundColor:roll!==false?'#e74c3c':'white', }} onPress={()=>{
                                                if(!roll){
                                                    
                                                    this.addStudent(student)
                                                }else{
                                                    this.removeStudent(student)
                                                }
                                            }}>
                                                <Image source={student._account.image===null?icons.User:{uri:IMAGE_URL+student._account.image}} style={{width:'100%',flex:1}} resizeMode='contain'/>
                                                <View style={{width:'100%',height:60,justifyContent:'center',alignItems:'center'}}>
                                                    <Text style={{fontSize:12,textAlign:'center'}}>{first_name+" "+student._account.last_name+'\r\n('+student.number+')'}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                </ScrollView>
                <View style={{height:50,flexDirection:'row',alignItems:'center',borderTopColor:'#1e1e1e',borderTopWidth:0.5,marginHorizontal:-10,}}>
                    <View>
                        <Text>Toplam Gelmeyen Sayısı : {this.state._students.length}</Text>
                        <Text>Sınıf Mevcudu : {students.filter(s=>s._class!==null&&s._class===id).length}</Text>
                    </View>
                    <View style={{flex:1,alignItems:'flex-end'}}>
                        <TouchableOpacity style={{width:100,height:50,backgroundColor:'#2ecc71', alignItems:'center',justifyContent:'center'}} onPress={()=>{
                            this.saveRollCall()
                        }}>
                            <Text style={{color:'white'}}>{this.state._students.length===0?'Sınıf Tam':'Kaydet'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    classes:state.School.school.classes,
    students:state.School.school.students,
    rollcalls:state.RollCall
})

const mapDispatchToProps = {
    getRollCalls,
    addRollCall,
    removeRollCall,
    saveRollCall
}

export default connect(mapStateToProps, mapDispatchToProps)(RollCall)

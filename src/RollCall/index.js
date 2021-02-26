import React, { Component } from 'react'
import { connect } from 'react-redux'
import {View,Text,TouchableOpacity,Image, ScrollView,FlatList, TextInput,Dimensions} from 'react-native'
import {styles} from './style'
import icons from '../Icons'
import {getRollCalls,removeRollCall,addRollCall} from '../redux/actions/rollcall'
import Tabs from '../components/Tabs'
import Moment from 'moment'
import MyModal from '../components/MyModal'
import axios from 'axios'
import DateTimePicker from '@react-native-community/datetimepicker';
import Alert from '../components/Alert'
import {Actions} from 'react-native-router-flux'

const windowWidth = Dimensions.get('window').width;

class RollCall extends Component {

    constructor(props){
        super(props)

        const {id,classes}=props
        const _class=classes.find(c=>c._account.id===id)

        this.state={
            //selectedGroup:_class.groups.length>0?_class.groups[0]:null,
            date:Moment(new Date()).format('yyyy-MM-DD'),
            datePicker:false,
            studys:[],
            selectedTimeTable:null,
            selectedStudyIndex:-1,
            year:'',
            month:'',
            day:''
        }
    }

    componentDidMount(){
        this.props.getRollCalls()
        this.getStudys()
    }

    getStudys=()=>{
        axios.get('http://localhost:8000/school/api/Studys/')
        .then(res=>{
            
            this.setState({studys:res.data})
        })
    }

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

    onChangeIndex=(index)=>{
        const _class=this.props.classes.find(c=>c._account.id===this.props.id)
        //this.setState({selectedGroup:_class.groups[index]})
    }

    render() {
        const {id,classes,students,rollcalls}=this.props
        const _class=classes.find(c=>c._account.id===id)
        var nowDate=new Date(this.state.date)
        console.log('timeTable',nowDate.getDay())
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
            <View style={styles.background}>
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
                <View style={{marginHorizontal:-10,flex:1}}>
                    <View style={{width:'100%',padding:10}}>
                        <Text style={{color:'#042C5C', fontSize:20, marginBottom:20}}>{_class.level+" / "+_class.name + " Yoklama Listesi"}</Text>
                        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                            {
                                students.filter(s=>s._class!==null&&s._class._account.id===id).map(student=>{
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
                </View>
                <View style={{marginHorizontal:-10,padding:10, borderTopColor:'#1e1e1e',borderTopWidth:0.5}}>
                    <Text>Toplam Gelmeyen Sayısı : {rollcalls.rollcalls.filter(r=>r._student._class._account.id===id &&
                                        r.index===(this.state.selectedStudyIndex+1) && r.day===this.state.date).length}</Text>
                    <Text>Sınıf Mevcudu : {students.filter(s=>s._class!==null&&s._class._account.id===id).length}</Text>
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
    removeRollCall
}

export default connect(mapStateToProps, mapDispatchToProps)(RollCall)

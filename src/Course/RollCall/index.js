import React, { Component } from 'react'
import { connect } from 'react-redux'
import {View,Text,TouchableOpacity,Image, ScrollView,FlatList, TextInput,Dimensions} from 'react-native'
import {styles} from './style'
import icons from '../../Icons'
import Moment from 'moment'
import MyModal from '../../components/MyModal'
import Alert from '../../components/Alert'
import {Actions} from 'react-native-router-flux'
import DateTimePicker from '@react-native-community/datetimepicker';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import {getRollCall,saveRollCall} from '../../redux/actions/course'

const windowWidth = Dimensions.get('window').width;

class CourseRollCall extends Component {

    constructor(props){
        super(props)

        const {id}=props
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
            rollCalls:[],
            students:[],
            saving:false
        }

        this.getRollCall()
    }

    componentDidUpdate(prevProps,prevState){
        if(prevState.selectedTimeTable!==this.state.selectedTimeTable){
            let currentRollCall=this.state.rollCalls.find(r=>r.day===this.state.date && r._timeTable.id===this.state.selectedTimeTable.id && r.index===this.state.selectedStudyIndex)
            this.setState({students:currentRollCall!==undefined?currentRollCall._students:[]})
        }
    }

    getRollCall=()=>{
        this.props.getRollCall(this.props.id,(data)=>{
            this.setState({rollCalls:data})
        })
        
    }

    saveRollCall=()=>{

        if(this.state.selectedTimeTable===null || this.state.selectedStudyIndex===-1){
            this._alert.setTitle('Hata!')
            this._alert.setMessage('Yoklama İçin Ders Seçmeniz Gerekmektedir.')
            this._alert.setConfirmText('Tamam')
            this._alert.show()

            return
        }

        let studentID=[]

        this.state.students.map(item=>studentID.push(item._account.id))

        const data={
            course:this.props.id,
            timeTable:this.state.selectedTimeTable.id,
            day:this.state.date,
            index:this.state.selectedStudyIndex,
            students:studentID
        }
        this.props.saveRollCall(data,(req)=>{
            const newRollCall=req.rollcall
            let rollcalls=this.state.rollCalls
            const index=this.state.rollCalls.findIndex(c=>c.id===newRollCall.id)
            if(index>-1)
                rollcalls.splice(index,1,newRollCall)
            else
                rollcalls.push(newRollCall)
            
            this.setState({rollcalls:rollcalls,saving:false})
        })
    }

    addStudent=(student)=>{
        this.setState({students:[...this.state.students,student]})
    }
    removeStudent=(student)=>{
        this.setState({students:[...this.state.students.filter(s=>s._account.id!==student._account.id)]})
    }


    render() {
        const {courses,id}=this.props
        const {students,saving}=this.state
        const course=courses.find(c=>c.id===id)
        var nowDate=new Date(this.state.date)

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
                                
                                course._timeTable.filter(t=>t.day===nowDate.getDay()).map((elem,i)=>{
                                    
                                    const selected=this.state.selectedStudyIndex===i?true:false
                                    return(
                                        <TouchableOpacity style={selected?styles.studyViewSelected:styles.studyView} onPress={()=>{
                                            this.setState({selectedTimeTable:elem,selectedStudyIndex:parseInt(i)})
                                        }}>
                                            <Text style={{paddingHorizontal:10}}>{elem.study.name}</Text>
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
                        //alert(course._timeTable.filter(t=>t.day===nowDate.getDay()).length)
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
                        <Text style={{color:'#042C5C', fontSize:20, marginBottom:20}}>{course.level+" / "+course.name + " Yoklama Listesi"}</Text>
                        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                            {
                                course._students.map(student=>{
                                    var firstNameArray=student._account.first_name.split(' ')
                                    let first_name=firstNameArray[0]
                                    if(firstNameArray.length>1){
                                        const newName=firstNameArray[0].length>firstNameArray[1].length?firstNameArray[0].charAt(0)+'. '+firstNameArray[1]:
                                            firstNameArray[0]+' '+firstNameArray[1].charAt(0)+'.'
                                        first_name=newName
                                    }
                                    const roll=students.findIndex(s=>s._account.id===student._account.id)>-1?true:false
                                    return (
                                        <View style={styles.studentView}>
                                            <TouchableOpacity style={{...styles.student,backgroundColor:roll!==false?'#e74c3c':'white', }} onPress={()=>{
                                                if(!roll){
                                                    
                                                    this.addStudent(student)
                                                }else{
                                                    this.removeStudent(student)
                                                }
                                            }}>
                                                <Image source={student._account.image===null?icons.User:{uri:student._account.image}} style={{width:'100%',flex:1}} resizeMode='contain'/>
                                                <View style={{width:'100%',height:30,justifyContent:'center',alignItems:'center'}}>
                                                    <Text style={{fontSize:12}}>{first_name+" "+student._account.last_name}</Text>
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
                    <View style={{}}>
                        <Text>Toplam Gelmeyen Sayısı : </Text>
                        <Text>Sınıf Mevcudu : {course._students.length}</Text>
                    </View>
                    <View style={{flex:1,alignItems:'flex-end'}}>
                        <TouchableOpacity style={{width:100,height:50,backgroundColor:'#2ecc71', alignItems:'center',justifyContent:'center'}} onPress={()=>{
                            this.setState({saving:true},()=>this.saveRollCall())
                        }}>
                            <Text style={{color:'white'}}>{this.state.students.length===0?'Sınıf Tam':'Kaydet'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        )
    }
}


const mapStateToProps = (state) => ({
    courses:state.Course.courses,

})

const mapDispatchToProps = {
    getRollCall,
    saveRollCall
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseRollCall)
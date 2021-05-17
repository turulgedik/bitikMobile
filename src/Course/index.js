import React, { Component } from 'react'
import {View,Text,TouchableOpacity,Image, ScrollView,FlatList, TextInput, Switch,KeyboardAvoidingView} from 'react-native'
import {styles} from './style'
import icons from '../Icons'
import { Actions, ActionConst} from 'react-native-router-flux'
import MyModal from '../components/MyModal'
import Alert from '../components/Alert'
import { connect } from 'react-redux'
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment'
import {addHomeWork,getHomeWork} from '../redux/actions/course'


export class Course extends Component {
    
    static onEnter(){
        Actions.refresh({key: Math.random()});
    }

    state={
        homeWork:'',
        last_date:Moment(new Date()).format('yyyy-MM-DD'),
        homeWorks:[]
    }

    constructor(props){
        super(props)

        this.getHomeWork()
    }

    componentDidUpdate(prevProps,prevState){
        if(prevProps.updateHomeWork!==this.props.updateHomeWork){
            alert(this.props.updateHomeWork)
        }
    }

    getHomeWork=()=>{
        
        this.props.getHomeWork(this.props.id,(data)=>{
            this.setState({homeWorks:data})
        })
        
    }

    message=(title,message)=>{
        this._alert.setTitle(title)
        this._alert.setMessage(message)
        this._alert.setConfirmText('Tamam')
        this._alert.show()
    }

    createHomeWork=()=>{

        const {last_date,homeWork}=this.state

        const data={
            homeWork:homeWork,
            last_date:last_date,
            type:0,
            _course:this.props.id
        }

        this.props.addHomeWork(data,(req)=>{
            if(!req){
                this.message('Hata!',"Ödev Oluşturulken Hata Oluştu. Boş Alan Bırakmayınız!")

            }else
            {
                this.setState({homeWorks:[...this.state.homeWorks,req.homeWork]})
                this._homeWork.onClose()
                this.setState({homeWork:''})
            }
        })
    }

    render() {
        
        const {courses,id}=this.props
        const course=courses.find(c=>c.id===id)

        return (
            course===undefined?<View/>:
            <ScrollView>
                <MyModal ref={node=>(this._homeWork=node)}>
                    <View style={styles.showMedia}>
                        <MyModal ref={node=>(this._datePicker=node)}>
                            <View style={styles.showMedia}>
                                <View style={{height:50,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                                    <Text style={{fontSize:20,flex:1}}>Tarih Seçin</Text>
                                </View>
                                <View style={{width:'100%'}}>
                                    <DateTimePicker style={{width:'100%',}} value={new Date(this.state.last_date)} mode='date' display='default' locale='tr' onChange={(event,date)=>{
                                        this.setState({last_date:Moment(date).format('yyyy-MM-DD')})
                                    }}/>
                                </View>
                            </View>
                        </MyModal>
                        <View style={{width:'100%'}}>
                            <Text style={{fontSize:25}}>Yeni Ödev</Text>
                        </View>
                        <View style={{width:'100%',marginVertical:10}}>
                            <Text style={{fontSize:20,marginBottom:10}}>Ödev Metni</Text>
                            <TextInput value={this.state.homeWork} multiline={true} placeholder='Bir Şeyler Yaz..' style={{width:'100%',height:200, borderColor:'#1e1e1e',borderWidth:1}} onChangeText={(text)=>
                                this.setState({homeWork:text})
                            }/>
                        </View>
                        <View style={{width:'100%'}}>
                            <Text style={{fontSize:20,marginBottom:10}}>Bitiş Tarihi</Text>
                            <TouchableOpacity style={{alignItems:'center',justifyContent:'center', flexDirection:'row', marginBottom:20}} onPress={()=>{
                                this._datePicker.onShow()
                            }}>
                                <View style={styles.dateTextView}>
                                    <Text>{Moment(this.state.last_date).format('YYYY')}</Text>
                                </View>
                                <View style={styles.dateTextView}>
                                    <Text>{Moment(this.state.last_date).format('MM')}</Text>
                                </View>
                                <View style={{...styles.dateTextView,marginRight:0}}>
                                    <Text>{Moment(this.state.last_date).format('DD')}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{width:'100%',height:50,alignItems:'center',justifyContent:'center',backgroundColor:'#2ecc71', }} onPress={()=>{
                            this.createHomeWork()
                        }}>
                            <Text style={{color:'white'}}>Oluştur</Text>
                        </TouchableOpacity>
                    </View>
                </MyModal>
                <View style={styles.title}>
                    <TouchableOpacity style={{height:'100%',width:50}} onPress={()=>{
                        Actions.pop()
                    }}>
                        <Image source={icons.Back} style={{height:'100%',width:'100%', tintColor:'#0A7ADD'}} resizeMode='contain'/>
                    </TouchableOpacity>
                    <View style={{flex:1,marginRight:-50,alignItems:'center',justifyContent:'center'}}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <Image source={icons.Users} style={{height:35,width:35}} resizeMode='contain'/>
                            <Text style={{fontSize:20}}>{course._students.length}</Text>
                        </View>
                    </View>
                    <View style={{width:100}}>
                        
                    </View>
                </View>
                <Text style={{fontSize:20,color:'#042C5C', marginBottom:20}}>{course.level+' - '+course.name}</Text>    
                <View style={{marginBottom:20,flexDirection:'row',flexWrap:'wrap',marginBottom:20}}>
                    <View style={{width:'50%',height:200,alignItems:'center',justifyContent:'center'}}>
                        <TouchableOpacity onPress={()=>{
                            Actions.courseRollCall({id:id})
                        }}>
                            <View style={{...styles.actionButtons,backgroundColor:'#25BDAE'}}>
                                <Image source={icons.IconCrosshair} style={{width:50,height:50,tintColor:'white'}} resizeMode='contain'/>
                            </View>
                            <View style={{alignItems:'center',justifyContent:'center',height:50}}>
                                <Text>Yoklama</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:'50%',height:200,alignItems:'center',justifyContent:'center'}}>
                        <TouchableOpacity onPress={()=>{
                            this._homeWork.onShow()
                        }}>
                            <View style={{...styles.actionButtons,backgroundColor:'#ED4C67'}}>
                                <Image source={icons.HomeWork} style={{width:50,height:50,tintColor:'white'}} resizeMode='contain'/>
                            </View>
                            <View style={{alignItems:'center',justifyContent:'center',height:50}}>
                                <Text>Ödev</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{fontSize:20,color:'#042C5C', marginBottom:20}}>Ödevler</Text>
                <FlatList style={{marginBottom:20,width:'100%'}}  data={this.state.homeWorks} renderItem={({item,index})=>{
                    return(
                        <TouchableOpacity style={{width:'100%',borderBottomWidth:5,borderBottomColor:'#34495e'}} onPress={()=>{
                            Actions.courseHomeWork({item:item,course:course})
                        }}>
                            <View style={{width:'100%',height:100,padding:10,flexDirection:'row',alignItems:'center'}}>
                                <View style={{height:50,width:50,alignItems:'center',justifyContent:'center',marginRight:5}}>
                                    <Image source={icons.HomeWork} style={{width:40,height:40}} resizeMode='contain'/>
                                </View>
                                <View style={{flex:1}}>
                                    <Text>{(item.homeWork.length>100)?item.homeWork.substring(0,75)+'...':item.homeWork}</Text>
                                </View>
                            </View>
                            <View style={{width:'100%',padding:10,flexDirection:'row',alignItems:'center'}}>
                                <Text style={{flex:1.5}}>Bitiş Tarihi : {item.last_date}</Text>
                                <Text style={{flex:1,textAlign:'center'}}>Yapan : {item.whoDo.length}</Text>
                                <Text style={{flex:1,textAlign:'center'}}>Gören : {item.wasSeen.length}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}>

                </FlatList>
            </ScrollView>
        )
    }
}


const mapStateToProps = (state) => ({
    courses:state.Course.courses,

})

const mapDispatchToProps = {
    addHomeWork,
    getHomeWork
}

export default connect(mapStateToProps, mapDispatchToProps)(Course)
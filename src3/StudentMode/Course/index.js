import React, { Component } from 'react'
import {View,Text,TouchableOpacity,Image, ScrollView,FlatList, TextInput, Switch,KeyboardAvoidingView} from 'react-native'
import {styles} from './style'
import icons from '../../Icons'
import { Actions, ActionConst} from 'react-native-router-flux'
import MyModal from '../../components/MyModal'
import Alert from '../../components/Alert'
import { connect } from 'react-redux'
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment'
import {addHomeWork,getHomeWork} from '../../redux/actions/course'


export class sCourse extends Component {
    
    state={
        homeWork:'',
        last_date:Moment(new Date()).format('yyyy-MM-DD'),
        homeWorks:[],
        selectedHomeWork:null
    }

    constructor(props){
        super(props)

        this.getHomeWork()
    }

    getHomeWork=()=>{
        
        this.props.getHomeWork(this.props.id,(data)=>{
            this.setState({homeWorks:data})
        })
        
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
        
        const {courses,id}=this.props
        const course=courses.find(c=>c.id===id)
        const {selectedHomeWork}=this.state

        return (
            course===undefined?<View/>:
            <ScrollView>
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
                <View style={styles.title}>
                    <TouchableOpacity style={{height:'100%',width:50}} onPress={()=>{
                        Actions.pop()
                    }}>
                        <Image source={icons.Back} style={{height:'100%',width:'100%', tintColor:'#0A7ADD'}} resizeMode='contain'/>
                    </TouchableOpacity>
                    
                </View>
                <Text style={{fontSize:20,color:'#042C5C', marginBottom:20}}>{course.level+' - '+course.name}</Text>    
                <View style={{marginBottom:20,flexDirection:'row',flexWrap:'wrap',marginBottom:20}}>
                    <View style={{width:'50%',height:200,alignItems:'center',justifyContent:'center'}}>
                        <TouchableOpacity onPress={()=>{
                            Actions.sCourseRollCall({id:id})
                        }}>
                            <View style={{...styles.actionButtons,backgroundColor:'#25BDAE'}}>
                                <Image source={icons.IconCrosshair} style={{width:50,height:50,tintColor:'white'}} resizeMode='contain'/>
                            </View>
                            <View style={{alignItems:'center',justifyContent:'center',height:50}}>
                                <Text>Yoklama</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
                <Text style={{fontSize:20,color:'#042C5C', marginBottom:20}}>Ödevler</Text>
                <FlatList style={{marginBottom:20,width:'100%'}}  data={this.state.homeWorks} renderItem={({item,index})=>{
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
                }}>

                </FlatList>
            </ScrollView>
        )
    }
}


const mapStateToProps = (state) => ({
    courses:state.Course.courses,
    user:state.User.user,

})

const mapDispatchToProps = {
    addHomeWork,
    getHomeWork
}

export default connect(mapStateToProps, mapDispatchToProps)(sCourse)
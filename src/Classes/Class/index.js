import React, { Component } from 'react'
import { connect } from 'react-redux'
import {View,Text,TouchableOpacity,Image, ScrollView,FlatList, TextInput, Switch,KeyboardAvoidingView} from 'react-native'
import {styles,windowWidth} from './style'
import icons from '../../Icons'
import { Actions } from 'react-native-router-flux'
import {lock,unLock,sendImage,notify,question} from '../../redux/actions/socket'
import MyModal from '../../components/MyModal'
import Alert from '../../components/Alert'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Video } from 'expo-av';
import Moment from 'moment'
import DateTimePicker from '@react-native-community/datetimepicker';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import {addHomeWork,getHomeWorks} from '../../redux/actions/homework'
import {addNotification} from '../../redux/actions/notifications'

const ImageType=ImagePicker.MediaTypeOptions.Images
const VideoType=ImagePicker.MediaTypeOptions.Videos

export class _Class extends Component {

    state={
        media:null,
        mediaType:ImageType,
        message:'',
        question:'',
        answers:[
            {
                text:'Cevap 1',
                state:false
            },
            {
                text:'Cevap 2',
                state:false
            },
            {
                text:'Cevap 3',
                state:false
            },
        ],
        answerText:'',
        trueAnswer:false,
        homeWork:'',
        notification:'',
        last_date:Moment(new Date()).format('yyyy-MM-DD'),
    }

    componentDidMount(){
        this.props.getHomeWorks()
        /*
        (async () => {
            if (Platform.OS !== 'web') {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
              }
            }
        })();
        */
    }

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: this.state.mediaType,
          allowsEditing: false,
          aspect: [4, 3],
          quality: 1,
          //base64: true,
        });
        if (!result.cancelled) {
            let localUri = result.uri;
            let filename = localUri.split('/').pop();
            result.name=filename
            if(this.state.mediaType===VideoType){
                const base64string = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });
                console.log('base64',base64string)
                //result.base64 = base64string;
            }
           this.setState({media:result},()=>this._showMedia.onShow())
        }
    };

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
            _class:this.props.id
        }

        this.props.addHomeWork(data,(req)=>{
            if(!req){
                this.message('Hata!',"Ödev Oluşturulken Hata Oluştu. Boş Alan Bırakmayınız!")

            }else
            {
                this._homeWork.onClose()
                this.setState({homeWork:''})
            }
        })
    }

    createNotify=()=>{

        const {notification}=this.state

        const data={
            notification:notification,
            type:0,
            notiType:0,
            _class:this.props.id
        }

        this.props.addNotification(data,(req)=>{
            if(!req){
                this._alert.setTitle("Hata!")
                this._alert.setMessage("Duyuru Oluşturulken Hata Oluştu. Boş Alan Bırakmayınız!")
                this._alert.setConfirmText('Tamam')
                this._alert.show()
            }else
                {
                    this._newNotifyAll.onClose()
                    this.setState({notification:''})
                }
        })
    }

    render() {

        const {id,classes,students,connecteds,app,homeWork}=this.props
        const filterHomeWorks=homeWork.filter(h=>h._class._account===id)
        const sortHomeWorks=filterHomeWorks.sort((a,b)=>new Date(b.dateTime)-new Date(a.dateTime))

        const _class=classes.find(c=>c._account===id)
        const con=connecteds!==undefined?connecteds.find(elem=>elem.id===_class._account):null
        console.log("app",classes)
        return (
            <ScrollView style={[styles.background,{marginTop:ifIphoneX(20,0)}]}>
                {
                    app.loading?
                    <MyModal show={true} closeButton={false}>
                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                            <Text>Lütfen Bekleyiniz...</Text>
                        </View>
                    </MyModal>
                    :null
                }
                <MyModal ref={nodex=>(this._newNotifyAll=nodex)}>
                    <View style={styles.showMedia}>
                        <View style={{width:'100%',height:50,justifyContent:'center'}}>
                            <Text style={{fontSize:20,fontWeight:'bold'}}>Yeni Duyuru</Text>
                        </View>
                        <View style={{marginBottom:10,width:'100%',}}>
                            <Text style={{fontSize:20,marginBottom:10}}>Duyuru Metni</Text>
                            <TextInput value={this.state.notification} multiline={true} placeholder='Bir Şeyler Yaz..' style={{width:'100%',height:150, borderColor:'#1e1e1e',borderWidth:1}} onChangeText={(text)=>
                                this.setState({notification:text})
                            }/>
                        </View>
                        

                        <TouchableOpacity style={{width:'100%',height:50,alignItems:'center',justifyContent:'center',backgroundColor:'#2ecc71', }} onPress={()=>{
                            this.createNotify()
                        }}>
                            <Text style={{color:'white'}}>Oluştur</Text>
                        </TouchableOpacity>
                    </View>
                </MyModal>
                <MyModal ref={node=>(this._showMedia=node)}>
                    {this.state.media!==null?
                        <View>
                            <View style={styles.showMedia}>
                                {
                                    this.state.mediaType===ImageType?
                                    <Image source={{ uri: this.state.media.uri }} style={{ width: '100%', height: 200 }} resizeMode='contain'/>
                                    :
                                    <Video
                                        source={{ uri: this.state.media.uri }}
                                        rate={1.0}
                                        volume={1.0}
                                        isMuted={false}
                                        resizeMode="cover"
                                        shouldPlay
                                        isLooping
                                        style={{ width: '100%', height: 200 }}
                                    />
                                }
                                
                            </View>
                            <TouchableOpacity style={{width:'100%',height:50,alignItems:'center',justifyContent:'center',backgroundColor:'#2ecc71', marginTop:20}} onPress={()=>{
                                this.props.sendImage(id,this.state.media,()=>{
                                    this.message('Başarılı!','Dosya Başarıyla Gönderildi!')
                                },(err)=>{
                                    this.message('Hata!','Dosya Yüklenirken Hata Oluştu. Lütfen Tekrar Deneyiniz.')
                                })
                                this._showMedia.onClose()
                            }}>
                                <Text style={{color:'white'}}>Gönder</Text>
                            </TouchableOpacity>
                        </View>:null
                    }
                </MyModal>
                <MyModal ref={node=>(this._notify=node)}>
                    <View>
                        <View style={[styles.showMedia,{minHeight:300}]}>
                            <Text style={{fontSize:20,marginBottom:20}}>Metin Girin</Text>
                            <TextInput value={this.state.message} placeholder='Bir Şeyler Yaz..' multiline={true} style={{width:'100%',flex:1, borderColor:'#1e1e1e',borderWidth:1}} onChangeText={(text)=>
                                this.setState({message:text})
                            }/>
                        </View>
                        <TouchableOpacity style={{width:'100%',height:50,alignItems:'center',justifyContent:'center',backgroundColor:'#2ecc71', marginTop:20}} onPress={()=>{
                            this.props.notify(id,this.state.message)
                        }}>
                            <Text style={{color:'white'}}>Gönder</Text>
                        </TouchableOpacity>
                    </View>
                </MyModal>
                <MyModal ref={node=>(this._question=node)}>
                    <MyModal ref={node=>(this._addAnswer=node)}>
                        <View>
                            <View style={styles.showMedia}>
                                <Text style={{fontSize:20,marginBottom:20}}>Cevap Ekle</Text>
                                <View style={{width:'100%', flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                                    <TextInput value={this.state.answerText} placeholder='Bir Şeyler Yaz..' placeholderTextColor='#1e1e1e' style={{flex:1,height:50, borderColor:'#1e1e1e',borderWidth:1}} onChangeText={(text)=>
                                        this.setState({answerText:text})
                                    }/>
                                    <View style={{marginLeft:10,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                                        <Text>Y</Text>
                                        <Switch value={this.state.trueAnswer} onValueChange={(e)=>{
                                            this.setState({trueAnswer:e})
                                        }}/>
                                        <Text>D</Text>
                                    </View>
                                </View>
                                
                            </View>
                            <TouchableOpacity style={{width:'100%',height:50,alignItems:'center',justifyContent:'center',backgroundColor:'#2ecc71'}} onPress={()=>{
                                const {answerText,trueAnswer}=this.state
                                this.setState({answers:[...this.state.answers,{text:answerText,state:trueAnswer}],answerText:'',trueAnswer:false},()=>{
                                    this._addAnswer.onClose()
                                })
                            }}>
                                <Text style={{color:'white'}}>Ekle</Text>
                            </TouchableOpacity>
                        </View>
                    </MyModal>
                    <View>
                        <View style={styles.showMedia}>
                            <Text style={{fontSize:20,marginBottom:20}}>Soru Girin</Text>
                            <TextInput value={this.state.question} placeholder='Bir Şeyler Yaz..' style={{width:'100%',height:50, borderColor:'#1e1e1e',borderWidth:1}} onChangeText={(text)=>
                                this.setState({question:text})
                            }/>
                            <View style={{marginTop:20,width:'100%', flexDirection:'row',alignItems:'center'}}>
                                <Text style={{fontSize:20,flex:1}}>Cevaplar</Text>
                                <TouchableOpacity style={{width:50,height:50,alignItems:'center',justifyContent:'center'}} onPress={()=>{
                                    this._addAnswer.onShow()
                                }}>
                                    <Image source={icons.New} style={{width:30,height:30}} resizeMode='contain'/>
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                        <View style={{width:'100%', flex:1}}>
                            {this.state.answers.length>0?
                                <FlatList style={{flex:1}} renderItem={({item,index})=>(
                                    <View style={{width:'100%',height:50,marginBottom:5,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                                        <Text style={{flex:1}}>{item.text}</Text>
                                        <TouchableOpacity style={{width:50,height:50,alignItems:'center',justifyContent:'center', backgroundColor:'#e74c3c'}} onPress={()=>{
                                            let copy=this.state.answers
                                            copy.splice(index,1)
                                            this.setState({answers:copy})
                                        }}>
                                            <Text style={{color:'white'}}>Sil</Text>
                                        </TouchableOpacity>
                                    </View>
                                )} data={this.state.answers}/>:null
                            }
                        </View>
                        <TouchableOpacity style={{width:'100%',height:50,alignItems:'center',justifyContent:'center',backgroundColor:'#2ecc71', marginTop:20}} onPress={()=>{
                            this.props.question(id,{question:this.state.question,answers:this.state.answers})
                        }}>
                            <Text style={{color:'white'}}>Gönder</Text>
                        </TouchableOpacity>
                    </View>
                </MyModal>
                
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
                <Alert ref={node=>(this._alert=node)} />
                <View style={styles.title}>
                    <TouchableOpacity style={{height:'100%',width:50}} onPress={()=>{
                        Actions.pop()
                    }}>
                        <Image source={icons.Back} style={{height:'100%',width:'100%', tintColor:'#0A7ADD'}} resizeMode='contain'/>
                    </TouchableOpacity>
                    <View style={{flex:1,marginRight:-50,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{color:'#042C5C',fontSize:25}}>{_class.level + " / "+_class.name}</Text>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <Image source={icons.Users} style={{height:20,width:20}} resizeMode='contain'/>
                            <Text style={{fontSize:20}}>{students.filter(s=>s._class!==null&&s._class===id).length}</Text>
                        </View>
                    </View>
                    <View style={{...styles.profileButton,backgroundColor:con!==null && con!==undefined?"#2ecc71":"#e74c3c"}}>
                        <Text style={{color:'white'}}>Tahta {con!==null && con!==undefined?"Açık":"Kapalı"}</Text>
                    </View>
                </View>

                <View style={{marginBottom:20,flexDirection:'row',flexWrap:'wrap'}}>
                    {
                        con!==null && con!==undefined?
                        <View style={{width:'50%',height:200,alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress={()=>{
                                if(con!==null && con!==undefined)
                                    this.props.lock(id,false)
                                else{
                                    this._alert.setMessage('Bilgisayar Kapalı!')
                                    this._alert.setTitle('HATA!')
                                    this._alert.setConfirmText('Tamam')
                                    this._alert.show();
                                }
                            }}>
                                <View style={{...styles.actionButtons,backgroundColor:'#2ecc71'}}>
                                    <Image source={icons.Unlock} style={{width:50,height:50,tintColor:'white'}} resizeMode='contain'/>
                                </View>
                                <View style={{alignItems:'center',justifyContent:'center',height:50}}>
                                    <Text>Kilit Aç</Text>
                                </View>
                            </TouchableOpacity>
                        </View>:null
                    }
                    {
                        con!==null && con!==undefined?
                        <View style={{width:'50%',height:200,alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress={()=>{
                                if(con!==null && con!==undefined)
                                    this.props.lock(id,true)
                                else{
                                    this._alert.setMessage('Bilgisayar Kapalı!')
                                    this._alert.setTitle('HATA!')
                                    this._alert.setConfirmText('Tamam')
                                    this._alert.show();
                                }
                            }}>
                                <View style={{...styles.actionButtons,backgroundColor:'#e74c3c'}}>
                                    <Image source={icons.Lock} style={{width:50,height:50,tintColor:'white'}} resizeMode='contain'/>
                                </View>
                                <View style={{alignItems:'center',justifyContent:'center',height:50}}>
                                    <Text>Kilit Kapat</Text>
                                </View>
                            </TouchableOpacity>
                        </View>:null
                    }
                    <View style={{width:'50%',height:200,alignItems:'center',justifyContent:'center'}}>
                        <TouchableOpacity onPress={()=>{
                            Actions.rollCall({id:id})
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
                    <View style={{width:'50%',height:200,alignItems:'center',justifyContent:'center'}}>
                        <TouchableOpacity onPress={()=>{
                            this._newNotifyAll.onShow()
                        }}>
                            <View style={{...styles.actionButtons,backgroundColor:'#ffb142'}}>
                                <Image source={icons.Notification} style={{width:50,height:50,tintColor:'white'}} resizeMode='contain'/>
                            </View>
                            <View style={{alignItems:'center',justifyContent:'center',height:50}}>
                                <Text>Genel Duyuru</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {
                        /*
                        con!==null && con!==undefined?
                        <View style={{width:'50%',height:200,alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress={()=>{
                                this.setState({mediaType:ImageType},()=>{
                                    this.pickImage();
                                })
                            }}>
                                <View style={{...styles.actionButtons,backgroundColor:'#f1c40f'}}>
                                    <Image source={icons.Image} style={{width:50,height:50,tintColor:'white'}} resizeMode='contain'/>
                                </View>
                                <View style={{alignItems:'center',justifyContent:'center',height:50}}>
                                    <Text>Fotoğraf</Text>
                                </View>
                            </TouchableOpacity>
                        </View>:null
                        */
                    }
                    {
                        /*
                        con!==null && con!==undefined?
                        <View style={{width:'50%',height:200,alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress={()=>{
                                this.setState({mediaType:VideoType},()=>{
                                    this.pickImage();
                                })
                            }}>
                                <View style={{...styles.actionButtons,backgroundColor:'#9b59b6'}}>
                                    <Image source={icons.Video} style={{width:50,height:50,tintColor:'white'}} resizeMode='contain'/>
                                </View>
                                <View style={{alignItems:'center',justifyContent:'center',height:50}}>
                                    <Text>Video</Text>
                                </View>
                            </TouchableOpacity>
                        </View>:null
                        */
                    }
                    {
                        con!==null && con!==undefined?
                        <View style={{width:'50%',height:200,alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress={()=>{
                                this._notify.onShow()
                            }}>
                                <View style={{...styles.actionButtons,backgroundColor:'#34495e'}}>
                                    <Image source={icons.Megaphone} style={{width:50,height:50,tintColor:'white'}} resizeMode='contain'/>
                                </View>
                                <View style={{alignItems:'center',justifyContent:'center',height:50}}>
                                    <Text>Duyuru</Text>
                                </View>
                            </TouchableOpacity>
                        </View>:null
                    }
                    {
                        con!==null && con!==undefined?
                        <View style={{width:'50%',height:200,alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress={()=>{
                                this._question.onShow();
                            }}>
                                <View style={{...styles.actionButtons,backgroundColor:'#3498db'}}>
                                    <Image source={icons.Question} style={{width:50,height:50,tintColor:'white'}} resizeMode='contain'/>
                                </View>
                                <View style={{alignItems:'center',justifyContent:'center',height:50}}>
                                    <Text>Soru</Text>
                                </View>
                            </TouchableOpacity>
                        </View>:null
                    }
                    
                </View>

                <Text style={{fontSize:30,color:'#042C5C', marginBottom:20}}>Raporlar</Text>
                <FlatList style={{marginBottom:20}} contentContainerStyle={{justifyContent:'center',flexDirection:'row',flexWrap:'wrap'}} data={[
                    {name:'Yoklama', icon:icons.RollCallReport, touch:()=>{Actions.rollCallReport({id:id})}},
                    {name:'A.T. Kullanımı', icon:icons.ATReport, touch:()=>{Actions.atReports({id:id})}},
                ]} renderItem={({item,index})=>{
                    return(
                        <TouchableOpacity style={styles.myApps} onPress={()=>{
                            {item.touch()}
                        }}>
                            <View style={{flex:1, justifyContent:'center',paddingHorizontal:10,alignItems:'center'}}>
                                <Image source={item.icon} style={{width:'50%',height:'50%'}} resizeMode='contain'/>
                            </View>
                            <View style={{flex:0.5,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{color:'#0078E2'}}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}>

                </FlatList>

                <Text style={{fontSize:30,color:'#042C5C', marginBottom:20}}>Ödevler</Text>
                <FlatList style={{marginBottom:20,width:'100%'}}  data={sortHomeWorks} renderItem={({item,index})=>{
                    return(
                        <TouchableOpacity style={{width:'100%',borderBottomWidth:5,borderBottomColor:'#34495e'}} onPress={()=>{
                            Actions.homeWork({id:item.id})
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
    classes:state.School.school.classes,
    students:state.School.school.students,
    connecteds:state.Socket.connecteds,
    app:state.App,
    homeWork:state.HomeWork.homeworks,
})

const mapDispatchToProps = {
    lock,
    unLock,
    sendImage,
    notify,
    question,
    addHomeWork,
    getHomeWorks,
    addNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(_Class)

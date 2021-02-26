import React, { Component } from 'react'
import { connect } from 'react-redux'
import {View,Text,TouchableOpacity,Image, ScrollView,FlatList, TextInput, Switch} from 'react-native'
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
    }

    componentDidMount(){
        (async () => {
            if (Platform.OS !== 'web') {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
              }
            }
        })();
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

    render() {

        const {id,classes,students,connecteds,app}=this.props

        const _class=classes.find(c=>c._account.id===id)
        const con=connecteds!==undefined?connecteds.find(elem=>elem.id===_class._account.id):null
        console.log("app",students)
        return (
            <ScrollView style={styles.background}>
                {
                    app.loading?
                    <MyModal show={true} closeButton={false}>
                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                            <Text>Lütfen Bekleyiniz...</Text>
                        </View>
                    </MyModal>
                    :null
                }
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
                <Alert ref={node=>(this._alert=node)} />
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
                            <Text style={{fontSize:15}}>{students.filter(s=>s._class!==null&&s._class._account.id===id).length}</Text>
                        </View>
                    </View>
                    <View style={{...styles.profileButton,backgroundColor:con!==null && con!==undefined?"#2ecc71":"#e74c3c"}}>
                        <Text style={{color:'white'}}>{con!==null && con!==undefined?"Açık":"Kapalı"}</Text>
                    </View>
                </View>

                <Text style={{fontSize:30,color:'#042C5C',marginBottom:20}}>Genel</Text>

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
                    {
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
                    }
                    {
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
                    {name:'Yoklama', icon:icons.Check, touch:()=>{Actions.rollCallReport({id:id})}},
                    {name:'A.T. Kullanımı', icon:icons.Check, touch:()=>{Actions.atReports({id:id})}},
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

            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => ({
    classes:state.School.school.classes,
    students:state.School.school.students,
    connecteds:state.Socket.connecteds,
    app:state.App,
})

const mapDispatchToProps = {
    lock,
    unLock,
    sendImage,
    notify,
    question
}

export default connect(mapStateToProps, mapDispatchToProps)(_Class)

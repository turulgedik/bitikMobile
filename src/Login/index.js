import React, { Component } from 'react'
import { connect } from 'react-redux'
import {View,Text,TouchableOpacity,Image} from 'react-native'
import {styles} from './style'
import { StatusBar } from 'expo-status-bar';
import icons from '../Icons'
import CustomTextInput from '../components/TextInput'
import {login,test} from '../redux/actions/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';


class Login extends Component {

    state={
        username:'',
        password:'',
        eye:true,
    }

    loginUser=()=>{
        this.props.login(this.state.username,this.state.password)
    } 

    getToken = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('token')
            return jsonValue != null ? jsonValue : null;
        } catch (err) {
          console.log(err);
        }
    };

    render() {
        console.log('user',this.props.user)
        return (
            <View style={styles.background}>
                
                <View style={styles.topView}>
                    <View style={{width:'80%',height:'50%',borderWidth:5,borderColor:'#34495e',backgroundColor:'white'}}>
                        <Image source={icons.Logo} style={{width:'100%',height:'100%'}} resizeMode='contain'/>
                    </View>
                </View>
                <View style={styles.centerView}>
                    <View style={{height:75,width:'80%',alignItems:'center',justifyContent:'center',}}>
                        <CustomTextInput color={"white"} left={
                            <Image source={icons.User} style={{marginHorizontal:5,width:22,height:22, }} resizeMode='contain' />
                            } 
                            settings={{value:this.state.username, placeholder:'Kullanıcı Adı', onChangeText:(text)=>{
                                this.setState({username:text})
                        }}} style={styles.textInput} selectedStyle={styles.textInputSelected}/> 
                    </View>
                    <View style={{height:75,width:'80%',alignItems:'center',justifyContent:'center'}}>
                        <CustomTextInput left={
                                <Image source={icons.Password} style={{marginHorizontal:5,width:22,height:22, }} resizeMode='contain' />
                            } style={styles.textInput} selectedStyle={styles.textInputSelected} right={
                            <TouchableOpacity onPress={()=>{
                                const eye=this.state.eye
                                this.setState({eye:!eye})
                            }}>
                                <Image source={icons.Eye} style={{marginHorizontal:5,width:22,height:22, }} resizeMode='contain' />
                            </TouchableOpacity>

                            } settings={{value:this.state.password, placeholder:'Şifre', secureTextEntry:this.state.eye, onChangeText:(text)=>{
                            this.setState({password:text})
                        }}}/>
                    </View>
                    <View style={{height:50,width:'80%',alignItems:'flex-end',justifyContent:'center'}}>
                        <TouchableOpacity>
                            <Text style={{color:'white'}}>Şifremi Unuttum</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.bottomView}>
                    <View style={{height:50,width:'80%',alignItems:'center',justifyContent:'center'}}>
                        <TouchableOpacity style={styles.loginButton} onPress={()=>{
                            this.loginUser()
                        }}>
                            <Text style={{color:'white', fontSize:20, fontWeight:'bold'}}>Giriş Yap</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <StatusBar hidden={true}/>
            </View>
        )
    }
}


const mapStateToProps = (state) => ({
    user:state.User
})

const mapDispatchToProps = {
    login,test
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

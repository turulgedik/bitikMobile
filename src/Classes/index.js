import React, { Component } from 'react'
import { connect } from 'react-redux'
import {View,Text,TouchableOpacity,Image, ScrollView} from 'react-native'
import {styles} from './style'
import icons from '../Icons'
import {Actions} from 'react-native-router-flux'

export class Classes extends Component {
    render() {
        const {level,classes,students,connecteds} = this.props
        console.log('classes',students)
        const classesItems=classes.filter(c=>c.level===level).map((elem,i)=>{
            const con=connecteds!==undefined?connecteds.find(element=>element.id===elem._account.id):null
            return(
                <TouchableOpacity style={styles.groupItem} onPress={()=>{
                    Actions._class({id:elem._account.id})
                }}>
                    <View style={{flex:1,height:'100%',marginRight:5}}>
                        <Image source={icons.ClassRoom} style={{height:'100%',width:'100%'}} resizeMode='center'/>
                    </View>
                    <View style={{alignItems:'center',justifyContent:'center',height:'100%',marginRight:5}}>
                        <Text style={{fontSize:20}}>{elem.level+" / "+elem.name}</Text>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <Image source={icons.Users} style={{height:30,width:30,marginTop:10}} resizeMode='contain'/>
                            <Text style={{fontSize:15}}>{students.filter(s=>s._class._account.id===elem._account.id).length}</Text>
                        </View>
                    </View>
                    <View style={{flex:0.7}}>
                        <View style={{width:'100%',height:30,backgroundColor:con!==null && con!==undefined?"#2ecc71":"#e74c3c",alignItems:'center',justifyContent:'center', borderRadius:15}}>
                            <Text style={{color:'white'}}>{con!==null && con!==undefined?"Açık":"Kapalı"}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        })

        return (
            <ScrollView style={styles.background}>
                <View style={styles.title}>
                    <TouchableOpacity style={{height:'100%',width:50}} onPress={()=>{
                        Actions.pop()
                    }}>
                        <Image source={icons.Back} style={{height:'100%',width:'100%', tintColor:'#0A7ADD'}} resizeMode='contain'/>
                    </TouchableOpacity>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{color:'#042C5C',fontSize:20}}>{level}. Sınıflar</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton}>
                        <Image source={icons.User} style={{width:25,height:25, tintColor:'white'}} resizeMode='contain'/>
                    </TouchableOpacity>
                </View>
                <View style={{marginBottom:20}}>
                    <Text style={{fontSize:30,color:'#77869E'}}>İşlem Yapacağınız</Text>
                    <Text style={{fontSize:30,color:'#042C5C'}}>Sınıf Seçin</Text>
                </View>

                <View style={{marginBottom:20,flexDirection:'row',flexWrap:'wrap'}}>
                    {classesItems}
                </View>

            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => ({
    classes:state.School.school.classes,
    students:state.School.school.students,
    connecteds:state.Socket.connecteds,
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Classes)

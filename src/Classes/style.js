import {StyleSheet, Dimensions} from 'react-native'
const windowWidth = Dimensions.get('window').width;
export const styles=StyleSheet.create({
    background:{
        width:'100%',
        height:'100%',
        padding:10
    },
    title:{
        height:50,
        width:'100%',
        flexDirection:'row',
        marginBottom:20
    },
    profileButton:{
        width:50,
        height:50,
        borderRadius:10,
        backgroundColor:'#0078E2',
        alignItems:'center',
        justifyContent:'center'
    },
    groupItem:{
        width:(windowWidth-40)/2,
        height:(windowWidth-40)/3,
        borderWidth:0.5,
        borderColor:'#1e1e1e',
        borderRadius:25,
        margin:5,
        flexDirection:'row',
        padding:5
    },
})
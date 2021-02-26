import {StyleSheet} from 'react-native'

export const styles=StyleSheet.create({
    background:{
        width:'100%',
        height:'100%',
        backgroundColor:'rgba(0,0,0,0.5)',
        alignItems:'center',
        justifyContent:'center'
    },
    contentView:{
        padding:20,
        backgroundColor:'white',
        minHeight:100,
        minWidth:100,
        maxWidth:'90%',
        maxHeight:'80%',
        borderRadius:25,
        overflow:'scroll'
    },
    closeButton:{
        backgroundColor:'#e74c3c',
        alignItems:'center',
        justifyContent:'center',
        width:100,
        height:50,
        borderRadius:25,
        marginTop:20
    }
})


import {StyleSheet, Dimensions} from 'react-native'
const windowWidth = Dimensions.get('window').width;
export const styles=StyleSheet.create({
    background:{
        width:'100%',
        flex:1,
    },
    navigator:{
        width:'100%',
        height:50,
        flexDirection:'row'
    },
    navigatorItem:{
        height:'100%',
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    navigatorSelectedItem:{
        height:'100%',
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        borderBottomColor:'#0A7ADD',
        borderBottomWidth:0.5
    }
})
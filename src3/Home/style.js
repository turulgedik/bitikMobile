import {StyleSheet, Dimensions} from 'react-native'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const styles=StyleSheet.create({
    background:{
        width:'100%',
        height:'100%',
    },
    notificationButton:{
        width:50,
        height:50,
        borderRadius:10,
        borderWidth:1,
        borderColor:'#F39200',
        alignItems:'center',
        justifyContent:'center'
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
        height:(windowWidth-40)/2,
        backgroundColor:'#1A85E5',
        borderRadius:25,
        margin:5
    },
    myApps:{
        width:(windowWidth-80)/2,
        height:(windowWidth-80)/2,
        borderColor:'#1e1e1e',
        borderWidth:0.5,
        borderRadius:25,
        margin:5
    },
    showMedia:{
        width:windowWidth*0.8,
        maxHeight:windowHeight*.8,
    },
})
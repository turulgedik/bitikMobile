import {StyleSheet, Dimensions} from 'react-native'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
        height:25,

    },
    studentView:{
        alignItems:'center',
        justifyContent:'center',
        width:'33.3%',
        height:windowWidth/3,
    },
    student:{
        width:'90%',
        height:'90%',
        padding:10,
        borderRadius:25,
        borderWidth:0.5,
        borderColor:'#1e1e1e',
        alignItems:'center',
        justifyContent:'center'
    },
    modal:{
        width:(windowWidth*0.8),
        maxHeight:windowHeight*0.8,
    },
    studyView:{
        width:'100%',
        height:50,
        borderWidth:0.5,
        borderColor:'#1e1e1e',
        marginBottom:10,
        justifyContent:'center'
    },
    studyViewSelected:{
        width:'100%',
        height:50,
        borderWidth:0.5,
        borderColor:'#2ecc71',
        marginBottom:10,
        justifyContent:'center'
    },
    dateTextView:{
        width:75,
        height:50,
        borderColor:'#042C5C',
        borderWidth:0.5,
        borderRadius:15,
        marginRight:10,
        alignItems:'center',
        justifyContent:'center'
    }
})
import io from 'socket.io-client/dist/socket.io';
import {CONNECTED_SOCKET,CONNECTING_SOCKET,CONNECT_CLASS,DISCONNECT_CLASS,UPDATE_CLASS, ALL_LOCK,ALL_UNLOCK,LOADING, LOADED} from '../actions/types'
import { SOCKET_URL, BASE_URL } from './host';
import axios from 'axios'
import {tokenConfig} from './school'

const connectionConfig = {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 100000,
    transports: ['websocket'], 
};
let socket=null
export const loginSocket=()=>(dispatch,getState)=>{

    dispatch({type:CONNECTING_SOCKET})

    const user=getState().User.user
    console.log('socketLogin',getState().User.user)
    socket=io(SOCKET_URL,connectionConfig)
    socket.on('connect',()=>{
        console.log('socket',user)
        socket.emit('login',{user:user})

    })

    socket.on('connected',(data)=>{
        console.log('connected',data)
        dispatch({type:CONNECTED_SOCKET,payload:data})
    })
    
    socket.on('joinClass',(data)=>{
        console.log('joinClass',data)
        dispatch({type:CONNECT_CLASS,payload:data})
    })

    socket.on('exit',(data)=>{
        console.log('exit',data.id)
        dispatch({type:DISCONNECT_CLASS,payload:data})
    })

    socket.on('update',(data)=>{
        console.log('update',data)
        dispatch({type:UPDATE_CLASS,payload:data})
    })

    socket.on('allLock',()=>{
        console.log('allLock')
        dispatch({type:ALL_LOCK,payload:null})
    })

    socket.on('allUnLock',()=>{
        console.log('allUnLock')
        dispatch({type:ALL_UNLOCK,payload:null})
    })
    
}

export const lock=(classID,lock=Boolean)=>(dispatch,getState)=>{
    dispatch({type:LOADING})

    var data={
        _class:classID,
        command:lock?'lock':'unlock',
        description:''
    }

    axios.post(BASE_URL+'/school/api/CommandHistory/',data,tokenConfig(getState))
    .then(res=>{
      dispatch({type:LOADED,})
      socket.emit(lock?'lock':'unLock',classID)
    })
    .catch(err=>{
      console.log(err)
    })
}
export const unLock=(classID)=>dispatch=>{
    socket.emit('unLock',classID)
}
export const allLock=()=>dispatch=>{
    socket.emit('allLock')
}
export const allUnLock=()=>dispatch=>{
    socket.emit('allUnLock')
}

export const notify=(classID,message)=>(dispatch,getState)=>{
    console.log('notify')
    
    addHistory(classID,classID===null?'allNotify':'privateNotify',message,tokenConfig(getState),(res)=>{
        if(classID===null)
            socket.emit('allNotify',message)
        else
            socket.emit('privateNotify',classID,message)
    },(err)=>console.log(err))
}

export const question=(classID,question)=>(dispatch,getState)=>{
    addHistory(classID,'question',question,tokenConfig(getState),(res)=>{
        socket.emit('question',classID,question)
    },()=>{},(err)=>console.log(err))
}

const addHistory=(classID,command,description,config,response=func(value),error=func(err))=>{
    console.log('data')

    var data={
        _class:classID,
        command:command,
        description:description
    }
    
    axios.post(BASE_URL+'/school/api/CommandHistory/',data,config)
    .then(res=>{
        console.log(res)
        response(res.data)
    })
    .catch(err=>{
        console.log(err)
        error(err)
    })
}

export const sendImage=(classID,file,response=func(),error=func())=>(dispatch,getState)=>{
    dispatch({type:LOADING})
    
    let data = new FormData();
    data.append("_file", file);
    data.append("receiver",classID)

    let config=tokenConfig(getState)
    config.headers['Content-Type']='multipart/form-data;'

    axios.post(BASE_URL+'/school/api/Upload/',data,config)
    .then(res=>{
        var json=res.data.upload
        console.log('sendMedia',{uri:json._file,type:file})
        addHistory(classID,'sendMedia',json._file,tokenConfig(getState),(res)=>{
            socket.emit('sendMedia',classID,{uri:json._file,type:file.type})
            response()
        },(err)=>{
            console.log(err)
        })
        dispatch({type:LOADED,})
    })
    .catch(err=>{
       dispatch({type:LOADED,})
       error(err)
    })
}
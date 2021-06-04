import axios from 'axios'
import { func } from 'prop-types'
import {NOTIFI_ADD,NOTIFI_LOADED,NOTIFI_LOADING,NOTIFI_REMOVE,NOTIFI_UPDATE} from '../actions/types'
import {tokenConfig} from './school'
import {BASE_URL} from './host'

export const getNotifications=()=>(dispatch,getState)=>{

    dispatch({type:NOTIFI_LOADING})

    axios.get(BASE_URL+'/school/api/Notification/',tokenConfig(getState))
    .then(res=>{
      console.log('noti',res.data)
      dispatch({
        type:NOTIFI_LOADED,
        payload:res.data
      })
    })
    .catch(err=>{
       console.log(err)
    })

}

export const addNotification=(data,request=func())=>(dispatch,getState)=>{

  axios.post(BASE_URL+'/school/api/Notification/',data,tokenConfig(getState))
  .then(res=>{
    dispatch({
      type:data.type===0?NOTIFI_ADD:NOTIFI_UPDATE,
      payload:res.data
    })
    request(true)
  })
  .catch(err=>{
    request(false)
  })
}

export const removeNotifi=(id,request=func())=>(dispatch,getState)=>{
  
    axios.delete(BASE_URL+'/school/api/Notification/'+id+'/',tokenConfig(getState))
    .then(res=>{
        console.log(res.data)
      dispatch({
        type:NOTIFI_REMOVE,
        payload:res.data
      })
      request(true)
    })
    .catch(err=>{
      console.log("res",err)
      request(err)
    })
  }

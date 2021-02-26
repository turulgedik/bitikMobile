import axios from 'axios'
import { func } from 'prop-types'
import {TEACHER_ADD,TEACHER_REMOVE,TEACHER_UPDATE} from '../actions/types'
import {tokenConfig} from './school'
import {BASE_URL} from './host'

export const create=(data,request=func())=>(dispatch,getState)=>{
    axios.post(BASE_URL+'/school/api/Teacher/',data,tokenConfig(getState))
    .then(res=>{
        console.log(res.data)
      dispatch({
        type:TEACHER_ADD,
        payload:res.data
      })
      request(true)
    })
    .catch(err=>{
      console.log("res",err)
      request(false)
    })
  }


  export const destroy=(id,request=func())=>(dispatch,getState)=>{
  
    axios.delete(BASE_URL+'/school/api/Teacher/'+id+'/',tokenConfig(getState))
    .then(res=>{
        console.log(res.data)
      dispatch({
        type:TEACHER_REMOVE,
        payload:res.data
      })
      request(true)
    })
    .catch(err=>{
      console.log("res",err)
      request(err)
    })
  }

  export const update=(id,data,request=func())=>(dispatch,getState)=>{  
    axios.put(BASE_URL+'/school/api/Teacher/'+id+'/',data,tokenConfig(getState))
    .then(res=>{
        console.log('studentUpdate',res.data)
      dispatch({
        type:TEACHER_UPDATE,
        payload:res.data
      })
      request(res.data)
    })
    .catch(err=>{
      console.log("res",err)
      request(false)
    })
  }
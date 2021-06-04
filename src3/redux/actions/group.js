import axios from 'axios'
import { func } from 'prop-types'
import {GROUP_ADD,GROUP_REMOVE, TIMETABLE_UPDATE} from '../actions/types'
import {tokenConfig} from './school'
import {BASE_URL} from './host'

export const createGroup=(class_id,text,request=func())=>(dispatch,getState)=>{
    const body=JSON.stringify({class:class_id,name:text})
  
    axios.post(BASE_URL+'/school/api/Group/',body,tokenConfig(getState))
    .then(res=>{
      dispatch({
        type:GROUP_ADD,
        payload:res.data
      })
      request(true)
    })
    .catch(err=>{
      console.log("res",err)
      request(err)
    })
  }


  export const deleteGroup=(id,request=func())=>(dispatch,getState)=>{
  
    axios.delete(BASE_URL+'/school/api/Group/'+id+'/',tokenConfig(getState))
    .then(res=>{
      dispatch({
        type:GROUP_REMOVE,
        payload:res.data
      })
      request(true)
    })
    .catch(err=>{
      console.log("res",err)
      request(err)
    })
  }

  export const updateTimeTable=(groupID,data,request=func())=>(dispatch,getState)=>{  
    axios.post(BASE_URL+'/school/api/TimeTable/',data,tokenConfig(getState))
    .then(res=>{
      dispatch({
        type:TIMETABLE_UPDATE,
        payload:res.data
      })
      request(true)
    })
    .catch(err=>{
      console.log("res",err)
      request(err)
    })
  }
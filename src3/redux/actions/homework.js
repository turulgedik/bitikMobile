import axios from 'axios'
import { func } from 'prop-types'
import {HOMEWORK_REMOVE,HOMEWORK_ADD,HOMEWORK_LOADING,HOMEWORK_LOADED, HOMEWORK_UPDATE} from '../actions/types'
import {tokenConfig} from './school'
import {BASE_URL} from './host'

export const getHomeWorks=()=>(dispatch,getState)=>{

    dispatch({type:HOMEWORK_LOADING})

    axios.get(BASE_URL+'/school/api/HomeWork/',tokenConfig(getState))
    .then(res=>{
      console.log(res.data)
      dispatch({
        type:HOMEWORK_LOADED,
        payload:res.data
      })
    })
    .catch(err=>{
       console.log(err)
    })

}

export const addHomeWork=(data,request=func())=>(dispatch,getState)=>{

  axios.post(BASE_URL+'/school/api/HomeWork/',data,tokenConfig(getState))
  .then(res=>{
    dispatch({
      type:data.type===0?HOMEWORK_ADD:HOMEWORK_UPDATE,
      payload:res.data
    })
    request(true)
  })
  .catch(err=>{
    request(false)
  })
}

export const removeRollCall=(id,request=func())=>(dispatch,getState)=>{
  
    axios.delete(BASE_URL+'/school/api/HomeWork/'+id+'/',tokenConfig(getState))
    .then(res=>{
        console.log(res.data)
      dispatch({
        type:HOMEWORK_REMOVE,
        payload:res.data
      })
      request(true)
    })
    .catch(err=>{
      console.log("res",err)
      request(err)
    })
  }

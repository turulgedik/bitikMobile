import axios from 'axios'
import { func } from 'prop-types'
import {REMOVE_ROLLCALL,LOADING_ROLLCALL,ADD_ROLLCALL,LOADED_ROLLCALL} from '../actions/types'
import {tokenConfig} from './school'
import {BASE_URL} from './host'

export const getRollCalls=()=>(dispatch,getState)=>{

    dispatch({type:LOADING_ROLLCALL})

    axios.get(BASE_URL+'/school/api/RollCall/',tokenConfig(getState))
    .then(res=>{
        console.log('test',res.data)
      dispatch({
        type:LOADED_ROLLCALL,
        payload:res.data
      })
    })
    .catch(err=>{
       console.log(err)
    })

}

export const addRollCall=(data,request=func())=>(dispatch,getState)=>{

  axios.post(BASE_URL+'/school/api/RollCall/',data,tokenConfig(getState))
  .then(res=>{
    dispatch({
      type:ADD_ROLLCALL,
      payload:res.data
    })
    request(true)
  })
  .catch(err=>{
    request(false)
  })
}

export const removeRollCall=(id,request=func())=>(dispatch,getState)=>{
  
    axios.delete(BASE_URL+'/school/api/RollCall/'+id+'/',tokenConfig(getState))
    .then(res=>{
        console.log(res.data)
      dispatch({
        type:REMOVE_ROLLCALL,
        payload:res.data
      })
      request(true)
    })
    .catch(err=>{
      console.log("res",err)
      request(err)
    })
  }

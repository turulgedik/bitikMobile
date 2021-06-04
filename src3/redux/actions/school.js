import axios from 'axios'
import { func } from 'prop-types'
import {SCHOOL_ERROR,SCHOOL_LOADED,SCHOOL_LOADING,CLASS_ADD,GROUP_ADD} from '../actions/types'
import {BASE_URL} from './host'

export const getSchool=()=>(dispatch,getState)=>{
    dispatch({type:SCHOOL_LOADING})

    axios.get(BASE_URL+'/school/api/School/',tokenConfig(getState))
    .then(res=>{
      dispatch({
        type:SCHOOL_LOADED,
        payload:res.data
      })
    })
    .catch(err=>{
       dispatch({
         type:SCHOOL_ERROR,
       })
    })

}

export const createClass=(account,_class,request=func())=>(dispatch,getState)=>{
  const body=JSON.stringify({_account:account,_class:_class})

  axios.post(BASE_URL+'/school/api/Class/',body,tokenConfig(getState))
  .then(res=>{
    dispatch({
      type:CLASS_ADD,
      payload:res.data
    })
    request(true)
  })
  .catch(err=>{
    request(false)
  })
}

export const updateToken=(token,request=func())=>(dispatch,getState)=>{
  const body=JSON.stringify({token:token})

  axios.post(BASE_URL+'/school/api/PushToken/',body,tokenConfig(getState))
  .then(res=>{
    request(true)
  })
  .catch(err=>{
    request(false)
  })
}

export const tokenConfig=getState=>{
  const token=getState().User.auth.token
  const config={
   headers:{
     'Content-Type':'application/json'
   }
 }

  if(token){
    config.headers['Authorization']=`Token ${token}`
  }

  return config
}
import axios from 'axios'
import {USER_LOADING,USER_LOADED,AUTH_ERROR,LOGIN_FAIL,LOGIN_SUCCESS,LOGOUT} from './types'
import {BASE_URL} from './host'

export const loadUser=(token)=>dispatch=>{
   dispatch({type:USER_LOADING})
   const config={
    headers:{
      'Content-Type':'application/json'
    }
  }

   if(token){
     config.headers['Authorization']=`Token ${token}`
   }

   axios.get(BASE_URL+'/api/user/',config)
   .then(res=>{
     const widthToken={user:{...res.data},token:token}
     dispatch({
       type:USER_LOADED,
       payload:widthToken
     })
   })
   .catch(err=>{
     console.log("Login Error",err);
      dispatch({
        type:AUTH_ERROR,
      })
   })

}

export const login=(u,p)=>dispatch=>{

  const config={
    headers:{
      'Content-Type':'application/json'
    }
  }

  const body=JSON.stringify({username:u,password:p})

  axios.post(BASE_URL+'/api/login/',body,config)
  .then(res=>{
    dispatch({
      type:LOGIN_SUCCESS,
      payload:res.data
    })
  })
  .catch(err=>{
    console.log(err)
    dispatch({
      type:LOGIN_FAIL,
    })
  })

}

export const logOut=()=>(dispatch,getState)=>{
  const config={
    headers:{
      'Content-Type':'application/json'
    }
  }
  const token=getState().User.auth.token

  if(token){
    config.headers['Authorization']=`Token ${token}`
  }

  axios.post(BASE_URL+'/api/logout/',null,config)
  .then(res=>{
    dispatch({
      type:LOGOUT,
    })
  })
}
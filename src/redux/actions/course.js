import axios from 'axios'
import { func } from 'prop-types'
import {COURSE_ADD,COURSE_LOADED,COURSE_LOADING,COURSE_REMOVE,COURSE_UPDATE} from '../actions/types'
import {tokenConfig} from './school'
import {BASE_URL} from './host'

export const getCourses=()=>(dispatch,getState)=>{

    dispatch({type:COURSE_LOADING})

    axios.get(BASE_URL+'/school/api/Courses/',tokenConfig(getState))
    .then(res=>{
      console.log('noti',res.data)
      dispatch({
        type:COURSE_LOADED,
        payload:res.data
      })
    })
    .catch(err=>{
       console.log(err)
    })

}

export const addCourse=(data,request=func())=>(dispatch,getState)=>{

  axios.post(BASE_URL+'/school/api/Courses/',data,tokenConfig(getState))
  .then(res=>{
    dispatch({
      type:data.type===1?COURSE_ADD:COURSE_UPDATE,
      payload:res.data
    })
    request(true)
  })
  .catch(err=>{
    request(false)
  })
}

export const removeCourse=(id,request=func())=>(dispatch,getState)=>{
  
    axios.delete(BASE_URL+'/school/api/Courses/'+id+'/',tokenConfig(getState))
    .then(res=>{
        console.log(res.data)
      dispatch({
        type:COURSE_REMOVE,
        payload:res.data
      })
      request(true)
    })
    .catch(err=>{
      console.log("res",err)
      request(err)
    })
  }

  export const getRollCall=(id,request=func())=>(dispatch,getState)=>{

    axios.get(BASE_URL+'/school/api/CourseRollCall/?course='+id,tokenConfig(getState))
    .then(res=>{
      request(res.data)
    })
    .catch(err=>{
      console.log(err)
    })
  }


  export const saveRollCall=(data,request=func())=>(dispatch,getState)=>{

    axios.post(BASE_URL+'/school/api/CourseRollCall/',data,tokenConfig(getState))
    .then(res=>{
      
      request(res.data)
    })
    .catch(err=>{
      request(false)
    })
  }

  export const getHomeWork=(id,request=func())=>(dispatch,getState)=>{

    axios.get(BASE_URL+'/school/api/CourseHomeWork/?course='+id,tokenConfig(getState))
    .then(res=>{
      request(res.data)
    })
    .catch(err=>{
      console.log(err)
    })
  }

  export const addHomeWork=(data,request=func())=>(dispatch,getState)=>{

    axios.post(BASE_URL+'/school/api/CourseHomeWork/',data,tokenConfig(getState))
    .then(res=>{

      request(res.data)
    })
    .catch(err=>{
      request(false)
    })
  }
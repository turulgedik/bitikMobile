import axios from 'axios'
import { func } from 'prop-types'
import {AT_LOADING,AT_LOADED,AT_ADD} from '../actions/types'
import {tokenConfig} from './school'
import {BASE_URL} from './host'

export const getReports=()=>(dispatch,getState)=>{

    dispatch({type:AT_LOADING})

    axios.get(BASE_URL+'/school/api/CommandHistory/',tokenConfig(getState))
    .then(res=>{
      dispatch({
        type:AT_LOADED,
        payload:res.data
      })
    })
    .catch(err=>{
       console.log(err)
    })

}

export const addReport=data=>(dispatch,getState)=>{
    dispatch({
        type:AT_ADD,
        payload:data
      })
}
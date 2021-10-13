import axios from 'axios'
import { func } from 'prop-types'
import {AT_LOADING,AT_LOADED,AT_ADD} from '../actions/types'
import {tokenConfig} from './school'
import {BASE_URL} from './host'

export const getReports = (first_date = null, last_date = null, classID = null) => (dispatch, getState) => {

  dispatch({ type: AT_LOADING })
  const url = '/school/api/CommandHistory/' + ((first_date !== null) ? '?startDate=' + first_date + '&endDate=' + last_date + '&class=' + classID : '')
  axios.get(BASE_URL + url, tokenConfig(getState))
    .then(res => {
      console.log('at', res.data)
      dispatch({
        type: AT_LOADED,
        payload: res.data
      })
    })
    .catch(err => {
      console.log(err)
    })

}

export const addReport=data=>(dispatch,getState)=>{
    dispatch({
        type:AT_ADD,
        payload:data
      })
}
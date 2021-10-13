import axios from 'axios'
import { func } from 'prop-types'
import { REMOVE_ROLLCALL, LOADING_ROLLCALL, ADD_ROLLCALL, LOADED_ROLLCALL } from '../actions/types'
import { tokenConfig } from './school'
import { BASE_URL } from './host'

export const getRollCalls = (first_date = null, last_date = null, id = null,result=(state)=>{}) => (dispatch, getState) => {

  dispatch({ type: LOADING_ROLLCALL })
  const url = '/school/api/RollCallv2/' + ((first_date !== null) ? '?startDate=' + first_date + '&endDate=' + last_date + '&class=' + id : '')
  axios.get(BASE_URL + url, tokenConfig(getState))
    .then(res => {
      console.log('rools',res.data)
      dispatch({
        type: LOADED_ROLLCALL,
        payload: res.data
      })
      result(true)
    })
    .catch(err => {
      console.log(err)
    })

}

export const addRollCall = (data, request = func()) => (dispatch, getState) => {

  axios.post(BASE_URL + '/school/api/RollCallv2/', data, tokenConfig(getState))
    .then(res => {
      console.log('newRoll',res.data)
      dispatch({
        type: ADD_ROLLCALL,
        payload: res.data
      })
      request(true)
    })
    .catch(err => {
      request(false)
    })
}

export const removeRollCall = (id, request = func()) => (dispatch, getState) => {

  axios.delete(BASE_URL + '/school/api/RollCall/' + id + '/', tokenConfig(getState))
    .then(res => {
      console.log(res.data)
      dispatch({
        type: REMOVE_ROLLCALL,
        payload: res.data
      })
      request(true)
    })
    .catch(err => {
      console.log("res", err)
      request(err)
    })
}

export const saveRollCall = (data, request = func()) => (dispatch, getState) => {

  axios.post(BASE_URL + '/school/api/RollCallv2/', data, tokenConfig(getState))
    .then(res => {
      console.log('newRoll',res.data)
      dispatch({
        type: ADD_ROLLCALL,
        payload: res.data
      })
      request(res.data)
    })
    .catch(err => {
      request(false)
    })
}
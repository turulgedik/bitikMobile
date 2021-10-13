import axios from 'axios'
import { func } from 'prop-types'
import { STUDENT_ADD, STUDENT_REMOVE, STUDENT_UPDATE, STUDENT_ALL } from '../actions/types'
import { tokenConfig } from './school'
import { BASE_URL } from './host'

export const createStudent = (data, request = func()) => (dispatch, getState) => {
  axios.post(BASE_URL + '/school/api/Student/', data, tokenConfig(getState))
    .then(res => {
      console.log(res.data)
      dispatch({
        type: STUDENT_ADD,
        payload: res.data
      })
      request(true)
    })
    .catch(err => {
      console.log("res", err)
      request(false)
    })
}

export const getStudents = (classID = null, request = func()) => (dispatch, getState) => {
  const config = tokenConfig(getState)
  const url = '/school/api/Studentv2/' + ((classID !== null) ? '?class=' + classID : '')
  axios.get(BASE_URL + url, config)
    .then(res => {
      request(res.data)
    })
    .catch(err => {
      console.log("res", err)
      request(false)
    })
}

export const getStudent = (id, request = func()) => (dispatch, getState) => {
  const config = tokenConfig(getState)
  
  const url = '/school/api/Studentv2/' + id + '/'
  console.log('config',BASE_URL + url)
  axios.get(BASE_URL + url, config)
    .then(res => {
      request(res.data)
    })
    .catch(err => {
      console.log("res", err)
      request(false)
    })
}

export const deleteStudent = (id, request = func()) => (dispatch, getState) => {

  axios.delete(BASE_URL + '/school/api/Student/' + id + '/', tokenConfig(getState))
    .then(res => {
      console.log(res.data)
      dispatch({
        type: STUDENT_REMOVE,
        payload: res.data
      })
      request(true)
    })
    .catch(err => {
      console.log("res", err)
      request(err)
    })
}

export const updateStudent = (id, data, request = func()) => (dispatch, getState) => {
  axios.put(BASE_URL + '/school/api/Student/' + id + '/', data, tokenConfig(getState))
    .then(res => {
      console.log('studentUpdate', res.data)
      dispatch({
        type: STUDENT_UPDATE,
        payload: res.data
      })
      request(res.data)
    })
    .catch(err => {
      console.log("res", err)
      request(false)
    })
}
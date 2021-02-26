import { func } from 'prop-types'
import {AUTH_ERROR,USER_LOADED,USER_LOADING, LOGIN_FAIL,LOGIN_SUCCESS, LOGOUT} from '../actions/types'
import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token
    } catch (err) {
      console.log(err);
      return null
    }
};

const saveToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (err) {
      console.log(err);
    }
};

const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('token');
    } catch (err) {
        console.log(err);
    }
};


const initialState={
    auth:{
        token:null,
        isAuth:false,
        isLoading:false
    },
    user:null
}

export default function(state=initialState,action){

    switch(action.type){
        case USER_LOADING:
            return{
                ...state,
                auth:{...state.auth,isLoading:true}
            }
        case USER_LOADED:
            console.log("payload",action.payload.user)
            return{
                ...state,
                auth:{...state.auth,isLoading:false,isAuth:true,token:action.payload.token},
                user:action.payload
            }
        case LOGIN_SUCCESS:
            saveToken(action.payload.token)
            return {
                ...state,
                auth:{token:action.payload.token,isAuth:true,isLoading:false},
                user:action.payload.user
            }
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
            removeToken()
            return{
                ...state,
                auth:{token:null,isAuth:false,isLoading:false},
                user:null
            }
        default:
            return state
    }

}
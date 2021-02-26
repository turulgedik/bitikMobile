import {combineReducers} from 'redux'
import UserReducer from './userReducer'
import SchoolReducer from './SchoolReducer'
import RollCallReducer from './RollCallReducer'
import SocketReducer from './SocketReducer'
import AppReducer from './AppReducer'
import ATReducer from './ATReducer'

export default combineReducers({
    User:UserReducer,
    School:SchoolReducer,
    RollCall:RollCallReducer,
    Socket:SocketReducer,
    App:AppReducer,
    AT:ATReducer
})
import { func } from 'prop-types'
import {CONNECTED_SOCKET,CONNECTING_SOCKET,CONNECT_CLASS,DISCONNECT_CLASS,UPDATE_CLASS,ALL_UNLOCK,ALL_LOCK} from '../actions/types'

const initialState={
    connecteds:[],
    connecting:false,
    connected:false,
}


const updateClass=(connecteds,_class)=>{
    let copy = connecteds
    connecteds.map((elem,i)=>{
        if(elem.id===_class.id){
            copy.splice(i,1,_class)
        }
    })

    return copy
}

const allLock=(connecteds,_state)=>{
    let copy = connecteds
    connecteds.map((elem,i)=>{
        elem._lock=_state
    })

    return copy
}

export default function(state=initialState,action){

    switch(action.type){
        case CONNECTING_SOCKET:
            return{
                ...state,
                connecting:true,
                connected:false
            }
        case CONNECTED_SOCKET:
            return{
                ...state,
                connecting:false,
                connected:true,
                connecteds:action.payload.classes
            }
        case CONNECT_CLASS:
            return {
                ...state,
                connecteds:[...state.connecteds,action.payload]
            }
        case DISCONNECT_CLASS:
            return{
                ...state,
                connecteds:[...state.connecteds.filter(c=> c.id!==action.payload.id)]
            }
        
        case UPDATE_CLASS:
            return{
                ...state,
                connecteds:updateClass([...state.connecteds],action.payload.update)
            }
        case ALL_LOCK:
            return{
                ...state,
                connecteds:allLock([...state.connecteds],true)
            }
        case ALL_UNLOCK:
            return{
                ...state,
                connecteds:allLock([...state.connecteds],false)
            }   
        
        default:
            return state
    }

}
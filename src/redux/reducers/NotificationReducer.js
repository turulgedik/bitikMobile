import {NOTIFI_ADD,NOTIFI_LOADED,NOTIFI_LOADING,NOTIFI_REMOVE,NOTIFI_UPDATE} from '../actions/types'

const initialState={
    notifications:[],
    loading:false,
    loaded:false,
}

const update=(notifications,newNotification)=>{
    let copy=notifications
    notifications.map((element,i)=>{
        if(element.id===newNotification.id){
            copy.splice(i,1,newNotification)
        }
    })
    console.log('updateHome',copy)

    return copy
}

export default function(state=initialState,action){

    switch(action.type){
        case NOTIFI_LOADING:
            return{
                ...state,
                loading:true,
                loaded:false,
            }
        case NOTIFI_LOADED:
            return{
                ...state,
                loading:false,
                loaded:true,
                notifications:action.payload
            }
        case NOTIFI_ADD:
            return {
                ...state,
                notifications:[...state.notifications,action.payload.notification]
            }
        case NOTIFI_UPDATE:
            return {
                ...state,
                notifications:update([...state.notifications],action.payload.notification)
            }
        case NOTIFI_REMOVE:
            return {
                ...state,
                notifications:[...state.notifications.filter(r=>r.id!==action.payload.notification)]
            }
        default:
            return state
    }

}
import {HOMEWORK_ADD,HOMEWORK_LOADED,HOMEWORK_LOADING,HOMEWORK_REMOVE, HOMEWORK_UPDATE} from '../actions/types'

const initialState={
    homeworks:[],
    loading:false,
    loaded:false,
}

const update=(homeworks,newHomeWork)=>{
    let copy=homeworks
    homeworks.map((element,i)=>{
        if(element.id===newHomeWork.id){
            copy.splice(i,1,newHomeWork)
        }
    })
    console.log('updateHome',newHomeWork.whoDo)

    return copy
}

export default function(state=initialState,action){

    switch(action.type){
        case HOMEWORK_LOADING:
            return{
                ...state,
                loading:true,
                loaded:false,
            }
        case HOMEWORK_LOADED:
            return{
                ...state,
                loading:false,
                loaded:true,
                homeworks:action.payload
            }
        case HOMEWORK_ADD:
            return {
                ...state,
                homeworks:[...state.homeworks,action.payload.homeWork]
            }
        case HOMEWORK_UPDATE:
            return {
                ...state,
                homeworks:update([...state.homeworks],action.payload.homeWork)
            }
        case HOMEWORK_REMOVE:
            return {
                ...state,
                homeworks:[...state.homeworks.filter(r=>r.id!==action.payload.homeWork)]
            }
        default:
            return state
    }

}
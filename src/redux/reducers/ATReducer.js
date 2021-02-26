import {AT_ADD,AT_LOADED,AT_LOADING} from '../actions/types'

const initialState={
    reports:[],
    loading:false,
    loaded:false,
}

export default function(state=initialState,action){

    switch(action.type){
        case AT_LOADING:
            return{
                ...state,
                loading:true,
                loaded:false,
            }
        case AT_LOADED:
            return{
                ...state,
                loading:false,
                loaded:true,
                reports:action.payload
            }
        case AT_ADD:
            return {
                ...state,
                reports:[...state.reports,action.payload]
            }
        default:
            return state
    }

}
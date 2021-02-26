import {LOADING_ROLLCALL,LOADED_ROLLCALL, ADD_ROLLCALL,REMOVE_ROLLCALL} from '../actions/types'

const initialState={
    rollcalls:[],
    loading:false,
    loaded:false,
}

export default function(state=initialState,action){

    switch(action.type){
        case LOADING_ROLLCALL:
            return{
                ...state,
                loading:true,
                loaded:false,
            }
        case LOADED_ROLLCALL:
            return{
                ...state,
                loading:false,
                loaded:true,
                rollcalls:action.payload
            }
        case ADD_ROLLCALL:
            return {
                ...state,
                rollcalls:[...state.rollcalls,action.payload.rollcall]
            }
        case REMOVE_ROLLCALL:
            return {
                ...state,
                rollcalls:[...state.rollcalls.filter(r=>r.id!==action.payload.rollcall)]
            }
        default:
            return state
    }

}
import {LOADING_ROLLCALL,LOADED_ROLLCALL, ADD_ROLLCALL,REMOVE_ROLLCALL} from '../actions/types'

const initialState={
    rollcalls:[],
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

    return copy
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
            if(state.rollcalls.findIndex(r=>r.id===action.payload.rollcall.id)>-1){
                return {
                    ...state,
                    rollcalls:update([...state.rollcalls],action.payload.rollcall)
                }
            }
            else{
                return {
                    ...state,
                    rollcalls:[...state.rollcalls,action.payload.rollcall]
                }
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
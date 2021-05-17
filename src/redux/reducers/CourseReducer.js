import {COURSE_ADD,COURSE_LOADED,COURSE_LOADING,COURSE_REMOVE,COURSE_UPDATE} from '../actions/types'

const initialState={
    courses:[],
    loading:false,
    loaded:false,
}

const update=(courses,newCourse)=>{
    let copy=courses
    courses.map((element,i)=>{
        if(element.id===newCourse.id){
            copy.splice(i,1,newCourse)
        }
    })
    console.log('updateHome',copy)

    return copy
}

export default function(state=initialState,action){

    switch(action.type){
        case COURSE_LOADING:
            return{
                ...state,
                loading:true,
                loaded:false,
            }
        case COURSE_LOADED:
            return{
                ...state,
                loading:false,
                loaded:true,
                courses:action.payload
            }
        case COURSE_ADD:
            return {
                ...state,
                courses:[...state.courses,action.payload.course]
            }
        case COURSE_UPDATE:
            return {
                ...state,
                courses:update([...state.courses],action.payload.course)
            }
        case COURSE_REMOVE:
            return {
                ...state,
                courses:[...state.courses.filter(r=>r.id!==action.payload.id)]
            }
        default:
            return state
    }

}
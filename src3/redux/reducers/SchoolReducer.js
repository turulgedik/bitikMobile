import { array, element, func } from 'prop-types'
import {SCHOOL_ERROR,SCHOOL_LOADED,SCHOOL_LOADING, CLASS_ADD, GROUP_ADD, GROUP_REMOVE, TIMETABLE_UPDATE,STUDENT_ADD,STUDENT_REMOVE,STUDENT_UPDATE,
TEACHER_ADD,TEACHER_REMOVE,TEACHER_UPDATE} from '../actions/types'
import {__} from 'lodash'

const initialState={
    isLoading:false,
    isError:false,
    school:{
        id:null,
        code:'',
        name:'',
        adress:'',
        phone:null,
        phone2:null,
        _type:null,
        classes:[],
        teachers:[],
        students:[]
    }
}

const createGroup=(_classes,group)=>{
    let classes=_classes
    classes.filter(c=>c._account===group._class)[0].groups.push(group)
    return classes
}
const deleteGroup=(_classes,info)=>{
    let classes=_classes
    let index=-1
    classes.filter(c=>c._account===info.class)[0].groups.map((elem,i)=>{
        if(elem.id===info.id)
            index=i
    })
    classes.filter(c=>c._account===info.class)[0].groups.splice(index,1)

    return classes
}
const updateGroup=(_classes,group)=>{
    console.log(group)
    let classes=_classes
    let index=-1
    classes.filter(c=>c._account===group._class)[0].groups.map((elem,i)=>{
        if(elem.id===group.id)
            index=i
    })
    classes.filter(c=>c._account===group._class)[0].groups.splice(index,1,group)

    return classes
}

const updateStudent=(school,student)=>{
    let copy=school
    school.students.map((element,i)=>{
        if(element._account.id===student._account.id){
            copy.students.splice(i,1,student)
        }
    })

    return copy.students
}

const updateTeacher=(school,teacher)=>{
    let copy=school
    school.teachers.map((element,i)=>{
        if(element._account.id===teacher._account.id){
            copy.teachers.splice(i,1,teacher)
        }
    })

    return copy.teachers
}

export default function(state=initialState,action){
    switch(action.type){
        case SCHOOL_LOADING:
            return{
                ...state,
                isLoading:true
            }
        case SCHOOL_LOADED:
            
            return{
                ...state,
                isLoading:false,
                isError:false,
                school:action.payload[0]
            }
        case CLASS_ADD:
            return{
                ...state,
                school:{...state.school,classes:[...state.school.classes,action.payload.class]}
            }
        case GROUP_ADD:
            return{
                ...state,
                school:{...state.school,classes:createGroup([...state.school.classes],action.payload.group)}
            }
        case GROUP_REMOVE:
            return{
                ...state,
                school:{...state.school,classes:deleteGroup([...state.school.classes],action.payload)}
        }
        case TIMETABLE_UPDATE:
            return{
                ...state,
                school:{...state.school,classes:updateGroup([...state.school.classes],action.payload.group)}
        }
        case STUDENT_ADD:
            return{
                ...state,
                school:{...state.school,students:[...state.school.students,action.payload.student]}
            }
        case STUDENT_REMOVE:
            return{
                ...state,
                school:{...state.school,students:[...state.school.students.filter(s=>s._account.id!==action.payload.student)]}
            }
        case STUDENT_UPDATE:
            return{
                ...state,
                school:{...state.school,students:updateStudent({...state.school},action.payload.student)}
            }
        case TEACHER_ADD:
            return{
                ...state,
                school:{...state.school,teachers:[...state.school.teachers,action.payload.teacher]}
            }
        case TEACHER_REMOVE:
            return{
                ...state,
                school:{...state.school,teachers:[...state.school.teachers.filter(t=>t._account.id!==action.payload.teacher)]}
            }
        case TEACHER_UPDATE:
            return{
                ...state,
                school:{...state.school,teachers:updateTeacher({...state.school},action.payload.teacher)}
            }
        default:
            return state
    }

}
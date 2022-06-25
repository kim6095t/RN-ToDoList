import {SET_TASKS, SET_TASK_ID} from '../_actions/types'

const initialState={
    tasks:[],
    taskID: 1,
}

export function taskReducer(state=initialState, action){
    switch(action.type){
        case SET_TASKS:
            return {...state, tasks: action.payload}
        case SET_TASK_ID:
            return {...state, taskID: action.payload}
        default:
            return state;
    }
}
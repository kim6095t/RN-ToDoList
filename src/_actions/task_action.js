import { SET_TASKS, SET_TASK_ID} from "./types";

export const setTasks=tasks=>{
    return {
        type:SET_TASKS,
        payload:tasks
    }
}

export const setTaskID=taskID=>{
    return {
        type:SET_TASK_ID,
        payload:taskID
    }
}
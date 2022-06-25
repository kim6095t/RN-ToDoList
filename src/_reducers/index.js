import {legacy_createStore as createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {taskReducer} from './task_reducer';
import promisMiddleware from 'redux-promise'


const rootReducer = combineReducers({taskReducer})

export const Store=createStore(rootReducer, applyMiddleware(promisMiddleware,thunk))
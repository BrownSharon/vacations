import {createStore} from 'redux'
import {rootReducers} from './reducer'

export let store = createStore(rootReducers)
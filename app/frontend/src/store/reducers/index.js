import { combineReducers } from 'redux';
import usersReducer from './usersReducer';
import conceptsReducer from './conceptsReducer';

const rootReducer = combineReducers({
    users: usersReducer,
    concepts: conceptsReducer
});

export default rootReducer;

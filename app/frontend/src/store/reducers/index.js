import { combineReducers } from 'redux';
import usersReducer from './usersReducer';
import conceptsReducer from './conceptsReducer';
import sessionReducer from './sessionReducer';

const rootReducer = combineReducers({
    session: sessionReducer,
    users: usersReducer,
    concepts: conceptsReducer
});

export default rootReducer;

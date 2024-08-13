import { AddUserAttemptToDB, checkAnswerInDB } from "../services/attemptService";

// Action Types
export const ADD_USER_ATTEMPT = "userAttempts/ADD_USER_ATTEMPT";
export const ADD_USER_ATTEMPT_SUCCESS = "userAttempts/ADD_USER_ATTEMPT_SUCCESS";
export const ADD_USER_ATTEMPT_FAILURE = "userAttempts/ADD_USER_ATTEMPT_FAILURE";

export const UPDATE_USER_ATTEMPT = "userAttempts/UPDATE_USER_ATTEMPT";
export const UPDATE_USER_ATTEMPT_SUCCESS = "userAttempts/UPDATE_USER_ATTEMPT_SUCCESS";
export const UPDATE_USER_ATTEMPT_FAILURE = "userAttempts/UPDATE_USER_ATTEMPT_FAILURE";


// Action Creators

// Add User Attempt
const addUserAttempt = () => ({
    type: ADD_USER_ATTEMPT,
  });
  
  const addUserAttemptSuccess = (newAttemptId) => ({
    type: ADD_USER_ATTEMPT_SUCCESS,
    newAttemptId,
  });
  
  const addUserAttemptFailure = (error) => ({
    type: ADD_USER_ATTEMPT_FAILURE,
    error,
  });
  
  // Update User Attempt
  const updateUserAttempt = () => ({
    type: UPDATE_USER_ATTEMPT,
  });
  
  const updateUserAttemptSuccess = (id, checkAttempt) => ({
    type: UPDATE_USER_ATTEMPT_SUCCESS,
    id,
    checkAttempt,
  });
  
  const updateUserAttemptFailure = (error) => ({
    type: UPDATE_USER_ATTEMPT_FAILURE,
    error,
  });

  // Thunk Actions

// Add User Attempt Thunk
export const startUserAttempt = (id, deckId, passes = 0, totalQuestions = 3, createdAt = new Date().toISOString()) => async (dispatch) => {
    dispatch(addUserAttempt());
    try {
      const attemptData = { deckId, passes, totalQuestions, createdAt };
      const newAttemptId = await AddUserAttemptToDB(attemptData, id); // Assuming this is an API call
      dispatch(addUserAttemptSuccess(newAttemptId));
    } catch (error) {
      dispatch(addUserAttemptFailure(error.message));
    }
  };
  
  // Update User Attempt Thunk
  export const modifyUserAttempt = (userId, attemptId, deckId, id, answer) => async (dispatch) => {
    dispatch(updateUserAttempt());
    try {
      const checkAttempt = await checkAnswerInDB(userId, id, attemptId, answer, deckId); // Assuming this is an API call
      dispatch(updateUserAttemptSuccess(id, checkAttempt));
    } catch (error) {
      dispatch(updateUserAttemptFailure(error.message));
    }
  };
  
  const initialState = {
    attempts: [],
    loading: false,
    error: null,
  };
  
  // Reducer
  const userAttemptsReducer = (state = initialState, action) => {
    switch (action.type) {
      case ADD_USER_ATTEMPT:
      case UPDATE_USER_ATTEMPT:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case ADD_USER_ATTEMPT_SUCCESS:
        return {
          ...state,
          loading: false,
          attempts: [...state.attempts, { id: action.newAttemptId }],
        };
      case UPDATE_USER_ATTEMPT_SUCCESS:
        return {
          ...state,
          loading: false,
          attempts: state.attempts.map(attempt => 
            attempt.id === action.id ? { ...attempt, checkAttempt: action.checkAttempt } : attempt
          ),
        };
      case ADD_USER_ATTEMPT_FAILURE:
      case UPDATE_USER_ATTEMPT_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.error,
        };
      default:
        return state;
    }
  };
  
  export default userAttemptsReducer;
  
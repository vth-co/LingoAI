import {
  AddUserAttemptToDB,
  checkAnswerInDB,
} from "../services/attemptService";
import { getAttemptByDeckIdFromDB } from "../services/deckService";

// Action Types

export const LOAD_USER_ATTEMPT = "userAttempts/LOAD_USER_ATTEMPT";
export const ADD_USER_ATTEMPT = "userAttempts/ADD_USER_ATTEMPT";
export const UPDATE_USER_ATTEMPT = "userAttempts/UPDATE_USER_ATTEMPT";
// Action Creators

const loadUserAttempt = (attempt) => ({
    type: LOAD_USER_ATTEMPT,
    attempt,
  });

// Add User Attempt
const addUserAttempt = (newAttempt) => ({
  type: ADD_USER_ATTEMPT,
  newAttempt,
});

const updateUserAttempt = (id, checkAttempt) => ({
  type: UPDATE_USER_ATTEMPT,
  id,
  checkAttempt,
});

// Thunk Actions
export const fetchUserAttempt = (deckId) => async (dispatch) => {
    try {
      const attempt = await getAttemptByDeckIdFromDB(deckId);
      console.log("Fetched attempt:", attempt); // Log fetched data
      dispatch(loadUserAttempt(attempt || {})); // Handle empty attempts
    } catch (error) {
      console.error("Error fetching user attempt:", error);
    }
  };

// Add User Attempt Thunk
export const startUserAttempt = (userId, deckId, passes = 0, totalQuestions = 3, createdAt = new Date().toISOString()) => async (dispatch) => {
  try {
      const attemptData = { deckId, passes, totalQuestions, createdAt };
      const newAttemptId = await AddUserAttemptToDB(attemptData, userId); // API call

      dispatch(addUserAttempt(newAttemptId));
      
      // Return the new attempt ID
      return { payload: newAttemptId };
  } catch (error) {
      console.error("Error creating user attempt:", error);
      throw error; // Throw the error to handle it where the thunk is called
  }
};

  
  export const modifyUserAttempt = (userId, attemptId, deckId, questionId, answer) => async (dispatch) => {
    try {
      const checkAttempt = await checkAnswerInDB(userId, questionId, attemptId, answer, deckId); // API call
      dispatch(updateUserAttempt(attemptId, checkAttempt));
    } catch (error) {
      console.error("Error updating user attempt:", error);
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
    case LOAD_USER_ATTEMPT:
      return {
        ...state,
        attempts: state.attempts.map(attempt =>
          attempt.deckId === action.attempt.deckId
            ? { ...action.attempt }
            : attempt
        ),
      };
    case ADD_USER_ATTEMPT:
      return {
        ...state,
        attempts: [...state.attempts, action.newAttempt ],
      };
      case UPDATE_USER_ATTEMPT:
        return {
          ...state,
          attempts: state.attempts.map((attempt) =>
            attempt.id === action.id
              ? { ...attempt, checkAttempt: action.checkAttempt }
              : attempt
          ),
        };
      default:
        return state;
  }
};

export default userAttemptsReducer;

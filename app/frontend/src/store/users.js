const { doc, getDoc, collection, getDocs } = require('firebase/firestore')
const { db } = require("../firebase/firebaseConfig");
const { SET_USER } = require("./session");

// Action Types
const LOAD_USERS = "users/LOAD_USERS";
const LOAD_USER_PROGRESS = "users/LOAD_USER_PROGRESS";

// Action Creators
const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});

const loadUsers = (users) => ({
    type: LOAD_USERS,
    users,
});

const loadUserProgress = (uid, progress) => ({
    type: LOAD_USER_PROGRESS,
    payload: { uid, progress },
});

// Thunk Actions
export const fetchSingleUser = (uid) => async (dispatch) => {
    try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            dispatch(setUser({ ...userData, uid })); // Update Redux state with user data
        } else {
            console.error('User not found');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

export const fetchUserProgress = (uid) => async (dispatch) => {
    try {
        const response = await fetch(`/api/users/${uid}/progress`);

        if (response.ok) {
            const progress = await response.json();
            dispatch(loadUserProgress(uid, progress));
        } else {
            console.error("Response not OK");
        }
    } catch (error) {
        console.error('Error fetching user progress:', error);
    }
};

export const fetchUsers = () => async (dispatch) => {
    try {
        const response = await fetch("/api/users/all-users");

        if (response.ok) {
            const users = await response.json();
            dispatch(loadUsers(users));
        } else {
            console.error("Response not OK");
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

// Initial State
const initialState = {
};

// Reducer
const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_USERS: {
            const newState = { ...state };
            action.users.forEach((user) => {
                newState[user.id] = user;
            });
            return newState;
        }
        case LOAD_USER_PROGRESS: {
            const { progress } = action.payload
            return {
                ...state,
                progress
            }
        }
        default:
            return state;
    }
};

export default usersReducer;

// src/actions/userActions.js
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export const fetchUsersBegin = () => ({ type: 'FETCH_USERS_BEGIN' });
export const fetchUsersSuccess = (users) => ({ type: 'FETCH_USERS_SUCCESS', payload: users });
export const fetchUsersFailure = (error) => ({ type: 'FETCH_USERS_FAILURE', error });

export const LOAD_USERS = () => "users/LOAD_USERS";

const load = (users) => ({
    type: LOAD_USERS,
    users,
});

export const fetchUsers = () => async (dispatch) => {
    const response = await fetch("/api/users/all-users");

    if (response.ok) {
        const users = await response.json();
        return dispatch(load(users));
    } else {
        console.log("Internal server error");
    }
};

// export const fetchUsers = () => async (dispatch) => {
//     try {
//         const usersRef = collection(db, 'users'); // Using db from import
//         const snapshot = await getDocs(usersRef);
//         const users = snapshot.docs.map((doc) => doc.data());
//         console.log('Fetched users:', users);
//         dispatch({ type: 'FETCH_USERS_SUCCESS', payload: users });
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         dispatch({
//             type: 'FETCH_USERS_FAILURE',
//             error
//         });
//     }
// };

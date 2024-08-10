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

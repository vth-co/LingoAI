import { LOAD_TOPICS } from "../actions/topicsActions";

const initialState = {
};

const topicsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_TOPICS: {
            const newState = { ...state };

            action.topics.forEach((topic) => {
                newState[topic.id] = topic;
            });

            return newState;
        }
        default:
            return state;
    }
};

export default topicsReducer;

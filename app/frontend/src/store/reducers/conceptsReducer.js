import { LOAD_CONCEPTS } from "../actions/conceptsActions";

const initialState = {
};

const conceptsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_CONCEPTS: {
            const newState = { ...state };

            action.concepts.forEach((concept) => {
                newState[concept.id] = concept;
            });

            return newState;
        }
        default:
            return state;
    }
};

export default conceptsReducer;

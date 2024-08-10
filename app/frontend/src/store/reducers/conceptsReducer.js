import { LOAD_CONCEPTS, LOAD_ONE_CONCEPT } from "../actions/conceptsActions";

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
        case LOAD_ONE_CONCEPT: {
            console.log("REDUCER", action)
            return { ...state, [action.concept.id]: action.concept }
        }
        default:
            return state;
    }
};

export default conceptsReducer;

import { LOAD_CONCEPTS, LOAD_ONE_CONCEPT, LOAD_TOPICS_BY_CONCEPT } from "../actions/conceptsActions";

const initialState = {
    concepts: {}, // Empty object to store concepts by ID
    topics: {}
};

const conceptsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_CONCEPTS: {
            const newState = { ...state };
            newState.concepts = action.concepts.filter(
                (concept) => concept.level === action.userLevel
            );
            return newState;
        }
        case LOAD_ONE_CONCEPT: {
            const { concept } = action; // Destructure and rename action.concept
            return { ...state, concept }; // Use concept as the key
        }
        case LOAD_TOPICS_BY_CONCEPT: {
            const { topics } = action.topics
            return { ...state, topics }
        }

        default:
            return state;
    }
};

export default conceptsReducer;

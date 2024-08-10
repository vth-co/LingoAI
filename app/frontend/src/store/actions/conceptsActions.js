export const LOAD_CONCEPTS = () => "concepts/LOAD_CONCEPTS";
export const LOAD_ONE_CONCEPT = () => "concepts/LOAD_ONE_CONCEPT";

const load = (concepts) => ({
    type: LOAD_CONCEPTS,
    concepts,
});

const loadOne = (concept) => ({
    type: LOAD_ONE_CONCEPT,
    concept,
});

export const fetchConcepts = () => async (dispatch) => {
    try {
        const response = await fetch("/api/concepts/all-concepts");

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const concepts = await response.json();
        dispatch(load(concepts));
        return concepts
    } catch (error) {
        console.error("Error fetching concepts:", error);
        // Dispatch error action or handle error appropriately
    }
};

export const fetchOneConcept = (conceptId) => async (dispatch) => {
    try {
        console.log("ID", conceptId)
        const response = await fetch(`/api/concepts/${conceptId}`);
        console.log("RES", response)

        if (response.ok) {
            const concept = await response.json();
            dispatch(loadOne(concept));
            console.log("CONCEPT", concept);
            return concept
        } else {
            console.error("Response failed:", response.statusText);
        }
    } catch (error) {
        console.error('Error fetching concept:', error);
        // Dispatch error action or handle error appropriately
    }
};

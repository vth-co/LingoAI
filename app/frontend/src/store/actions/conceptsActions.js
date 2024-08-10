export const LOAD_CONCEPTS = () => "concepts/LOAD_CONCEPTS";

const load = (concepts) => ({
    type: LOAD_CONCEPTS,
    concepts,
});

export const fetchConcepts = () => async (dispatch) => {
    const response = await fetch("/api/concepts/all-concepts");

    if (response.ok) {
        const concepts = await response.json();
        return dispatch(load(concepts));
    } else {
        console.log("Internal server error");
    }
};

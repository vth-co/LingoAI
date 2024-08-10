export const LOAD_TOPICS = () => "concepts/LOAD_TOPICS";

const load = (topics) => ({
    type: LOAD_TOPICS,
    topics,
});

export const fetchTopics = () => async (dispatch) => {
    const response = await fetch("/api/topics/all-topics");

    if (response.ok) {
        const topics = await response.json();
        return dispatch(load(topics));
    } else {
        console.log("Internal server error");
    }
};

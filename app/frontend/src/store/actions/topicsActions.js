export const LOAD_TOPICS = () => "topics/LOAD_TOPICS";
export const LOAD_ONE_TOPIC = () => "topics/LOAD_ONE_TOPIC";

const load = (topics) => ({
    type: LOAD_TOPICS,
    topics,
});

const loadOne = (topic) => ({
    type: LOAD_ONE_TOPIC,
    topic,
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

export const fetchOneTopic = (topicId) => async (dispatch) => {
    const response = await fetch(`/api/topics/${topicId}`);

    if (response.ok) {
        const topic = await response.json();
        return dispatch(loadOne(topic));
    } else {
        console.log("Internal server error");
    }
};

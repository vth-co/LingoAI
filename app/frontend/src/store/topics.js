const { db } = require("../firebase/firebaseConfig");
const { collection, getDocs, getDoc, doc } = require("firebase/firestore");

// Action Types
export const LOAD_TOPICS = "topics/LOAD_TOPICS";
export const LOAD_ONE_TOPIC = "topics/LOAD_ONE_TOPIC";

// Action Creators
const loadTopics = (topics) => ({
  type: LOAD_TOPICS,
  topics,
});

const loadOneTopic = (topic) => ({
  type: LOAD_ONE_TOPIC,
  topic,
});

// Thunk Actions
export const fetchTopics = () => async (dispatch) => {
  try {
    const response = await fetch("/api/topics/all-topics");

    if (response.ok) {
      const topics = await response.json();
      dispatch(loadTopics(topics));
      return topics;
    } else {
      console.error("Internal server error");
    }
  } catch (error) {
    console.error("Error fetching topics:", error);
  }
};

export const fetchTopicsThroughProgress = (userId) => async (dispatch) => {
  try {
    const progressDocRef = doc(db, "progress", userId);

    const conceptRef = collection(progressDocRef, "concepts");

    const conceptDoc = await getDocs(conceptRef);

    const topics = conceptDoc.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // console.log("topics", topics);

    dispatch(loadTopics(topics));
  } catch (error) {
    throw new Error("Error fetching progress: " + error.message);
  }
};

export const fetchOneTopic = (topicId) => async (dispatch) => {
  try {
    const topicRef = doc(db, "topics", topicId);
    const topicSnap = await getDoc(topicRef);

    if (topicSnap.exists()) {
      const topic = { id: topicSnap.id, ...topicSnap.data() };
      dispatch(loadOneTopic(topic)); // Dispatch the topic data to Redux store
      return topic; // Return the topic data if needed
    } else {
      console.error("Topic not found");
    }
  } catch (error) {
    console.error("Error fetching topic:", error);
  }
};


// Initial State
const initialState = {};

// Reducer
const topicsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_TOPICS: {
      const newState = { ...state };
      action.topics.forEach((topic) => {
        newState[topic.id] = topic;
      });
      return newState;
    }
    case LOAD_ONE_TOPIC: {
      return { ...state, [action.topic.id]: action.topic };
    }
    default:
      return state;
  }
};

export default topicsReducer;

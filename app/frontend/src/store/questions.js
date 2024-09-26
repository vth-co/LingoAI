import { addQuestionsToDB } from "../services/aiService";
import { addCardsToDeckInDB, createDeckInDB, canGenerateDeck } from "../services/deckService";

const { db } = require("../firebase/firebaseConfig");
const { collection, getDoc, doc, getDocs, setDoc, increment, runTransaction } = require("firebase/firestore");
const { generateQuestionsByAI } = require("../models/aiModel");



export const LOAD_QUESTIONS = "questions/LOAD_QUESTIONS";
export const ADD_QUESTION = "questions/ADD_QUESTION";

const load = (questions) => ({
  type: LOAD_QUESTIONS,
  questions,
});

const add = (question) => ({
  type: ADD_QUESTION,
  question,
});


export const addQuestions =
  (
    concept_name,
    topic_name,
    user_native_language,
    concept_level,
    topicId,
    userId
  ) =>
    async (dispatch) => {
      try {
        const isDemoUser = userId === "XfvjHvAySVSRdcOriaASlrnoma13";
        const { canGenerate, message } = await canGenerateDeck(userId, isDemoUser);
        if (!canGenerate) {
          throw new Error(message); // Error if limit reached
        }

        let questionData = await generateQuestionsByAI(
          concept_name,
          topic_name,
          user_native_language,
          concept_level,
          topicId
        );
        // console.log("questionData: ", questionData);

        dispatch(
          add({
            concept_name,
            topic_name,
            user_native_language,
            concept_level,
            topicId,
          })
        );

        if (questionData) {
          const question_from_ai = await addQuestionsToDB(userId, {
            questionData,
          });
          // console.log("Created questions successfully:", question_from_ai);

          // Create a new deck in the database
          const deck = await createDeckInDB({
            userId,
            topic_id: topicId,
            createdAt: new Date(),
            archived: false,
          });

          // console.log("Deck created successfully:", deck);

          // Add the generated questions as cards to the deck
          const cardsAdded = await addCardsToDeckInDB(
            deck.id,
            userId,
            question_from_ai
          );

          // console.log("Cards added to deck successfully:", cardsAdded);

          await runTransaction(db, async (transaction) => {
            const userDocRef = doc(db, "user_limits", userId);
            const globalCountRef = doc(db, "request_limits", "daily_count");

            transaction.update(userDocRef, {
              generationCount: increment(1), // Increment user's generation count
            });

            const globalDoc = await getDoc(globalCountRef);
            const now = Date.now();
            let timestamps, lastReset;

            if (globalDoc.exists()) {
              timestamps = globalDoc.data().timestamps || [];
              lastReset = globalDoc.data().lastReset;

              if (lastReset && now - lastReset > 60000) {
                timestamps = [];
                lastReset = now;
              }
            } else {
              timestamps = [];
              lastReset = now;
            }

            timestamps.push(now);
            transaction.set(globalCountRef, {
              totalRequests: increment(1),
              timestamps,
              lastReset
            }, { merge: true })
            // transaction.update(globalCountRef, {
            //   totalRequests: increment(1), // Increment global request count
            // });
          });

          return cardsAdded;
        }
      } catch (error) {
        console.error("Error during sign up:", error);
        throw error;
      }
    };

const initialState = {};

const questionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_QUESTION:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export default questionsReducer;

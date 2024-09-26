import { getAttemptByDeckIdFromDB, getArchivedStatusByDeckIdFromDB, getArchivedDecksFromDB, checkDeckIsInProgressFromDB } from "../services/deckService";
import { fetchUserAttempt } from "./attempt";

const { db } = require("../firebase/firebaseConfig");
const {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  FieldValue,
} = require("firebase/firestore");

// Action Types
export const LOAD_DECKS = "concepts/LOAD_DECKS";
export const LOAD_ONE_DECK = "concepts/LOAD_ONE_DECK";
export const ARCHIVE_DECK = "concepts/ARCHIVE_DECK";

// Action Creators
const loadDecks = (decks) => ({
  type: LOAD_DECKS,
  decks,
});

const loadOneDeck = (deck) => ({
  type: LOAD_ONE_DECK,
  deck,
});

const archiveDeckAction = (deckId) => ({
  type: ARCHIVE_DECK,
  deckId,
  archived: true
})

// Thunk Actions
// export const fetchDecks = (userId, topicId) => async (dispatch) => {
//   try {
//     const userDocRef = doc(db, "users", userId);
//     const userDoc = await getDoc(userDocRef);
//     if (!userDoc.exists()) {
//       throw new Error("User not found");
//     }
//     const userDecksCollectionRef = collection(userDocRef, "decks");
//     const userDecksSnapshot = await getDocs(userDecksCollectionRef);
//     const userDecks = userDecksSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     dispatch(loadDecks(userDecks));
//   } catch (error) {
//     console.error("Error fetching decks:", error);
//   }
// };

export const fetchDecks = (userId, topicId) => async (dispatch) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userDecksCollectionRef = collection(userDocRef, "decks");
    const userDecksSnapshot = await getDocs(userDecksCollectionRef);

    // console.log("Fetched user decks snapshot:", userDecksSnapshot); // Log snapshot for debugging

    const userDecks = await Promise.all(userDecksSnapshot.docs.map(async (doc) => {
      const deckData = { id: doc.id, ...doc.data() };

      // Fetch attempt data if necessary
      let attemptId = null;
      try {
        const attempt = await getAttemptByDeckIdFromDB(deckData.id);
        attemptId = attempt ? attempt.id : null; // Use null if no attempt is found
      } catch {
      }

      // Fetch archived status
      let archivedStatus = null;
      try {
        archivedStatus = await getArchivedStatusByDeckIdFromDB(deckData.id);
      } catch (err) {
        console.error(`Failed to fetch archived status for deck ${deckData.id}:`, err);
      }

      return {
        ...deckData,
        attemptId,      // Include attemptId or null
        archived: archivedStatus // Include archived status
      };
    }));

    // console.log("Final user decks:", userDecks); // Log final decks data
    dispatch(loadDecks(userDecks));
  } catch (error) {
    console.error("Error fetching decks:", error);
  }
};

export const fetchOneDeck = (deckId) => async (dispatch) => {
  try {
    const deckDocRef = doc(db, "decks", deckId);
    const deckSnapshot = await getDoc(deckDocRef);

    if (deckSnapshot.exists()) {
      const deckData = { id: deckSnapshot.id, ...deckSnapshot.data() };
      dispatch(loadOneDeck(deckData));
    } else {
      console.log("No such deck found!");
    }
  } catch (error) {
    console.error("Error fetching deck:", error);
  }
};

export const updateDeckStatus = async (deckId, attemptId) => {
  try {
    const deckRef = doc(db, "decks", deckId);
    await updateDoc(deckRef, {
      status: "in_progress",
      currentAttemptId: attemptId,
    });
    console.log("Deck status updated to in_progress");
  } catch (error) {
    throw new Error("Error updating deck status: " + error.message);
  }
};

export const createAttemptIfNotExists =
  (deckId, attemptId) => async (dispatch, getState) => {
    console.log("ATTEMPTID", attemptId)
    if (!attemptId) {
      console.error("Invalid attemptId:", attemptId);
      throw new Error("Attempt ID is undefined or invalid.");
    }

    const docRef = doc(db, "decks", deckId);

    try {
      await setDoc(docRef, { attemptId }, { merge: true });
      console.log("Attempt ID set successfully in deck:", deckId);
    } catch (error) {
      console.error("Error setting attempt ID:", error);
      throw error;
    }
  };

export const updateAttemptId = (deckId, attemptId) => async (dispatch) => {
  try {
    console.log(`Attempting to update attempt ID for deck ${deckId} with attempt ID ${attemptId}`); // Log the parameters

    const deckDocRef = doc(db, "decks", deckId);
    await updateDoc(deckDocRef, { attemptId });

    console.log(`Successfully updated attempt ID for deck ${deckId}`); // Log success message

    // Optionally refresh the deck data
    dispatch(fetchOneDeck(deckId));
    console.log(`Fetching updated deck data for deck ${deckId}`); // Log fetching action
  } catch (error) {
    console.error("Error updating attempt ID:", error);
  }
};

export const archiveDeck = (deckId, userId) => async (dispatch) => {
  // const userDocRef = doc(db, "users", userId);
  // const deckDocRef = doc(userDocRef, "decks", deckId);
  const deckDocRef = doc(db, "decks", deckId);
  try {
    await updateDoc(deckDocRef, {
      archived: true,
    });
    const updatedDeckSnapshot = await getDoc(deckDocRef);
    if (updatedDeckSnapshot.exists()) {
      const updatedDeck = { id: updatedDeckSnapshot.id, ...updatedDeckSnapshot.data() };
      // dispatch(loadOneDeck(updatedDeck)); // Ensure Redux state is updated
      console.log("Updated deck after archiving:", updatedDeck);
    }

    dispatch(archiveDeckAction(deckId));
  } catch (error) {
    console.error("Error archiving deck:", error);
    throw error
  }
}

const initialState = {
  decks: [],
};

const decksReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_DECKS:
      return {
        ...state,
        decks: action.decks,
      };
    case LOAD_ONE_DECK:
      return {
        ...state,
        selectedDeck: action.deck,
      };
    case ARCHIVE_DECK:
      // if (state.selectedDeck?.id === action.deckId) {
      //   return {
      //     ...state,
      //     selectedDeck: {
      //       ...state.selectedDeck,
      //       archived: true,
      //     },
      //   };
      // }

      return {
        ...state,
        decks: state.decks.map(deck => deck.id === action.deckId ? { ...deck, archived: true } : deck),
        selectedDeck: state.selectedDeck?.id === action.deckId ? { ...state.selectedDeck, archived: true } : state.selectedDeck,
      }
    default:
      return state;
  }
};

export default decksReducer;

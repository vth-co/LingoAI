const { db } = require('../firebase/firebaseConfig');
const { collection, addDoc, getDocs, updateDoc, getDoc, doc, query, where, setDoc } = require('firebase/firestore');
// const { checkAndUpdateUserLevel } = require('./levelService');
const { getConceptsByLevel, getTopicsByConceptId } = require('./conceptService');

// Service to add a user
const addUserToDB = async ({ uid, email, username, first_name, last_name, native_language, level }) => {
    let badges = []
    await setDoc(doc(db, 'users', uid), {
        email,
        username,
        first_name,
        last_name,
        native_language,
        current_level: level,
        badges,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    console.log('database', db)
};

const setUserLevel = async (uid, level) => {
    await setDoc(doc(db, 'users', uid), {
        current_level: level,
        updatedAt: new Date().toISOString()
    }, { merge: true });
};

// Service to get users from DB
const getUsersFromDB = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        throw new Error('Error fetching users: ' + error.message);
    }
};

// Service to update a user
const updateUserInDB = async (uid, updatedData) => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, updatedData);
        return true;
    } catch (error) {
        throw new Error('Error updating user: ' + error.message);
    }
};

// Service to get a user by id
const getUserByIdFromDB = async (id) => {
    try {
        const userRef = doc(db, 'users', id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() };
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        throw new Error('Error fetching user: ' + error.message);
    }
};

// Service to get user progress
const getProgressFromDB = async (uid) => {
    console.log('get progress route is hit', uid);
    try {
        const progressDocRef = doc(db, 'progress', uid);
        const userDocRef = doc(db, 'users', uid);

        const userDoc = await getDoc(userDocRef);
        console.log('User doc:', userDoc.data());

        // Access the 'concepts' subcollection
        const conceptsCollectionRef = collection(progressDocRef, 'concepts');
        const conceptsSnapshot = await getDocs(conceptsCollectionRef);
        const concepts = conceptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return { uid, username: userDoc.data().username, current_level: userDoc.data().current_level, concepts };
    } catch (error) {
        throw new Error('Error fetching progress: ' + error.message);
    }
};

const initializeUserProgress = async (uid, level = null) => {
    console.log('initialize user progress route is hit', uid);
    try {
        const userDocRef = doc(db, 'progress', uid);
        const userInfoRef = doc(db, 'users', uid);
        const userInfoSnap = await getDoc(userInfoRef);

        if (!userInfoSnap.exists()) {
            throw new Error('User not found');
        }
        // Create the 'concepts' subcollection
        const conceptsCollectionRef = collection(userDocRef, 'concepts');

        const userInfo = userInfoSnap.data();
        console.log('User info:', userInfo);
        const currentLevel = level || userInfo.current_level;

        // Fetch existing concepts progress
        const existingConceptsSnapshot = await getDocs(conceptsCollectionRef);
        const existingConcepts = existingConceptsSnapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data();
            return acc;
        }, {});

        let concepts = [];
        if (currentLevel === 'Advanced') {
            const [AdvancedConcepts, IntermediateConcepts, BeginnerConcepts] = await Promise.all([
                getConceptsByLevel('Advanced'),
                getConceptsByLevel('Intermediate'),
                getConceptsByLevel('Beginner')
            ]);
            concepts = [...AdvancedConcepts, ...IntermediateConcepts, ...BeginnerConcepts];
        } else if (currentLevel === 'Intermediate') {
            const [IntermediateConcepts, BeginnerConcepts] = await Promise.all([
                getConceptsByLevel('Intermediate'),
                getConceptsByLevel('Beginner')
            ]);
            concepts = [...IntermediateConcepts, ...BeginnerConcepts];
        } else {
            concepts = await getConceptsByLevel(currentLevel);
        }

        // Initialize concepts and topics based on the current level
        for (const concept of concepts) {
            const topics = await getTopicsByConceptId(concept.id);
            const conceptDocRef = doc(conceptsCollectionRef, concept.id);

            const existingConcept = existingConcepts[concept.id];
            let topicsPassedCount = 0;

            const updatedTopics = topics.map(topic => {
                const existingTopic = existingConcept?.topics.find(t => t.id === topic.id);
                if (existingTopic?.status) {
                    topicsPassedCount++;
                }
                return existingTopic
                    ? existingTopic // Preserve existing topic progress
                    : {
                        id: topic.id,
                        conceptId: topic.concept_id,
                        status: false,
                        passes: 0
                    };
            });
            const topicsPassedDecimal = topics.length > 0 ? topicsPassedCount / topics.length : 0;

            await setDoc(conceptDocRef, {
                status: existingConcept ? existingConcept.status : false,
                level: concept.level,
                topics: updatedTopics,
                topicsPassed: topicsPassedDecimal // New field to track passed topics
            }, { merge: true });
        }
    } catch (error) {
        throw new Error('Error initializing user progress: ' + error.message);
    }
}


// Service to update user progress
const updateUserProgressFromDB = async (uid, topic_id) => {
    try {
        const userProgressRef = doc(db, 'progress', uid);
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        const conceptsCollectionRef = collection(userProgressRef, 'concepts');
        const conceptsSnapshot = await getDocs(conceptsCollectionRef);

        let allConceptsPassed = true; // To track if all concepts are passed
        let allBeginnerPassed = true; // To track if all Beginner concepts are passed
        let allIntermediatePassed = true; // To track if all Intermediate concepts are passed
        let allAdvancedPassed = true; // To track if all Advanced concepts are passed

        // Iterate through each concept to find the matching topic_id
        for (const conceptDoc of conceptsSnapshot.docs) {
            const conceptData = conceptDoc.data();
            let topicsUpdated = false; // To track if topics were updated
            let topicsPassedCount = 0; // Reset the passed topics count

            const updatedTopics = conceptData.topics.map(topic => {
                // Count how many topics are already passed
                if (topic.status) {
                    topicsPassedCount++;
                }

                // If the current topic matches and is ready to be passed
                if (topic.id === topic_id && topic.passes >= 3 && !topic.status) {
                    console.log("User has passed this topic.");

                    // Update the topic status if not already passed
                    topic.status = true;
                    topicsUpdated = true;
                    topicsPassedCount++; // Increment the passed topics count
                }
                return topic;
            });

            const topicsPassedDecimal = conceptData.topics.length > 0
                ? parseFloat((topicsPassedCount / conceptData.topics.length).toFixed(1))
                : 0.0;

            if (topicsUpdated || topicsPassedDecimal !== conceptData.topicsPassed) {
                await updateDoc(conceptDoc.ref, {
                    topics: updatedTopics,
                    topicsPassed: topicsPassedDecimal // Store as a number with one decimal place
                });
                console.log("Topic status and topicsPassed count updated successfully in Firestore");
            }

            // Check if all topics in this concept are passed
            const conceptPassed = updatedTopics.every(topic => topic.status);
            if (conceptPassed && conceptData.status !== true) {
                await updateDoc(conceptDoc.ref, { status: true });
                console.log("Concept status updated successfully in Firestore");
            }

            // Track if all concepts are passed
            allConceptsPassed = allConceptsPassed && conceptPassed;
            if (conceptData.level === 'Beginner') {
                allBeginnerPassed = allBeginnerPassed && conceptPassed;
            } else if (conceptData.level === 'Intermediate') {
                allIntermediatePassed = allIntermediatePassed && conceptPassed;
            } else if (conceptData.level === 'Advanced') {
                allAdvancedPassed = allAdvancedPassed && conceptPassed;
            }

            console.log("Concept passed:", conceptPassed, allConceptsPassed);
        }

        // Badge assignment logic
        const badges = userDoc.data().badges || [];

        // If all Beginner concepts are passed, assign the Bronze badge
        if (allBeginnerPassed && !badges.includes('Bronze')) {
            badges.push('Bronze');
            await updateDoc(userDocRef, { badges });
            console.log("Bronze badge assigned");
        }

        // If all Intermediate concepts are passed, assign the Silver badge
        if (allIntermediatePassed && !badges.includes('Silver')) {
            badges.push('Silver');
            await updateDoc(userDocRef, { badges });
            console.log("Silver badge assigned");
        }

        // Level up logic
        const levels = ["Beginner", "Intermediate", "Advanced"];
        const current_level = userDoc.data().current_level;
        const new_level = levels[Math.min(levels.indexOf(current_level) + 1, levels.length - 1)];

        if (new_level !== current_level) {
            console.log("New level:", new_level);

            // Update user's level
            await updateDoc(userDocRef, { current_level: new_level });

            // Re-initialize user progress with new concepts
            await initializeUserProgress(uid, new_level);
        }

        // If all concepts including Advanced are passed, assign the Gold badge
        if (allConceptsPassed && allAdvancedPassed && !badges.includes('Gold')) {
            badges.push('Gold');
            await updateDoc(userDocRef, { badges });
            console.log("Gold badge assigned");
        }

        console.log('User progress updated successfully');
    } catch (error) {
        console.error('Error updating user progress:', error);
    }
};



module.exports = {
    addUserToDB,
    getUsersFromDB,
    updateUserInDB,
    getUserByIdFromDB,
    getProgressFromDB,
    updateUserProgressFromDB,
    setUserLevel,
    initializeUserProgress
};

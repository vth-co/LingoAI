/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// This function runs every day at midnight (00:00)
exports.resetGenerationCounts = functions.pubsub
    .schedule("every day 00:00") // runs at midnight
    .timeZone("America/Los_Angeles") // Set your timezone here
    .onRun(async (context) => {
      const userLimitsRef = admin.firestore().collection("user_limits");
      const snapshot = await userLimitsRef.get();

      // Reset the count for all users
      const batch = admin.firestore().batch();
      snapshot.forEach((doc) => {
        batch.update(doc.ref, {generationCount: 0});
      });

      await batch.commit();
      console.log("All user generation counts have been reset");
      return null;
    });

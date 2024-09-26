const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.resetGenerationCounts = functions
    .region("us-west1") // Change to the desired region
    .pubsub.schedule("every day 00:00") // Runs at midnight
    .timeZone("America/Los_Angeles") // Set your timezone here
    .onRun(async (context) => {
      const userLimitsRef = admin.firestore().collection("user_limits");
      const snapshot = await userLimitsRef.get();

      const batch = admin.firestore().batch();
      snapshot.forEach((doc) => {
        batch.update(doc.ref, {generationCount: 0});
      });

      const globalCountRef = admin.firestore()
          .collection("request_limits")
          .doc("daily_count");
      batch.update(globalCountRef, {totalRequests: 0});

      await batch.commit();
      // console.log("All counts have been reset");
      return null;
    });

const admin = require("firebase-admin")
const functions = require("firebase-functions")
admin.initializeApp();

const db = admin.firestore()

exports.onUserStatusChanged = functions.database.ref('/status/{uid}').onUpdate(
    async (change, context) => {
      // Get the data written to Realtime Database
      const eventStatus = change.after.val();

      // Then use other event data to create a reference to the
      // corresponding Firestore document.
      const userStatusFirestoreRef = firestore.doc(`status/${context.params.uid}`);

      // It is likely that the Realtime Database change that triggered
      // this event has already been overwritten by a fast change in
      // online / offline status, so we'll re-read the current data
      // and compare the timestamps.
      const statusSnapshot = await change.after.ref.once('value');
      const status = statusSnapshot.val();
      console.log(status, eventStatus);
      // If the current timestamp for this data is newer than
      // the data that triggered this event, we exit this function.
      if (status.last_changed > eventStatus.last_changed) {
        return null;
      }

      // Otherwise, we convert the last_changed field to a Date
      eventStatus.last_changed = new Date(eventStatus.last_changed);

      // ... and write it to Firestore.
      return userStatusFirestoreRef.set(eventStatus);
    });

exports.archiveChat = functions.firestore
    .document("chats/{chatId}")
    .onUpdate(change => {
        const data = change.after.data();

        const maxLen = 100;
        const msgLen = data.messages.length;
        const charLen = JSON.stringify(data).length;

        const batch = db.batch();

        if(charLen >= 10000 || msgLen >= maxLen) {
            const deleteCount = msgLen - maxLen <= 0 ? 1 : msgLen - maxLen
            data.messages.splice(0, deleteCount);
        
            const ref = db.collection("chats").doc(change.after.id);

            batch.set(ref, data, { merge: true });

            return batch.commit();
        } else {
            return null;
        }   
    });
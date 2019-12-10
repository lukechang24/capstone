const admin = require("firebase-admin")
const functions = require("firebase-functions")
admin.initializeApp();

const db = admin.firestore()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//     console.log(db)
//     response.send("Hello fro Firebase!")
// });

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
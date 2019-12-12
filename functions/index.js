const admin = require("firebase-admin")
const functions = require("firebase-functions")
admin.initializeApp()

const db = admin.firestore()

exports.changeUserStatus = functions.database.ref("/status/{uid}").onUpdate(
    async (change, context) => {
        const eventStatus = change.after.val()

        const userStatusFirestoreRef = db.doc(`status/${context.params.uid}`)
        const roomFirestoreRef = db.collection("rooms")
        const userBatch = db.batch()
        const roomBatch = db.batch();
        console.log(eventStatus.isOnline, "status")
        if(!eventStatus.isOnline) {
            console.log("The user went offline")
            roomFirestoreRef.where("users", "array-contains", `${context.params.uid}`).get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        console.log(doc.data().users, "usssers")
                        const updatedUsers = [...doc.data().users]
                        updatedUsers.splice(updatedUsers.indexOf(context.params.uid), 1)
                        roomBatch.update(roomFirestoreRef.doc(doc.id), {users: updatedUsers})
                        console.log(updatedUsers, "updaed users")
                        console.log(doc.id, "room id")
                    })
                })
        }
        userBatch.set(userStatusFirestoreRef, eventStatus)
        for(let i = 0; i < 2; i++) {
            if(i === 0) {
                userBatch.commit()
            } else {
                roomBatch.commit()
            }
        }
        return null
    })

exports.archiveChat = functions.firestore
    .document("chats/{chatId}")
    .onUpdate(change => {
        const data = change.after.data()

        const maxLen = 100
        const msgLen = data.messages.length
        const charLen = JSON.stringify(data).length

        const batch = db.batch()

        if(charLen >= 10000 || msgLen >= maxLen) {
            const deleteCount = msgLen - maxLen <= 0 ? 1 : msgLen - maxLen
            data.messages.splice(0, deleteCount)
        
            const ref = db.collection("chats").doc(change.after.id)

            batch.set(ref, data, { merge: true })

            return batch.commit()
        } else {
            return null
        }   
    })

exports.deleteEmptyRooms = functions.firestore
    .document("rooms/{roomId}")
    .onUpdate(change => {
        const dataBefore = change.before.data()
        const dataAfter = change.after.data()
        
        const batch = db.batch()

        if(dataBefore.users.length === 1 && !dataAfter.users[0]) {
        
            const ref = db.collection("rooms").doc(change.after.id)

            batch.delete(ref, dataAfter)

            return batch.commit()
        } else {
            return null
        }   
    })
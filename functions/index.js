const admin = require("firebase-admin")
const functions = require("firebase-functions")
admin.initializeApp()

const db = admin.firestore()

exports.changeUserStatus = functions.database.ref("/status/{uid}").onUpdate(
    async (change, context) => {
        const eventStatus = change.after.val()

        const userStatusFirestoreRef = db.doc(`status/${context.params.uid}`)
        const userRef = db.doc(`users/${context.params.uid}`)
        const batch = db.batch()
        if(!eventStatus.isOnline) {
            console.log("he is offline")
            batch.set(userRef, {currentRoomId: null, isMaster: null, joinedAt: null}, {merge: true})
        }
        batch.set(userStatusFirestoreRef, eventStatus)
        return batch.commit()
    })

exports.deleteUserFromRoom = functions.firestore
    .document("status/{uid}")
    .onUpdate(change => {
        const data = change.after.data()

        const roomRef = db.collection("rooms")
        const batch = db.batch()

        if(!data.isOnline) {
            console.log("im offline...")
            roomRef.where("users", "array-contains", `${change.after.id}`).get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        console.log(doc.data().users, "usssers")
                        const updatedUsers = [...doc.data().users]
                        updatedUsers.splice(updatedUsers.indexOf(change.after.id), 1)
                        batch.update(roomRef.doc(doc.id), {users: updatedUsers})
                    })
                    return batch.commit()
                })
                return null
        } else {
            return null
        }
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

            batch.set(ref, data, {merge: true})

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

exports.deleteEmptyCanvases = functions.firestore
    .document("canvases/{canvasId}")
    .onUpdate(change => {
        const data = change.after.data()
        
        const canvasRef = db.collection("canvases").doc(change.after.id)
        const batch = db.batch()

        if(!data.canvas.clickX[0] && !data.roomId) {
            console.log("DEALTING CNAVAS")
            batch.delete(canvasRef)
            return batch.commit()
        } else {
            return null
        }
})

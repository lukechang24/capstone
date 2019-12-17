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
            batch.set(userRef, {currentRoomId: null, isMaster: null, joinedAt: null, points: null, givenPrompts: {}, chosenPrompt: ""}, {merge: true})
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
            roomRef.where("userList", "array-contains", change.after.id).get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        const updatedUserList = [...doc.data().userList]
                        if(updatedUserList.indexOf(change.after.id) !== -1) {
                            updatedUserList.splice(updatedUserList.indexOf(change.after.id), 1)
                            batch.update(roomRef.doc(doc.id), {userList: updatedUserList})
                            return batch.commit()
                        }
                    })
                })
            roomRef.where("waitingList", "array-contains", change.after.id).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    const updatedWaitingList = [...doc.data().waitingList]
                    if(updatedWaitingList.indexOf(change.afterid) !== -1) {
                        updatedWaitingList.splice(updatedWaitingList.indexOf(change.after.id), 1)
                        batch.update(roomRef.doc(doc.id), {waitingList: updatedWaitingList})
                        return batch.commit()
                    }
                })
            })
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

        if(dataBefore.userList.length === 1 && !dataAfter.userList[0]) {
        
            const ref = db.collection("rooms").doc(change.after.id)
            
            batch.delete(ref, dataAfter)

            return batch.commit()
        } else {
            return null
        }   
    })

exports.deleteChat = functions.firestore
    .document("rooms/{roomId}")
    .onDelete(change => {
        const deletedData = change.data()
        
        const chatRef = db.collection("chats").doc(deletedData.chatId)
        const batch = db.batch()

        batch.delete(chatRef)
        return batch.commit()
})

exports.deleteEmptyCanvases = functions.firestore
    .document("canvases/{canvasId}")
    .onUpdate(change => {
        const data = change.after.data()
        
        const canvasRef = db.collection("canvases").doc(change.after.id)
        const batch = db.batch()

        if(!data.canvas.clickX[0] && !data.roomId) {
            batch.delete(canvasRef)
            return batch.commit()
        } else {
            return null
        }
})

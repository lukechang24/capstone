const functions = require("firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp(functions.config().firebase)

const db = admin.firestore()
const database = admin.database()
const auth = admin.auth()

exports.changeUserStatus = functions.database.ref("/status/{uid}").onUpdate(async (change, context) => {
    const eventStatus = change.after.val()
    const userStatusRef = database.ref(`status/${context.params.uid}`)
    const userRef = database.ref(`users/${context.params.uid}`)

    if(!eventStatus.isOnline) {
        userStatusRef.once("value", status => {
            console.log(status.val())
            if(status.val().isOnline) {
                return null
            } else {
                userRef.once("value", user => {
                    const roomRef = database.ref(`rooms/${user.val().currentRoomId}`)
                    roomRef.once("value", room => {
                        const updatedUserList = room.val().userList ? [...room.val().userList] : []
                        if(updatedUserList.indexOf(context.params.uid) !== -1) {
                            updatedUserList.splice(updatedUserList.indexOf(context.params.uid), 1)
                            roomRef.update({userList: updatedUserList})
                        }
                        const updatedWaitingList = room.val().waitingList ? [...room.val().waitingList] : []
                        if(updatedWaitingList.indexOf(context.params.uid) !== -1) {
                            updatedUserList.splice(updatedWaitingList.indexOf(context.params.uid), 1)
                            roomRef.update({userList: updatedWaitingList})
                        }
                    })
                })
                .then(() => {
                    userRef.once("value", user => {
                        if(user.val().isAnonymous && user.val().doRemove) {
                            userRef.remove()
                            userStatusRef.remove()
                            auth.deleteUser(context.params.uid)
                        } else {
                            userRef.update({currentRoomId: "", isMaster: false, joinedAt: 0, points: 0, givenPrompts: {}, chosenPrompt: ""})
                        }
                    })
                })
            }
        })
    }
    return null
})

exports.archiveChat = functions.database.ref("/chats/{chatId}")
    .onUpdate((change, context) => {
        const data = change.after.val()

        const maxLen = 100
        const msgLen = data.messages.length
        const charLen = JSON.stringify(data).length

        const batch = db.batch()

        if(charLen >= 10000 || msgLen >= maxLen) {
            const deleteCount = msgLen - maxLen <= 0 ? 1 : msgLen - maxLen
            data.messages.splice(0, deleteCount)
        
            const chatRef = database.ref(`chats/${context.params.chatId}`)
            chatRef.update(data)

        } else {
            return null
        }   
    })

exports.deleteEmptyRooms = functions.database.ref("/rooms/{roomId}")
    .onUpdate((change, context) => {
        const dataBefore = change.before.val()
        const dataAfter = change.after.val()

        if(!dataAfter.userList && dataBefore.userList[0]) {
            const roomRef = database.ref(`rooms/${context.params.roomId}`)
            roomRef.remove()
        } else {
            return null
        }
    })

exports.deleteChat = functions.database.ref("/rooms/{roomId}")
    .onDelete(change => {
        const data = change.val()
        const chatRef = database.ref(`chats/${data.chatId}`)
        chatRef.remove()

        return null
})

exports.deleteCanvases = functions.database.ref("/rooms/{roomId}")
    .onDelete((change, context) => {
        const canvasRef = database.ref(`canvases`)
        canvasRef.orderByChild("roomId").equalTo(context.params.roomId).once("value", canvases => {
            canvases.forEach(canvas => {
                if(!canvas.val().isSaved) {
                    database.ref(`canvases/${canvas.key}`).remove()
                }
            })
        })
})

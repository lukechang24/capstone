import React from "react"
import S from "./style"

const ChatLog = (props) => {
    const messageList = props.chatLog.map((message,i) => {
        if(message.createdAt > props.currentUser.joinedAt) {
            if(message.isSpecial) {
                return(
                    <S.MessageContainer className={message.type === "joining" ? "orange bold" : message.type === "leaving" ? "red bold" : message.type === "points" ? "green bold" : "bold"} key={i}>
                        <S.Message>{message.content}</S.Message>
                    </S.MessageContainer>
                )
            } else {
                return(
                <S.MessageContainer key={i}>
                    <S.DisplayName>{message.displayName}: </S.DisplayName>
                    <S.Message>{message.content}</S.Message>
                </S.MessageContainer>
                )
            }
        }
    })
    return(
        <S.ChatBox className="chatbox">
            {messageList}
        </S.ChatBox>
    )
}

export default ChatLog
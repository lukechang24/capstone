import React from "react"
import S from "./style"

const ChatLog = (props) => {
    const messageList = props.chatLog.map((message,i) => {
        if(message.createdAt > props.currentUser.joinedAt) {
            if(message.isSpecial) {
                return(
                    <S.MessageContainer className="bold" key={i}>
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
        <S.ChatBox className="chatlog">
            {messageList}
        </S.ChatBox>
    )
}

export default ChatLog
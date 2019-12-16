import React from "react"
import { NavLink } from "react-router-dom"
import S from "./style"

const RoomList = (props) => {
    const roomList = props.lobbies.map((room, i) => {
        return(
            <S.RoomContainer>
                <S.RoomLink to={`/lobby/${room.id}`} key={i}>
                    <S.RoomName>{room.roomName}</S.RoomName>
                    <p>{room.waiting ? "Waiting..." : "In progress..."}</p>
                    <p>{room.userList.length+room.waitingList.length}/4</p>
                </S.RoomLink>
            </S.RoomContainer>
        )
    })
    return(
        <S.Container1>
            {roomList}
        </S.Container1>
    )
}

export default RoomList
import React from "react"
import { NavLink } from "react-router-dom"
import Filter from "bad-words"
import S from "./style"

const RoomList = (props) => {
    const filter = new Filter()
    const roomList = props.lobbies.map((room, i) => {
        return(
            <S.RoomContainer>
                <S.RoomName onClick={() => {props.sendUserToRoom(room.id)}}>{filter.clean(room.roomName)}</S.RoomName>
                <S.NumOfPlayers>{room.userList.length+room.waitingList.length} / 8</S.NumOfPlayers>
                <S.Phase waiting={room.waiting}>{room.waiting ? "Waiting..." : "In progress..."}</S.Phase>
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
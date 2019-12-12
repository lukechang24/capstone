import React from "react"
import { NavLink } from "react-router-dom"
import S from "./style"

const RoomList = (props) => {
    const lobbyList = props.lobbies.map((lobby, i) => {
        return(
            <S.RoomContainer>
                <S.RoomLink to={`/lobby/${lobby.id}`} key={i}>
                    <S.RoomName>{lobby.roomName}</S.RoomName>
                    <p>{lobby.waiting ? "Waiting..." : "In progress..."}</p>
                    <p>{lobby.users.length}/4</p>
                </S.RoomLink>
            </S.RoomContainer>
        )
    })
    return(
        <S.Container1>
            {lobbyList.length === 0 
                ?
                    <S.NoRoom>No rooms available</S.NoRoom>
                :
                    null
            }
            {lobbyList}
        </S.Container1>
    )
}

export default RoomList
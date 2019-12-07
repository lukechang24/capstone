import React from "react"
import { NavLink } from "react-router-dom"

const LobbyList = (props) => {
    const lobbyList = props.lobbies.map((lobby, i) => {
        return(
            <NavLink to={`/lobby/${lobby.id}`} key={i}>
                <h1>{lobby.roomName}</h1>
                <p>{lobby.users.length}/4</p>
            </NavLink>
        )
    })
    return(
        lobbyList
    )
}

export default LobbyList
import React from "react"
import S from "./style"

const WaitingRoom = (props) => {
    return(
        <S.Container1>
            <button onClick={() => {props.startGame()}}>Start Game</button>
        </S.Container1>
    )
}

export default WaitingRoom
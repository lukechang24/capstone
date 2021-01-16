import styled from "styled-components"

const S = {}

S.ChatBox = styled.div`
    height: 100%;
    background-color: rgb(235, 235, 235);
    border-top: 15px solid black;
    border-color: black;
    padding: 5px 2.5px 0;
    overflow-y: auto;
`
S.MessageContainer = styled.p`
    padding: 2px 0 2px 5px;
    &.bold {
        font-weight: bold;
        color: orange;
        &.red {
            color: #ff0000;
        }
    }
`

S.DisplayName = styled.span`
    font-weight: bold;
`

S.Message = styled.span`
    overflow-wrap: break-word;
`

export default S
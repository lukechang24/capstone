import styled from "styled-components"

const S = {}

S.ChatBox = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgb(235, 235, 235);
    padding: 0.5rem;
    overflow-y: auto;
`
S.MessageContainer = styled.p`
    padding: 0.15rem;
    padding-left: 0.5rem;
    &.bold {
        font-weight: bold;
        color: orange;
    }
`

S.DisplayName = styled.span`
    font-weight: bold;
`

S.Message = styled.span`
    overflow-wrap: break-word;
`

export default S
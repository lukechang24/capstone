import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    &.big {
        width: 65rem;
        display: flex;
        flex-direction: column;
    }
    &.small {
        width: 18rem;
    }
    background-color: rgb(167, 218, 250);
`
S.UserContainer = styled.div`
    &.big {
        height: 90%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }
`

S.Username = styled.h3`
    margin: 1rem;
`

S.Heading = styled.h1`
    text-align: center;
    margin: 1rem;
`

export default S
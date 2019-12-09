import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    &.big {
        width: 65rem;
    }
    &.small {
        width: 18rem;
    }
    background-color: rgb(167, 218, 250);
`

export default S
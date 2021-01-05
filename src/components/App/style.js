import styled from "styled-components"

const S = {}

S.AppContainer = styled.div`
    height: 100vh;
    width: 100vw;
    background-color: lightslategrey;
    display: flex; 
    justify-content: center;
    align-items: center;
`
S.Container1 = styled.div`
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
`

S.ErrorContainer = styled.div`
    position: relative;
    width: 350px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
`

S.Error = styled.h3`
    padding: 40px 15px;
    text-align: center;
    color: red;
`

S.CancelError = styled.i`
    position: absolute;
    right: 7.5px;
    top: 5px;
    &:hover {
        color: red;
    }
`


export default S
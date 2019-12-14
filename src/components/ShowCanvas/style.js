import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 4;
    display: flex;
    justify-content: center;
    align-items: center;
`

S.CanvasContainer = styled.div`
    position: relative;
    height: 45rem;
    width: 45rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(167, 218, 250);
`

S.UtilityLeft = styled.div`
    height: 100%;
    width: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`

S.UtilityRight = styled.div`
    height: 100%;
    width: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`
S.Container2 = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`

S.Canvas = styled.canvas`
`

S.UtilityTop = styled.div`
    height: 5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

S.DrawnByHeading = styled.h3`

`
S.DrawnBy = styled.span`
    font-weight: 400;
`

S.UtilityBottom = styled.div`
    height: 5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`
S.Prompt = styled.h2`
    
`

export default S
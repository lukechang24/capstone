import styled from "styled-components"

const S = {}

S.Canvases = styled.div`
    width: 80%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 25px 0 0;
`

S.CanvasContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 25px 0;
`

S.Canvas = styled.canvas`
    width: 250px;
    height: auto;
`

S.Prompt = styled.h3`
    margin: 0 0 15px;
`

export default S
import styled from "styled-components"

const S = {}

S.VoteForm = styled.form`
    font-family: 'Fjalla One', sans-serif;
    &.hide {
        display: none;
    }
`

S.VoteButton = styled.button`
    font-family: 'Fjalla One', sans-serif;
    font-size: 20px;
    color: white;
    background-color: #005B9A;
    padding: 5px 10px;
    border: none;
    border-radius: 2.5px;
    margin: 0 10px;
    &:hover {
        background-color: skyblue;
    }
`

S.Bold = styled.span`
    color: white;
    font-weight: bolder;
`

export default S
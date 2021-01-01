import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

S.SignInForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border: 3px solid black;
    border-radius: 25px;
    box-shadow: 10px 10px 20px rgb(46,47,51);
`

S.Heading = styled.h2`
    margin: 15px 0;   
`

S.InputTitle = styled.p`
    width: 256px;
    font-size: 13px;
    text-align: left;
    line-height: normal;
    /* padding: 1.5px; */
    margin: 10px 25px 5px;
`

S.Input = styled.input`
    height: 20px;
    width: 250px;
    padding: 1.5px;
    border: 2px solid lightgray;
    border-radius: 5px;
    margin: 0 25px 5px;
`

S.Submit = styled.button`
    height: 25px;
    width: 256px;
    margin: 25px 25px 50px;
`

S.Link = styled.a`
    width: 90%;
    font-size: 12.5px;
    text-align: center;
    color: red;
    margin-bottom: 15px;
`

S.Error = styled.span`
    width: 256px;
    font-size: 10px;
    color: red;
    &.hide {
        visibility: hidden;
    }
`

S.Warning = styled.span`
    color: red;
    font-size: 10px;
    font-weight: 600;
`

export default S
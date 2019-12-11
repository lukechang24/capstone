import React, { Component } from "react"
import S from "./style"

class PromptSelection extends Component {
    state = {
        promptList: [],
        chosenPrompt: {
            verb: "",
            adjective: "",
            noun: ""
        }
    }
    componentDidMount() {
        const givenPrompts = this.props.currentUser.givenPrompts
        const nouns = givenPrompts.nouns.map((noun,i) => {
            return(
                <S.SelectOption key={i}>{noun}</S.SelectOption>
            )
        })
        const verbs = givenPrompts.verbs.map((verb,i) => {
            return(
                <S.SelectOption key={i}>{verb}</S.SelectOption>
            )
        })
        const adjectives = givenPrompts.adjectives.map((adjective,i) => {
            return(
                <S.SelectOption key={i}>{adjective}</S.SelectOption>
            )
        })
        const nounSelection = <S.SelectContainer key={0} name="noun" onChange={this.handleChange}>{nouns}</S.SelectContainer>
        const verbSelection = <S.SelectContainer key={1} name="verb" onChange={this.handleChange}>{verbs}</S.SelectContainer>
        const adjectiveSelection = <S.SelectContainer key={2} name="adjective" onChange={this.handleChange}>{adjectives}</S.SelectContainer>
        const promptOptions = [verbSelection, adjectiveSelection, nounSelection]
        console.log(this.props.currentUser.givenPrompts.adjectives, "given")
        this.setState({
            promptList: promptOptions,
            chosenPrompt: {
                verb: this.props.currentUser.givenPrompts.verbs[0],
                adjective: this.props.currentUser.givenPrompts.adjectives[0],
                noun: this.props.currentUser.givenPrompts.nouns[0],
            }
        })
    }
    handleChange = e => {
        console.log(e.target.value)
        this.setState({
            chosenPrompt: {
                ...this.state.chosenPrompt,
                [e.target.name]: e.target.value
            } 
        })
    }
    render() {
        const { verb, adjective, noun } = this.state.chosenPrompt
        const phrase = `${verb} ${adjective} ${noun}`
        return(
            <S.Container1>
                {console.log(this.state.chosenPrompt)}
                <S.SelectionForm>
                    <S.Heading>Create your prompt</S.Heading>
                    <S.Container2>
                        {this.state.promptList}
                    </S.Container2>
                    <S.ChosenWord>{phrase}</S.ChosenWord>
                </S.SelectionForm>
            </S.Container1>
        )
    }
}

export default PromptSelection
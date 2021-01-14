import React, { Component } from "react"
import { withFirebase } from "../Firebase"
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
        const nouns = !givenPrompts.nouns ? null : givenPrompts.nouns.map((noun,i) => {
            return(
                <S.SelectOption key={i}>{noun}</S.SelectOption>
            )
        })
        const verbs = !givenPrompts.verbs ? null : givenPrompts.verbs.map((verb,i) => {
            return(
                <S.SelectOption key={i}>{verb}</S.SelectOption>
            )
        })
        const adjectives = !givenPrompts.adjectives ? null : givenPrompts.adjectives.map((adjective,i) => {
            return(
                <S.SelectOption key={i}>{adjective}</S.SelectOption>
            )
        })
        const nounSelection = <S.SelectContainer key={0} name="noun" onChange={this.handleChange}>{nouns}</S.SelectContainer>
        const verbSelection = <S.SelectContainer key={1} name="verb" onChange={this.handleChange}>{verbs}</S.SelectContainer>
        const adjectiveSelection = <S.SelectContainer key={2} name="adjective" onChange={this.handleChange}>{adjectives}</S.SelectContainer>
        const promptOptions = [verbSelection, adjectiveSelection, nounSelection]
        this.setState({
            promptList: promptOptions,
            chosenPrompt: {
                verb: this.props.currentUser.givenPrompts.verbs[0],
                adjective: this.props.currentUser.givenPrompts.adjectives[0],
                noun: this.props.currentUser.givenPrompts.nouns[0],
            }
        }, () => {
            const { verb, adjective, noun } = this.state.chosenPrompt
            const phrase = `${verb} ${adjective} ${noun}`
            this.props.firebase.findUser(this.props.currentUser.id).update({chosenPrompt: phrase})
        })
    }
    handleChange = e => {
        this.setState({
            chosenPrompt: {
                ...this.state.chosenPrompt,
                [e.target.name]: e.target.value
            } 
        }, () => {
            const { verb, adjective, noun } = this.state.chosenPrompt
            const phrase = `${verb} ${adjective} ${noun}`
            this.props.firebase.findUser(this.props.currentUser.id).update({chosenPrompt: phrase})
        })
    }
    render() {
        const { verb, adjective, noun } = this.state.chosenPrompt
        const phrase = `${verb} ${adjective} ${noun}`
        return(
            <S.Container1>
                <S.SelectionForm>
                    <S.Heading>Create your prompt</S.Heading>
                    <S.Container2>
                        {this.state.promptList}
                    </S.Container2>
                    <S.ChosenWordHeader>
                        Your Prompt: <S.ChosenWord>{phrase}</S.ChosenWord>
                    </S.ChosenWordHeader>
                </S.SelectionForm>
            </S.Container1>
        )
    }
}

export default withFirebase(PromptSelection)
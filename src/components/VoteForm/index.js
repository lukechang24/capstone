import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class VoteForm extends Component {
    state = {
        promptList: [],
        answer: {
            verb: "",
            adjective: "",
            noun: ""
        },
    }
    componentDidMount() {
        const promptOptions = this.props.promptOptions
        const nouns = !promptOptions.nouns ? null : promptOptions.nouns.map((noun,i) => {
            return(
                <S.SelectOption key={i}>{noun}</S.SelectOption>
            )
        })
        const verbs = !promptOptions.verbs ? null : promptOptions.verbs.map((verb,i) => {
            return(
                <S.SelectOption key={i}>{verb}</S.SelectOption>
            )
        })
        const adjectives = !promptOptions.adjectives ? null : promptOptions.adjectives.map((adjective,i) => {
            return(
                <S.SelectOption key={i}>{adjective}</S.SelectOption>
            )
        })
        const nounSelection = 
        <S.SelectContainer key={0}>
            <S.Select name="noun" onChange={this.handleChange}>
                {nouns}
            </S.Select>
            <S.SelectPoints>+50pts</S.SelectPoints>
        </S.SelectContainer>
        const verbSelection = 
        <S.SelectContainer key={1}>
            <S.Select name="verb" onChange={this.handleChange}>
                {verbs}
            </S.Select>
            <S.SelectPoints>+100pts</S.SelectPoints>
        </S.SelectContainer>
        const adjectiveSelection = 
        <S.SelectContainer key={2}>
            <S.Select name="adjective" onChange={this.handleChange}>
                {adjectives}
            </S.Select>
            <S.SelectPoints>+100pts</S.SelectPoints>
        </S.SelectContainer>
        const promptList = [verbSelection, adjectiveSelection, nounSelection]
        this.setState({
            promptList: promptList,
            answer: {
                verb: this.props.promptOptions.verbs[0],
                adjective: this.props.promptOptions.adjectives[0],
                noun: this.props.promptOptions.nouns[0],
            }
        }, () => {
            const { verb, adjective, noun } = this.state.answer
            const phrase = `${verb} ${adjective} ${noun}`
            this.props.firebase.findUser(this.props.currentUser.id).update({answer: phrase})
        })
    }
    handleChange = e => {
        this.setState({
            answer: {
                ...this.state.answer,
                [e.target.name]: e.target.value
            } 
        }, () => {
            const { verb, adjective, noun } = this.state.answer
            const phrase = `${verb} ${adjective} ${noun}`
            this.props.firebase.findUser(this.props.currentUser.id).update({answer: phrase})
        })
    }
    render() {
        const { verb, adjective, noun } = this.state.answer
        const phrase = `${verb} ${adjective} ${noun}`
        return(
            <S.Container1>
                <S.SelectionForm>
                    <S.Heading>What was {this.props.currentCanvas.displayName}'s prompt?</S.Heading>
                    <S.Container2>
                        {this.state.promptList}
                    </S.Container2>
                    <S.ChosenWordHeader>
                        Your answer: <S.ChosenWord>{phrase}</S.ChosenWord>
                    </S.ChosenWordHeader>
                </S.SelectionForm>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(VoteForm))
import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class VoteForm extends Component {
    state = {
        answer: {
            verb: "",
            adjective: "",
            noun: ""
        }
    }
    componentDidMount() {
        this.setState({
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
                [e.target.getAttribute("name")]: e.target.innerHTML
            }
        }, () => {
            console.log(this.state.answer)
            const { verb, adjective, noun } = this.state.answer
            const phrase = `${verb} ${adjective} ${noun}`
            this.props.firebase.findUser(this.props.currentUser.id).update({answer: phrase})
        })
    }
    render() {
        const givenPrompts = this.props.promptOptions
        const nouns = givenPrompts.nouns.map((noun, i) => {
            return(
                <S.Word className={this.state.answer.noun === noun ? "selected" : ""} name="noun" onClick={this.handleChange} key={i}>{noun}</S.Word>
            )
        })
        const verbs = givenPrompts.verbs.map((verb, i) => {
            return(
                <S.Word className={this.state.answer.verb === verb ? "selected" : ""} name="verb" onClick={this.handleChange} key={i}>{verb}</S.Word>
            )
        })
        const adjectives = givenPrompts.adjectives.map((adjective, i) => {
            return(
                <S.Word className={this.state.answer.adjective === adjective ? "selected" : ""} name="adjective" onClick={this.handleChange}>{adjective}</S.Word>
            )
        })
        const { verb, adjective, noun } = this.state.answer
        const phrase = `${verb} ${adjective} ${noun}`
        return(
            <S.Container1>
                <S.SelectionForm>
                    <S.Heading>Select the combination of words that you think match {this.props.currentCanvas.displayName}'s drawing.</S.Heading>
                    <S.Container2>
                        <S.WordContainer>
                            <S.Points>(100pts)</S.Points>
                            {verbs}
                        </S.WordContainer>
                        <S.WordContainer>
                            <S.Points>(100pts)</S.Points>
                            {adjectives}
                        </S.WordContainer>
                        <S.WordContainer>
                            <S.Points>(50pts)</S.Points>
                            {nouns}
                        </S.WordContainer>
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
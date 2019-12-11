import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class PromptForm extends Component {
    state = {
        prompt: {
            noun: "",
            verb: "",
            adjective: ""
        }
    }
    handleInput = e => {
        this.setState({
            prompt: {
                ...this.state.prompt,
                [e.target.name]: e.target.value
            }
        })
    }
    handleSubmit = e => {
        e.preventDefault()
        if(!this.state.prompt.noun || !this.state.prompt.verb || !this.state.prompt.adjective) {
            return
        }
        this.props.firebase.findRoom(this.props.match.params.id).get()
            .then(snapshot => {
                console.log(snapshot.data(), "currroomt")
                const { noun, verb, adjective } = this.state.prompt
                const updatedNouns = [...snapshot.data().prompts.nouns, noun]
                const updatedVerbs = [...snapshot.data().prompts.verbs, verb]
                const updatedAdjectives = [...snapshot.data().prompts.adjectives, adjective]
                this.props.firebase.findRoom(snapshot.id).update({
                    prompts: {
                        nouns: updatedNouns,
                        verbs: updatedVerbs,
                        adjectives: updatedAdjectives
                    }
                }).then(() => {
                    this.setState({
                        prompt: {
                            noun: "",
                            verb: "",
                            adjective: ""
                        }
                    })
                })
            })
    }
    render() {
        return(
            <S.Container1>
                <S.PromptForm onSubmit={this.handleSubmit}>
                    <S.PromptHeading>Fill in the prompts below</S.PromptHeading>
                    <S.Container2>
                        <S.Grammer>Noun</S.Grammer><S.PromptInput name="noun" value={this.state.prompt.noun} onChange={this.handleInput}></S.PromptInput>
                        <S.Grammer>Verb ending in '-ing'</S.Grammer> <S.PromptInput name="verb" value={this.state.prompt.verb} onChange={this.handleInput}></S.PromptInput>
                        <S.Grammer>Adjective</S.Grammer> <S.PromptInput name="adjective" value={this.state.prompt.adjective} onChange={this.handleInput}></S.PromptInput>
                        <S.SubmitPrompt type="submit" value="Submit"></S.SubmitPrompt>
                    </S.Container2>
                </S.PromptForm>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(PromptForm))
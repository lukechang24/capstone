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
        if((!this.state.prompt.noun && this.props.phase === "writeNouns") || (!this.state.prompt.verb && this.props.phase === "writeVerbs") || (!this.state.prompt.adjective && this.props.phase === "writeAdjectives")) {
            return
        }
        this.props.firebase.findRoom(this.props.match.params.id).get()
            .then(snapshot => {
                const { noun, verb, adjective } = this.state.prompt
                if(this.props.phase === "writeNouns") {
                    const updatedNouns = [...snapshot.data().prompts.nouns, noun]
                    const uniqueNouns = [...new Set(updatedNouns)]
                    this.props.firebase.findRoom(snapshot.id).update({
                        prompts: {
                            ...snapshot.data().prompts,
                            nouns: uniqueNouns
                        }
                    })
                } else if(this.props.phase === "writeVerbs") {
                    const updatedVerbs = [...snapshot.data().prompts.verbs, verb]
                    const uniqueVerbs = [...new Set(updatedVerbs)]
                    this.props.firebase.findRoom(snapshot.id).update({
                        prompts: {
                            ...snapshot.data().prompts,
                            verbs: uniqueVerbs
                        }
                    })
                } else if(this.props.phase === "writeAdjectives") {
                    const updatedAdjectives = [...snapshot.data().prompts.adjectives, adjective]
                    const uniqueAdjectives = [...new Set(updatedAdjectives)]
                    this.props.firebase.findRoom(snapshot.id).update({
                        prompts: {
                            ...snapshot.data().prompts,
                            adjectives: uniqueAdjectives
                        }
                    })
                }
                this.setState({
                        prompt: {
                            noun: "",
                            verb: "",
                            adjective: ""
                        }
                    })
            })
    }
    render() {
        return(
            <S.Container1>
                <S.PromptForm onSubmit={this.handleSubmit}>
                    <S.PromptHeading>Submit as many words as you can</S.PromptHeading>
                        {this.props.phase === "writeNouns"
                            ?
                                <S.GrammerContainer>
                                    <S.Grammer>A noun</S.Grammer>
                                    <S.PromptInput name="noun" value={this.state.prompt.noun} onChange={this.handleInput}></S.PromptInput>
                                </S.GrammerContainer>
                            :
                        this.props.phase === "writeVerbs"
                            ?
                                <S.GrammerContainer>
                                    <S.Grammer>A verb ending in '-ing'</S.Grammer>
                                    <S.PromptInput name="verb" value={this.state.prompt.verb} onChange={this.handleInput}></S.PromptInput>
                                </S.GrammerContainer>
                            :
                        this.props.phase === "writeAdjectives"
                            ?
                                <S.GrammerContainer>
                                    <S.Grammer>An adjective</S.Grammer>
                                    <S.PromptInput name="adjective" value={this.state.prompt.adjective} onChange={this.handleInput}></S.PromptInput>
                                </S.GrammerContainer>
                            :
                                null
                        }
                        <S.SubmitPrompt type="submit" value="Submit"></S.SubmitPrompt>
                </S.PromptForm>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(PromptForm))
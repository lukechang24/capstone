import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class VoteForm extends Component {
    state = {
        isAccurate: null,
        voted: false,
    }
    handleSubmit = e => {
        e.preventDefault()
        this.setState({
            isAccurate: e.target.name,
            voted: true,
        }, () => {
            this.props.firebase.findCanvases(this.props.match.params.id).where("userId", "==", this.props.currentCanvas.userId).get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        this.props.firebase.findCanvas(doc.id).update({votes: [...doc.data().votes, this.state.isAccurate]})
                    })
                })
        })
    }
    render() {
        return(
            <S.VoteForm className={this.state.voted ? "hide" : ""}>
                <S.VoteButton className={this.state.accurate ? "selected" : ""} name="accurate" onClick={(e) => {this.handleSubmit(e)}} disabled={this.state.voted}>ACCURATE</S.VoteButton>
                <S.Bold>OR</S.Bold>
                <S.VoteButton className={this.state.accurate ? "selected" : ""} name="naw" onClick={(e) => {this.handleSubmit(e)}} disabled={this.state.voted}>NAH</S.VoteButton>
            </S.VoteForm>
        )
    }
}

export default withRouter(withFirebase(VoteForm))
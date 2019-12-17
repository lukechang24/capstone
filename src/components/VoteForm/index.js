import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class VoteForm extends Component {
    state = {
        isAccurate: null,
        voted: false
    }
    handleSubmit = e => {
        e.preventDefault()
        this.setState({
            isAccurate: e.target.name,
            voted: true 
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
            <S.VoteForm>
                <button className={this.state.accurate ? "selected" : ""} name="accurate" onClick={(e) => {this.handleSubmit(e)}} disabled={this.state.voted}>Accurate</button>
                <span>or</span>
                <button className={this.state.accurate ? "selected" : ""} name="naw" onClick={(e) => {this.handleSubmit(e)}} disabled={this.state.voted}>Naw</button>
            </S.VoteForm>
        )
    }
}

export default withRouter(withFirebase(VoteForm))
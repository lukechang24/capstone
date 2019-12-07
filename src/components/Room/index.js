import React, { Component } from "react"
import Draw1 from "../Draw1"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
 
class Room extends Component {
    componentDidMount() {
        const updatedUser = {currentRoomId: this.props.match.params.id}
        console.log(updatedUser, "updated")
        this.props.setCurrentUser(updatedUser)
    }
    render() {
        console.log(this.props.currentUser, "props")
        return(
            <Draw1 currentUser={this.props.currentUser}/>
        )
    }
}

export default withRouter(withFirebase(Room))
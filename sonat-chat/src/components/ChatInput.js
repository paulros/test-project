import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PouchDB from 'pouchdb-core';
import {Button, Input, InputGroup, InputGroupAddon} from "reactstrap";

class ChatInput extends Component {


  constructor(props) {
    super(props);
    this.state = {
      sending: false
    }
  }

  notifyWriting(isWriting) {
    const db = this.props.database;
    const userId = this.props.userId;

    db.get(userId).then(function (doc) {
      return db.put({
        ...doc,
        writing: !!isWriting,
      });
    }).then(function (response) {
      // handle response
    }).catch(function (err) {
      console.log(err);
    });
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Set state to sending and send.
      this.setState({sending: true}, () => {
        this.sendMessage(this.state.message);
      })
    }
  }

  sendMessage(message) {
    const db = this.props.database;
    const user = this.props.user;

    db.post({
      type: "message",
      user: user,
      sentAt: Date.now(),
      message: message
    }).catch(error => {
      console.log(error);
    }).finally(() => {
      this.setState({sending: false, message: ""});
    });

  }

  render() {
    return (
      <InputGroup>
        <Input
          autoFocus ref={input => input && input.focus()}
          disabled={!this.props.database || this.state.sending}
          value={this.state.message}
          onChange={e => this.setState({message: e.target.value})}
          onKeyPress={e => this.handleKeyPress(e)}
        />
        <InputGroupAddon addonType="append">
          <Button disabled={this.state.sending} color="secondary">Send</Button>
        </InputGroupAddon>
      </InputGroup>
    );
  }
}

ChatInput.propTypes = {
  database: PropTypes.instanceOf(PouchDB).isRequired,
  user: PropTypes.object.isRequired
};

export default ChatInput;
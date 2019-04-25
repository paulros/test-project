import React, {Component} from 'react';
import PropTypes from "prop-types";
import PouchDB from "pouchdb-core";

const Message = ({message, name}) => (
  <div ><b>{name}</b>: {message}</div>
);

class Messages extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: []
    }
  }

  componentDidMount() {
    let db = this.props.database;
    this.messageListener = db.changes({
      live: true,
      include_docs: true,
      since: 0,
      timeout: false
    }).on('change', change => {
      if (change.doc.type !== "message")
        return;

      this.setState(prevState => {
        return {
          messages: [...prevState.messages, change.doc]
        }
      })
    }).on('error', err => {
      console.log(err);
    });
  }

  componentWillUnmount() {
    if (this.messageListener) {
      this.messageListener.cancel();
    }
  }

  render() {
    return (
      <div>
        {this.state.messages.map((value, idx) => (
          <Message key={idx} message={value.message} name={value.user.name} />
        ))}
      </div>
    );
  }
}

Messages.propTypes = {
  database: PropTypes.instanceOf(PouchDB).isRequired,
  user: PropTypes.object.isRequired
};

export default Messages;
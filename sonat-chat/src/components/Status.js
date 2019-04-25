import React, {Component} from 'react';
import {Alert, Button, Form, FormGroup, Input, Label, Modal, ModalBody} from "reactstrap";
import PropTypes from 'prop-types';

import HttpPlugin from 'pouchdb-adapter-http'
import DebugPlugin from 'pouchdb-debug';
import PouchDB from 'pouchdb-core';
import FindPlugin from 'pouchdb-find';

PouchDB.plugin(DebugPlugin);
PouchDB.debug.enable('*');
PouchDB.plugin(HttpPlugin);
PouchDB.plugin(FindPlugin);

const user = {
  _id: "...",
  type: "user",
  name: "Hadrien",
  lastSeen: new Date(),
  status: "",
  online: true
};

const message = {
  _id: "...",
  type: "message",
  user: {
    _id: "....",
    name: "Hadrien"
  },
  sentAt: new Date(),
  message: "Blabla"
};

/**
 * A component that either let the user connect to a database
 * or displays the status of the connection to the database.
 */
class Status extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: "DISCONNECTED",
      url: "http://localhost:5984/sonat-chat"
    }
  }

  componentWillUnmount() {
    if (this.db) {
      this.db.close();
    }
  }

  /**
   * Example of async/await functions.
   *
   * - await waits for the result of a promise.
   * - async returns a promise (see getDatabase()).
   * - await can only be used in an async function.
   */
  async login(userName) {
    let {docs: [user]} = await this.database.find({
      selector: {
        name: {$eq: userName}
      }
    });
    let created;
    if (user) {
      // If user exists, update.
      created = await this.database.put({
        ...user,
        online: true,
        lastSeen: Date.now()
      });
    } else {
      // Create otherwise.
      created = await this.database.post({
        name: userName,
        type: "user",
        online: true,
        lastSeen: Date.now()
      });
    }
    return await this.database.get(created.id);
  }

  // Database creation is synchronous, wrap so it's consistent with calls.
  getDatabase(url) {
    const options = {};
    return new Promise((resolve, reject) => {
      try {
        this.database = new PouchDB(url, options);
        resolve(this.database);
      } catch (e) {
        reject(e);
      }
    });
  }

  async connect(event) {
    event.preventDefault();

    this.setState({step: "CONNECTING"});
    try {
      const db = await this.getDatabase(this.state.url);
      const info = await db.info();
      const user = await this.login(this.state.name);

      this.setState({step: "CONNECTED", info}, () => {
        this.props.onConnect(db, user);
      });

    } catch (error) {
      this.setState({step: "ERROR", error});
    }
  }

  disconnect() {
    this.setState({step: "DISCONNECTED"}, () => {
      if (this.db) {
        this.db.close();
      }
    });
  }

  render() {
    const step = this.state.step;
    return (
      <div>
        {step === "CONNECTED"
          ? (
            <Alert color="success">
              <h4>Connected</h4>
              <hr/>
              <p>
                <span>Database: {this.state.info.db_name}</span><br />
                <span># of documents: {this.state.info.doc_count}</span><br />
                <span>Update sequence: {this.state.info.update_seq}</span><br />
              </p>
              <Button color="link" onClick={() => this.disconnect()}>disconnect</Button>
            </Alert>
          )
          : <Button onClick={() => this.setState({step: "MODAL"})}>connect</Button>
        }

        {step === "ERROR" && (
          <Alert color="danger">
            <h4>Failed to connect</h4>
            <hr/>
            <p>{this.state.error.message}</p>
          </Alert>
        )}

        <Modal isOpen={this.state.step === "MODAL"} toggle={this.toggle}>
          <ModalBody>
            <Form onSubmit={e => this.connect(e)}>
              <FormGroup>
                <Label for="databaseUrl">Database</Label>
                <Input type="url" name="url" id="databaseUrl"
                       value={this.state.url}
                       onChange={e => this.setState({url: e.target.value})}
                />
                <Label for="userName">Name</Label>
                <Input type="text" name="name" id="userName"
                       value={this.state.name}
                       onChange={e => this.setState({name: e.target.value})}
                />
              </FormGroup>
              <Button>Connect</Button>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

Status.propTypes = {
  onConnect: PropTypes.func.isRequired
};

export default Status;
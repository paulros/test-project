import React, {Component} from 'react';
import './App.css';
import {Col, Container, Row} from "reactstrap";
import Status from "./components/Status";
import People from "./components/People";
import Messages from "./components/Messages";
import ChatInput from "./components/ChatInput";

import sonatLogo from './logo.png';

class App extends Component {


  constructor(props) {
    super(props);
    this.state = {
      database: false,
      user: false
    }
  }

  render() {
    return (
      <Container className="App d-flex h-100 flex-column" fluid>
        <Row>
          <Col md={12}>
            <img src={sonatLogo} alt="Sonat Consulting"/>
          </Col>
        </Row>
        <Row className="flex-fill">
          <Col md={9}>
            {this.state.database && <Messages database={this.state.database} user={this.state.user}/>}
          </Col>
          <Col md={3}>
            <Status onConnect={(database, user) => this.setState({database, user})}/>
            {this.state.database && <People database={this.state.database} user={this.state.user}/>}
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <ChatInput database={this.state.database} user={this.state.user}/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;

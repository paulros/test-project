import React, {Component} from 'react';
import Person from "./Person";
import PropTypes from "prop-types";
import PouchDB from "pouchdb-core";

/**
 * Maintain its own state querying the database.
 */
class People extends Component {
  render() {
    return (
      <div>
        <Person/>
        <Person/>
        <Person/>
      </div>
    );
  }
}

People.propTypes = {
  database: PropTypes.instanceOf(PouchDB).isRequired,
  user: PropTypes.object.isRequired
};

export default People;

import React, {Component} from 'react';
import {Media} from "reactstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser} from "@fortawesome/free-solid-svg-icons";

/**
 * Example of  "higher-order" components.
 *
 * Higher order/lambda/you name it. It is just a fancy way
 * to say that a function has no side effect => Idempotent.
 */
const Avatar = () => {
  return (
    <Media left href="#">
      <FontAwesomeIcon icon={faUser}/>
    </Media>
  )
};

/**
 * Another construct, using destructuring; a new javascript notation:
 * the function () => expression uses {name, status} as variable parameter.
 *
 * One can also write:
 *
 * let object = {
 *   var1: 1,
 *   var2: 2
 * };
 * let {var1, var2} = object;
 *
 * And var1, var2 will contain 1 and 2, respectively.
 */
const Description = ({name, status}) => (
  <Media body>
    <p>{name}</p>
    <p>{status}</p>
  </Media>
);

const exampleData = [{
  name: "Hadrien",
  status: "Online"
}, {
  name: "Hadrien",
  status: "Online"
}];

/**
 * Note how we are using component defined in the same file
 * and ...rest notations.
 */
class Person extends Component {
  render() {
    return (
      <div>
        {exampleData.map(({name, ...otherProps}, i) => (
          <div>
            <Avatar/>
            <Description name={name} { ...otherProps} />
          </div>
        ))}
      </div>
    );
  }
}

export default Person;

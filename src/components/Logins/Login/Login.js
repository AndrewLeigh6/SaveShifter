import React from "react";
import PropTypes from "prop-types";

const Login = (props) => {
  const loginForm = (
    <form onSubmit={(event) => props.submit(event, props.accountNo)}>
      <p> {props.accountNo} account login</p>
      <input
        type="text"
        name={props.accountNo + "Username"}
        id={props.accountNo + "Username"}
        placeholder="username"
      />
      <input
        type="password"
        name={props.accountNo + "Password"}
        id={props.accountNo + "Password"}
        placeholder="password"
      />
      <input type="submit" value="Submit" />
    </form>
  );

  return <div>{props.requester === null ? loginForm : null}</div>;
};

Login.propTypes = {
  requester: PropTypes.array,
  submit: PropTypes.func.isRequired,
  accountNo: PropTypes.string.isRequired,
};

export default Login;

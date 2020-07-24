import React from "react";
import PropTypes from "prop-types";

const Login = (props) => {
  if (props.savedPosts.length === 0) {
    return (
      <div>
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
      </div>
    );
  } else {
    return null;
  }
};

Login.propTypes = {
  savedPosts: PropTypes.array.isRequired,
  submit: PropTypes.func.isRequired,
  accountNo: PropTypes.string.isRequired,
};

export default Login;

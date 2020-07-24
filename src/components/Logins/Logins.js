import React from "react";
import PropTypes from "prop-types";

import Login from "./Login/Login";

const Logins = (props) => {
  return (
    <React.Fragment>
      <Login
        accountNo="first"
        submit={props.submit}
        requester={props.firstAccountRequester}
      />
      <Login
        accountNo="second"
        submit={props.submit}
        requester={props.secondAccountRequester}
      />
    </React.Fragment>
  );
};

Logins.propTypes = {
  submit: PropTypes.func.isRequired,
  firstAccountRequester: PropTypes.object,
  secondAccountRequester: PropTypes.object,
};

export default Logins;

import React from "react";
import PropTypes from "prop-types";

import Login from "./Login/Login";

const Logins = (props) => {
  return (
    <React.Fragment>
      <Login accountNo="first" savedPosts={props.posts} submit={props.submit} />
      <Login
        accountNo="second"
        savedPosts={props.posts}
        submit={props.submit}
      />
    </React.Fragment>
  );
};

Logins.propTypes = {
  posts: PropTypes.array.isRequired,
  submit: PropTypes.func.isRequired,
};

export default Logins;

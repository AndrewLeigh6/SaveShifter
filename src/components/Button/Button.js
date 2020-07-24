import React from "react";
import PropTypes from "prop-types";
import classes from "./Button.module.scss";

const Button = (props) => {
  return (
    <a
      href={props.link}
      target="_blank"
      rel="noopener noreferrer"
      className={classes.Button}
      onClick={props.clicked}
      disabled={props.disabled}
    >
      {props.children}
    </a>
  );
};

Button.propTypes = {
  link: PropTypes.string,
  clicked: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default Button;

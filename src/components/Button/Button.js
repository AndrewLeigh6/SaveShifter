import React from "react";
import classes from "./Button.module.scss";

const Button = (props) => {
  return (
    <a
      href={props.link}
      target="_blank"
      rel="noopener noreferrer"
      className={classes.Button}
      onClick={props.clicked}
    >
      <div>{props.children}</div>
    </a>
  );
};

export default Button;

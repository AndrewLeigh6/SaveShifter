import React from "react";
import PropTypes from "prop-types";

import Button from "../Button/Button";

const CopySavedPosts = (props) => {
  const savingPosts = (
    <React.Fragment>
      <p> Saving posts...</p>
      <p>
        Posts saved: {props.postsSaved} / {props.filteredPostIds.length}
      </p>
    </React.Fragment>
  );

  if (props.postsSaved !== props.filteredPostIds.length) {
    return (
      <React.Fragment>
        <Button clicked={props.copySavedPostsHandler} disabled={props.isSaving}>
          Begin saving posts to second account
        </Button>
        <p>
          This may take some time, as the Reddit API has a rate limit of 30
          requests per minute. This means we can only save one post every 2
          seconds.
        </p>
        {props.isSaving ? savingPosts : null}
      </React.Fragment>
    );
  }

  return null;
};

CopySavedPosts.propTypes = {
  postsSaved: PropTypes.number.isRequired,
  filteredPostIds: PropTypes.array.isRequired,
  copySavedPostsHandler: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
};

export default CopySavedPosts;

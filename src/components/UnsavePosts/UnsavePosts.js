import React from "react";
import PropTypes from "prop-types";

import Button from "../Button/Button";

const UnsavePosts = (props) => {
  const unsavingPosts = (
    <React.Fragment>
      <p> Removing posts...</p>
      <p>
        Posts removed: {props.postsUnsaved} / {props.filteredPostIds.length}
      </p>
    </React.Fragment>
  );
  if (
    props.postsSaved === props.filteredPostIds.length &&
    props.postsSaved !== 0
  ) {
    return (
      <div>
        <Button clicked={props.removeSavedPostsHandler}>
          5. Remove saved posts from original account
        </Button>
        <p> Saving complete!</p>
        <p>
          If you just wanted to copy your posts, you're done! However, if you
          want to remove the posts from your original account, please click the
          button above to proceed
        </p>
        {props.isUnsaving ? unsavingPosts : null}
      </div>
    );
  }

  return null;
};

UnsavePosts.propTypes = {
  postsUnsaved: PropTypes.number,
  filteredPostIds: PropTypes.array,
  removeSavedPostsHandler: PropTypes.func,
  isUnsaving: PropTypes.bool,
};

export default UnsavePosts;

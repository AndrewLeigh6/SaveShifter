import React from "react";
import classes from "./Posts.module.css";

const Posts = (props) => {
  console.log("post props", props);
  const posts = props.posts.map((post) => {
    if (post.preview != null) {
      const url = post.preview.images[0].resolutions[0].url;
      return (
        <React.Fragment key={post.id}>
          <div className={classes.Thumbnail}>
            <img src={url} alt={post.title} />
          </div>
          <div className={classes.Title}>
            <p>{post.title}</p>
          </div>
        </React.Fragment>
      );
    }
    return null;
  });

  const renderPosts = () => {
    if (props.posts.length !== 0) {
      return (
        <React.Fragment>
          <h3> Here are your saved posts</h3>
          <div className={classes.PostsList}>{posts}</div>
        </React.Fragment>
      );
    }
    return null;
  };

  const renderLoading = () => {
    if (props.isLoading) {
      return <p>Loading...</p>;
    }

    return null;
  };

  return (
    <div className={classes.SavedPosts}>
      {renderLoading()}
      {renderPosts()}
    </div>
  );
};

export default Posts;

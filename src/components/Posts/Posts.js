import React from "react";
import classes from "./Posts.module.css";

const Posts = (props) => {
  const posts = props.posts.map((post) => {
    if (post.thumbnail && post.thumbnail.includes("https")) {
      return (
        <React.Fragment key={post.id}>
          <div className={classes.Thumbnail}>
            <img src={post.thumbnail} alt={post.title} />
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
          <h3> {props.username}, here are your saved posts</h3>
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

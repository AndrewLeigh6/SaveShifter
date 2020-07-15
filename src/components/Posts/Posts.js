import React from "react";
import classes from "./Posts.module.css";

const Posts = (props) => {
  const posts = props.posts.map((post) => {
    if (post.thumbnail.includes("https")) {
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
          <h3> Here are your saved posts</h3>
          <div className={classes.PostsList}>{posts}</div>
        </React.Fragment>
      );
    }
    return null;
  };

  const renderLoading = () => {
    const length = props.posts.length;
    const code = new URL(window.location.href).searchParams.get("code");

    if (length === 0 && code != null) {
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

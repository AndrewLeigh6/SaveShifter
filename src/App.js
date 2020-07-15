import React, { useEffect, useState } from "react";
import "./App.scss";

import { getAuthUrl, fromAuthCode } from "./helpers/helpers";
import Posts from "./components/Posts/Posts";
import Button from "./components/Button/Button.js";

// auth user into their second account

// loop through the list of filtered post ids and save them

// optionally unsave posts from the original account

/* TODO

-refactor requester
-add tests for button conditionals

*/

function App() {
  const [savedPosts, setSavedPosts] = useState([]);
  const [filteredPosts, setfilteredPosts] = useState([]);
  const [filteredPostIds, setfilteredPostIds] = useState([]);
  const [authingSecondAccount, setAuthingSecondAccount] = useState(false);
  const [secondAccountAuthed, setSecondAccountAuthed] = useState(false);

  useEffect(() => {
    const getSavedPosts = async () => {
      const code = new URL(window.location.href).searchParams.get("code");

      if (code != null) {
        try {
          var requester = await fromAuthCode(code);
        } catch (error) {
          console.log(error);
          window.location = "http://localhost:3000";
        }

        try {
          var savedPosts = await requester
            .getMe()
            .getSavedContent()
            .fetchMore(75);
          console.log(savedPosts);
          setSavedPosts(savedPosts);
        } catch (error) {
          console.log(error);
        }
      }
    };

    getSavedPosts();
  }, []);

  useEffect(() => {
    const filterPosts = () => {
      if (savedPosts.length !== 0) {
        const filteredPosts = savedPosts.filter(
          (post) => post.over_18 === false
        );
        setfilteredPosts(filteredPosts);
        console.log(filteredPosts);
      }
    };

    filterPosts();
  }, [savedPosts]);

  useEffect(() => {
    if (filteredPosts.length !== 0) {
      for (const post of filteredPosts) {
        setfilteredPostIds((filteredPostIds) => [...filteredPostIds, post.id]);
      }
    }
  }, [filteredPosts]);

  const authRedirectHandler = () => {
    const authUrl = getAuthUrl();
    window.location = authUrl;
  };

  const authSecondAccount = () => {
    setSecondAccountAuthed(true);
    setAuthingSecondAccount(false);
  };

  const renderGetSavedPosts = () => {
    if (savedPosts.length === 0) {
      return (
        <Button clicked={authRedirectHandler} link="#">
          1. Get saved posts from first account
        </Button>
      );
    }
  };

  const renderGoLogOut = () => {
    if (
      filteredPostIds.length !== 0 &&
      !authingSecondAccount &&
      !secondAccountAuthed
    ) {
      return (
        <React.Fragment>
          <Button
            link="https://www.reddit.com"
            clicked={() => setAuthingSecondAccount(true)}
          >
            2. Go to Reddit and log out
          </Button>
          <p>
            This is so we can authorize your second account in the next step.
            The button will open Reddit in a new tab, so don't forget to return
            to this tab once you're done.
          </p>
        </React.Fragment>
      );
    }
  };

  const renderAuthSecondAccount = () => {
    if (authingSecondAccount) {
      return (
        <React.Fragment>
          <Button clicked={() => authSecondAccount()}>
            3. Authorize second account
          </Button>
        </React.Fragment>
      );
    }
  };

  const renderCopySavedPosts = () => {
    if (secondAccountAuthed) {
      return (
        <React.Fragment>
          <Button>4. Begin saving posts to second account </Button>
          <p>
            This may take some time, as the Reddit API has a rate limit of 30
            requests per minute. This means we can only save one post every 2
            seconds.
          </p>
        </React.Fragment>
      );
    }
  };

  return (
    <div className="App">
      <div className="Container">
        {renderGetSavedPosts()}
        {renderGoLogOut()}
        {renderAuthSecondAccount()}
        {renderCopySavedPosts()}
        <Posts posts={filteredPosts} />
      </div>
    </div>
  );
}

export default App;

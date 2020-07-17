import React, { useEffect, useState } from "react";

import { getAuthUrl, fromAuthCode } from "../../helpers/helpers";

import Posts from "../../components/Posts/Posts";
import Button from "../../components/Button/Button.js";

// optionally unsave posts from the original account

/* TODO

-refactor requester
-add tests for button conditionals
-maybe change here are your saved posts to include username

*/

const SaveShifter = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [filteredPosts, setfilteredPosts] = useState([]);
  const [filteredPostIds, setfilteredPostIds] = useState([]);
  const [authingSecondAccount, setAuthingSecondAccount] = useState(false);
  const [secondAccountAuthed, setSecondAccountAuthed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requester, setRequester] = useState(null);
  const [username, setUsername] = useState("User");

  // handle creating a snoowrap requester on initial page load
  useEffect(() => {
    const getRequester = async () => {
      const code = new URL(window.location.href).searchParams.get("code");

      if (code != null) {
        setIsLoading(true);
        try {
          setRequester(await fromAuthCode(code));
        } catch (error) {
          console.log(error);
          window.location = "http://localhost:3000";
        }
      }
    };

    getRequester();
  }, []);

  // handle getting the user's saved posts once we've generated a requester
  useEffect(() => {
    console.log(requester);
    const getSavedPosts = async () => {
      if (requester !== null) {
        try {
          var savedPosts = await requester
            .getMe()
            .getSavedContent()
            .fetchMore(1);
          console.log(savedPosts);
          setSavedPosts(savedPosts);
          setUsername(requester._ownUserInfo.name);
        } catch (error) {
          console.log(error);
        }
      }
    };

    getSavedPosts();
  }, [requester]);

  // once we have a list of saved posts, filter them and save the new list
  useEffect(() => {
    const filterPosts = () => {
      if (savedPosts.length !== 0) {
        const filteredPosts = savedPosts.filter(
          (post) => post.over_18 === false
        );
        setfilteredPosts(filteredPosts);
        setIsLoading(false);
        console.log(filteredPosts);
      }
    };

    filterPosts();
  }, [savedPosts]);

  // once we have a list of filtered posts, save their ids into local storage
  useEffect(() => {
    const getFilteredPostIds = () => {
      const storedFilteredPostIds = localStorage.getItem("filteredPostIds");

      if (filteredPosts.length !== 0 && storedFilteredPostIds == null) {
        for (const post of filteredPosts) {
          setfilteredPostIds((filteredPostIds) => [
            ...filteredPostIds,
            post.id,
          ]);
        }
      }

      const code = new URL(window.location.href).searchParams.get("code");

      if (storedFilteredPostIds && code !== null) {
        setfilteredPostIds(storedFilteredPostIds.split(","));
        setSecondAccountAuthed(true);
      }

      if (code === null) {
        localStorage.removeItem("filteredPostIds");
        localStorage.removeItem("secondAccountAuthed");
      }
    };

    getFilteredPostIds();
  }, [filteredPosts]);

  const authRedirectHandler = () => {
    const authUrl = getAuthUrl();
    window.location = authUrl;
  };

  const authSecondAccountHandler = () => {
    localStorage.setItem("filteredPostIds", filteredPostIds);
    localStorage.setItem("secondAccountAuthed", true);
    authRedirectHandler();
  };

  const copySavedPostsHandler = () => {
    if (requester != null) {
      const delayedSave = async (postId, index) => {
        setTimeout(async () => {
          try {
            console.log("saving post:", postId);
            await requester.getSubmission(postId).save();
            //await requester.getSubmission(postId).unsave();
            console.log("saved post:", postId);
          } catch (error) {
            console.log(error);
          }
        }, 2000 * index);
      };

      var index = 0;

      // we reverse so the most recent post is saved last, and therefore appears on top
      for (var postId of filteredPostIds.reverse()) {
        index = index + 1;
        delayedSave(postId, index);
      }
    }
  };

  const renderGetSavedPosts = () => {
    if (
      savedPosts.length === 0 &&
      !authingSecondAccount &&
      !secondAccountAuthed
    ) {
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
          <Button clicked={() => authSecondAccountHandler()}>
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
          <Button clicked={() => copySavedPostsHandler()}>
            4. Begin saving posts to second account
          </Button>
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
    <div className="SaveShifter">
      <div className="Container">
        {renderGetSavedPosts()}
        {renderGoLogOut()}
        {renderAuthSecondAccount()}
        {renderCopySavedPosts()}
        <Posts
          posts={filteredPosts}
          isLoading={isLoading}
          username={username}
        />
      </div>
    </div>
  );
};

export default SaveShifter;

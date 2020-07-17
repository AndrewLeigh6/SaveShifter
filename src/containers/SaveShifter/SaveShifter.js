import React, { useEffect, useState } from "react";

import { getAuthUrl, fromAuthCode, savePost } from "../../helpers/helpers";

import Posts from "../../components/Posts/Posts";
import Button from "../../components/Button/Button.js";

import classes from "./SaveShifter.module.scss";

const SaveShifter = () => {
  // requesters (snoowrap objects)
  const [requester, setRequester] = useState(null);
  const [firstAccountRequester, setFirstAccountRequester] = useState(null);

  // post state
  const [savedPosts, setSavedPosts] = useState([]);
  const [filteredPosts, setfilteredPosts] = useState([]);
  const [filteredPostIds, setfilteredPostIds] = useState([]);

  // flags
  const [authingSecondAccount, setAuthingSecondAccount] = useState(false);
  const [secondAccountAuthed, setSecondAccountAuthed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // misc
  const [username, setUsername] = useState("User");
  const [postsSaved, setPostsSaved] = useState(0);

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
          setIsLoading(false);
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
        console.log(filteredPosts);
      }
    };

    filterPosts();
  }, [savedPosts]);

  /* once we have a list of filtered posts, save their ids into local storage so we can 
  access them after authenticating the second account, since the page will refresh */
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

      // we've just authed the second account, so take our stored local storage ids and put them back into state
      if (storedFilteredPostIds && code !== null) {
        setfilteredPostIds(storedFilteredPostIds.split(","));
        setSecondAccountAuthed(true);
      }

      // clean up local storage for new users (that havent just authenticated)
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
    if (isSaving) {
      return false;
    }

    if (requester != null) {
      // we save once every two seconds to avoid hitting the reddit api request limit
      const delayedSave = async (postId, index) => {
        let totalPosts = filteredPostIds.length;
        setTimeout(async () => {
          savePost(requester, postId, index, totalPosts);
          setPostsSaved((postsSaved) => postsSaved + 1);
        }, 2000 * index);
      };

      var index = 0;
      setIsSaving(true);

      // we reverse so the most recent post is saved last, and therefore appears on top
      for (var postId of filteredPostIds.reverse()) {
        index = index + 1;
        delayedSave(postId, index);
      }
    }
  };

  // step 1
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

  // step 2
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

  // step 3
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

  // step 4
  const renderCopySavedPosts = () => {
    if (secondAccountAuthed) {
      return (
        <React.Fragment>
          <Button clicked={() => copySavedPostsHandler()} disabled={isSaving}>
            4. Begin saving posts to second account
          </Button>
          <p>
            This may take some time, as the Reddit API has a rate limit of 30
            requests per minute. This means we can only save one post every 2
            seconds.
          </p>
          <p>
            {" "}
            Posts saved: {postsSaved} / {filteredPostIds.length}
          </p>
          {postsSaved == filteredPostIds.length ? (
            <div>
              <p> Saving complete!</p>
              <p>
                {" "}
                If you just wanted to copy your posts, you're done! However, if
                you want to remove the posts from your original account, please
                click the button above to proceed
              </p>
            </div>
          ) : null}
        </React.Fragment>
      );
    }
  };

  const removePostsFromFirstAccount = () => {};

  return (
    <div className={classes.SaveShifter}>
      <div className={classes.Container}>
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

import React, { useEffect, useState } from "react";

import { savePosts, unsavePosts, fromLogin } from "../../helpers/helpers";

import Posts from "../../components/Posts/Posts";

import classes from "./SaveShifter.module.scss";
import Logins from "../../components/Logins/Logins";
import CopySavedPosts from "../../components/CopySavedPosts/CopySavedPosts";
import UnsavePosts from "../../components/UnsavePosts/UnsavePosts";

// to do - fix everything, put renders into components, tidy up grid, fix saving logic, oh god

const SaveShifter = () => {
  // requesters (snoowrap objects)
  const [firstAccountRequester, setFirstAccountRequester] = useState(null);
  const [secondAccountRequester, setSecondAccountRequester] = useState(null);

  // post state
  const [savedPosts, setSavedPosts] = useState([]);
  const [filteredPosts, setfilteredPosts] = useState([]);
  const [filteredPostIds, setfilteredPostIds] = useState([]);

  // flags
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUnsaving, setIsUnsaving] = useState(false);

  // misc
  const [postsSaved, setPostsSaved] = useState(0);
  const [postsUnsaved, setPostsUnsaved] = useState(0);

  useEffect(() => {
    getSavedPosts();

    async function getSavedPosts() {
      if (firstAccountRequester !== null) {
        setIsLoading(true);
        const userSavedPosts = await firstAccountRequester
          .getMe()
          .getSavedContent()
          .fetchMore(50);
        setSavedPosts(userSavedPosts);
        setIsLoading(false);
      }
    }
  }, [firstAccountRequester]);

  // once we have a list of saved posts, filter them and save the new list
  useEffect(() => {
    const filterPosts = () => {
      console.log(savedPosts);
      if (savedPosts.length !== 0) {
        const filteredPosts = savedPosts.filter(
          (post) => post.over_18 === true
        );
        setfilteredPosts(filteredPosts);
        console.log(filteredPosts);
      }
    };

    filterPosts();
  }, [savedPosts]);

  // get post ids
  useEffect(() => {
    const getFilteredPostIds = () => {
      if (filteredPosts.length !== 0) {
        for (const post of filteredPosts) {
          setfilteredPostIds((filteredPostIds) => [
            ...filteredPostIds,
            post.id,
          ]);
        }
      }
    };

    getFilteredPostIds();
  }, [filteredPosts]);

  // save requester objects into state after login
  const loginHandler = async (event, accountNo) => {
    event.preventDefault();
    const username = event.target[0].value;
    const password = event.target[1].value;

    const getRequester = async () => {
      const requester = fromLogin(username, password);
      return requester;
    };

    const requester = await getRequester();

    if (accountNo === "first") {
      setFirstAccountRequester(requester);
    } else {
      setSecondAccountRequester(requester);
    }
  };

  const copySavedPostsHandler = () => {
    if (secondAccountRequester != null && !isSaving) {
      savePosts(
        secondAccountRequester,
        filteredPostIds,
        setIsSaving,
        setPostsSaved
      );
    }
  };

  const removeSavedPostsHandler = async () => {
    if (firstAccountRequester !== null && !isUnsaving) {
      unsavePosts(
        firstAccountRequester,
        filteredPostIds,
        setIsUnsaving,
        setPostsUnsaved
      );
    }
  };

  return (
    <div className={classes.SaveShifter}>
      <div className={classes.Container}>
        <Logins
          submit={loginHandler}
          firstAccountRequester={firstAccountRequester}
          secondAccountRequester={secondAccountRequester}
        />
        <CopySavedPosts
          postsSaved={postsSaved}
          filteredPostIds={filteredPostIds}
          copySavedPostsHandler={copySavedPostsHandler}
          isSaving={isSaving}
        />
        <UnsavePosts
          postsUnsaved={postsUnsaved}
          filteredPostIds={filteredPostIds}
          removeSavedPostsHandler={removeSavedPostsHandler}
          isUnsaving={isUnsaving}
        />
        <Posts posts={filteredPosts} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default SaveShifter;

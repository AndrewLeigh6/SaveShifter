import snoowrap from "snoowrap";

/* if you change the env variables, make sure to restart the
dev server or you'll waste hours of your life debugging */
export function fromLogin(username, password) {
  const requester = new snoowrap({
    userAgent: "",
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    username: username,
    password: password,
  });

  requester.config({ debug: true });

  return requester;
}

export async function savePosts(
  requester,
  filteredPostIds,
  setIsSaving,
  setPostsSaved
) {
  // we save once every two seconds to avoid hitting the reddit api request limit
  console.log("are we hitting this");
  const delayedSave = async (postId, index) => {
    let totalPosts = filteredPostIds.length;
    setTimeout(async () => {
      savePost(requester, postId, index, totalPosts);
      setPostsSaved((postsSaved) => postsSaved + 1);
    }, 2000 * index);
  };

  var index = 0;
  setIsSaving(true);

  for (var postId of filteredPostIds.reverse()) {
    index = index + 1;
    delayedSave(postId, index);
  }

  /* Helper function */
  async function savePost(requester, postId, index, totalPosts) {
    try {
      console.log("saving post:", postId);
      await requester.getSubmission(postId).save();
      console.log("saved post:", postId);
      console.log("index is", index);
      console.log("total length is", totalPosts);
    } catch (error) {
      console.log(error);
    }
  }
}

export async function unsavePosts(
  requester,
  filteredPostIds,
  setIsUnsaving,
  setPostsUnsaved
) {
  // unsave one post every two seconds to avoid hitting the reddit api request limit
  const delayedUnsave = async (postId, index) => {
    let totalPosts = filteredPostIds.length;
    setTimeout(async () => {
      unsavePost(requester, postId, index, totalPosts);
      setPostsUnsaved((postsUnsaved) => postsUnsaved + 1);
    }, 2000 * index);
  };

  var index = 0;
  setIsUnsaving(true);

  for (var postId of filteredPostIds.reverse()) {
    index = index + 1;
    delayedUnsave(postId, index);
  }

  /* Helper function */
  async function unsavePost(requester, postId, index, totalPosts) {
    try {
      console.log("unsaving post:", postId);
      await requester.getSubmission(postId).unsave();
      console.log("unsaved post:", postId);
      console.log("index is", index);
      console.log("total length is", totalPosts);
    } catch (error) {
      console.log(error);
    }
  }
}

// legacy
export function getAuthUrl() {
  const authUrl = snoowrap.getAuthUrl({
    clientId: process.env.REACT_APP_CLIENT_ID,
    scope: ["history", "identity", "read", "save"],
    redirectUri: "http://localhost:3000",
  });

  return authUrl;
}

// legacy
export function fromAuthCode(authCode) {
  var requester = snoowrap.fromAuthCode({
    code: authCode,
    userAgent: "",
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    redirectUri: "http://localhost:3000",
  });

  return requester;
}

// legacy
export function fromRefreshToken(token) {
  const requester = new snoowrap({
    userAgent: "",
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    refreshToken: token,
  });

  return requester;
}

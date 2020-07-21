import snoowrap from "snoowrap";

export function getAuthUrl() {
  const authUrl = snoowrap.getAuthUrl({
    clientId: process.env.REACT_APP_CLIENT_ID,
    scope: ["history", "identity", "read", "save"],
    redirectUri: "http://localhost:3000",
  });

  return authUrl;
}

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

export function fromRefreshToken(token) {
  const requester = new snoowrap({
    userAgent: "",
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    refreshToken: token,
  });

  return requester;
}

export async function savePost(requester, postId, index, totalPosts) {
  try {
    console.log("saving post:", postId);
    await requester.getSubmission(postId).save();
    //await requester.getSubmission(postId).unsave();
    console.log("saved post:", postId);
    console.log("index is", index);
    console.log("total length is", totalPosts);
  } catch (error) {
    console.log(error);
  }
}

export async function unsavePost(requester, postId, index, totalPosts) {
  try {
    console.log("unsaving post:", postId);
    //await requester.getSubmission(postId).save();
    await requester.getSubmission(postId).unsave();
    console.log("unsaved post:", postId);
    console.log("index is", index);
    console.log("total length is", totalPosts);
  } catch (error) {
    console.log(error);
  }
}

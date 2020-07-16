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

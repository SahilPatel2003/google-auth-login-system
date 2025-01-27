require("dotenv").config();

const options = {
  redirect_uri: process.env.OAUTH_REDIRECT_URL,
  client_id: process.env.OAUTH_CLIENT_ID,
  access_type: "offline",
  response_type: "code",
  prompt: "consent",
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ].join(" "),
};

const params = (authcode) => {
  tokenParams = {
    client_id: process.env.OAUTH_CLIENT_ID,
    client_secret: process.env.OAUTH_CLIENT_SECRET,
    redirect_uri: process.env.OAUTH_REDIRECT_URL,
    code: authcode,
    grant_type: "authorization_code",
  };
  return tokenParams;
};

module.exports = { options, params };

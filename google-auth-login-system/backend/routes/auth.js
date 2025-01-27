const { getAccounts, authenticate } = require("../controller/auth-controller");

function auth(router) {
  router._get("/auth/user", getAccounts);
  router._post("/authenticate", authenticate);
}

module.exports = auth;

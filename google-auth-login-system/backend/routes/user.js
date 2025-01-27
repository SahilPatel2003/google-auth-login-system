const {
  getUsers,
  postUser,
  deleteUser,
  updateUser,
  getUser,
  validateUser,
  resetPassword,
  changePassword,
  logout,
} = require("../controller/user-controller");
const { sessionVerify } = require("../middleware/check-session");
const { verifyUser } = require("../middleware/verify");

function userData(router) {
  router._post("/register", postUser);
  router._post("/login", validateUser);
  router._post("/reset-password", resetPassword);
  router._post("/change-password", changePassword);
  router._post("/logout-api-endpoint", logout);
  router._get("/check-session", sessionVerify);
  router._get("/v1/getUsers", getUsers, [sessionVerify, verifyUser]);
  router._get("/v1/getUsers/:username", getUser, [sessionVerify, verifyUser]);
  router._delete("/v1/getUsers/delete/:username", deleteUser, [
    sessionVerify,
    verifyUser,
  ]);
  router._put("/v1/getUsers/update/:username", updateUser, [
    sessionVerify,
    verifyUser,
  ]);
}

module.exports = userData;

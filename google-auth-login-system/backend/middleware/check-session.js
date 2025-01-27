const response = require("../utils/response");

async function sessionVerify(req, res) {
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = cookieHeader.split("; ").reduce((acc, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = value;
      return acc;
    }, {});

    const sessionId = cookies["session_id"];
    if (sessionId) {
      res.write("session_id present");
    } else {
      await response(res, "error", 404, "text/plain", "session_id not present");
      return "404";
    }
  } else {
    return await response(
      res,
      "error",
      404,
      "text/plain",
      "session_id not present"
    );
  }
}

module.exports = { sessionVerify };

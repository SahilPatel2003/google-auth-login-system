async function response(res, result, statusCode, type, message) {
  res.writeHead(statusCode, { "Content-Type": `${type}` });
  if (result == "success") {
    res.end(
      JSON.stringify({
        message,
      })
    );
  } else {
    res.end(message);
  }
}

module.exports = response;

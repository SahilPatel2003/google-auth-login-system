async function logout() {
  try {
    const response = await fetch("http://localhost:3003/logout-api-endpoint", {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      window.location.href = "login.html";
    } else {
      console.error("Logout failed:", response.statusText);
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

window.onload = async function () {
  console.log(document.cookie);
  const sessionIdPresent = document.cookie
    .split(";")
    .some((cookie) => cookie.trim().startsWith("session_id="));

  if (!sessionIdPresent) {
    window.location.href = "login.html";
  }
};

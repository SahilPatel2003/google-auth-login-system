document
  .getElementById("change-password-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const passwordregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!passwordregex.test(password)) {
      alert(
        "Password must contain at least one digit, one lowercase and one uppercase letter, and be at least 8 characters long."
      );
      window.location.reload();
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const parsedUrl = new URL(window.location.href);
    const token = parsedUrl.searchParams.get("token");

    try {
      const response = await fetch("http://localhost:3003/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, token }),
      });

      if (!response.ok) {
        console.error("Error:", response.statusText);
        alert("token expried");
        window.location.reload();
        return;
      }
      document.getElementById("password").value = "";
      document.getElementById("confirm-password").value = "";

      alert("Password changed successfully");
      window.location.href = "login.html";
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while changing password. Please try again.");
    }
  });

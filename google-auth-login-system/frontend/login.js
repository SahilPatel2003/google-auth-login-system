document
  .getElementById("google-signup-button")
  .addEventListener("click", async function () {
    try {
      const response = await fetch("http://localhost:3003/auth/user");
      const data = await response.json();
      window.location.href = data.redirectto;
    } catch (error) {
      console.error("Error:", error);
    }
  });

document
  .getElementById("login-button")
  .addEventListener("click", async function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    let isValid = true;
    if (!email) {
      document.getElementById("email-error").classList.remove("hidden");
      document.getElementById("email").classList.add("invalid");
      isValid = false;
    }
    if (!password) {
      document.getElementById("password-error").classList.remove("hidden");
      document.getElementById("password").classList.add("invalid");
      isValid = false;
    }

    const rememberMe = document.getElementById("remember-me").checked;

    if (isValid) {
      try {
        const response = await fetch("http://localhost:3003/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password, rememberMe }),
        });

        if (!response.ok) {
          console.log(response.status);
          if (response.status == 404) {
            alert("email not found. Please sign up first.");
          } else if (response.status == 400) {
            alert("Incorrect password.");
          }
          window.location.reload();
          return;
        }
        const token = await response.text();
        localStorage.setItem("token", token);

        document.getElementById("email").value = "";
        document.getElementById("password").value = "";

        window.location.href = "dashboard.html";
      } catch (error) {
        console.error("Error:", error);
      }
    }
  });

function clearError(input) {
  const errorId = input.getAttribute("id") + "-error";
  document.getElementById(errorId).classList.add("hidden");
  input.classList.remove("invalid");
}

const inputs = document.querySelectorAll(".form-input");
inputs.forEach((input) => {
  input.addEventListener("input", function () {
    clearError(input);
  });
});

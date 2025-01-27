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
  .getElementById("signup-button")
  .addEventListener("click", async function () {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirm-password")
      .value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const userRegex = /^[a-zA-Z0-9]*$/;
    const passwordregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    let isValid = true;
    if (!username) {
      document.getElementById("username-error").classList.remove("hidden");
      document.getElementById("username").classList.add("invalid");
      isValid = false;
    } else if (!userRegex.test(username)) {
      document.getElementById("username-error").classList.remove("hidden");
      document.getElementById("username-error").textContent =
        "Username can only contain letters and numbers";
      document.getElementById("username").classList.add("invalid");
      isValid = false;
    }
    if (!email) {
      document.getElementById("email-error").classList.remove("hidden");
      document.getElementById("email").classList.add("invalid");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      document.getElementById("email-error").classList.remove("hidden");
      document.getElementById("email-error").textContent =
        "Enter a valid email";
      document.getElementById("email").classList.add("invalid");
      isValid = false;
    }

    if (!password) {
      document.getElementById("password-error").classList.remove("hidden");
      document.getElementById("password").classList.add("invalid");
      isValid = false;
    } else if (!passwordregex.test(password)) {
      document.getElementById("password-error").classList.remove("hidden");
      document.getElementById("password-error").textContent =
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long";
      document.getElementById("password").classList.add("invalid");
      isValid = false;
    }
    if (!confirmPassword) {
      document
        .getElementById("confirm-password-error")
        .classList.remove("hidden");
      document.getElementById("confirm-password").classList.add("invalid");
      isValid = false;
    }
    if (password !== confirmPassword) {
      document
        .getElementById("confirm-password-error")
        .classList.remove("hidden");
      document.getElementById("confirm-password").classList.add("invalid");
      alert("Passwords do not match");
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await fetch("http://localhost:3003/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
          if (response.status == 400) {
            alert("Email already exists. Please choose a different email");
          } else {
            alert("Error posting user:");
          }
          window.location.reload();
          return;
        }

        const token = await response.text();
        localStorage.setItem("token", token);

        document.getElementById("username").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        document.getElementById("confirm-password").value = "";

        window.location.href = "dashboard.html";
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while registering. Please try again.");
      }
    }
  });

function clearErrors(input) {
  const errorId = input.getAttribute("id") + "-error";
  document.getElementById(errorId).classList.add("hidden");
  input.classList.remove("invalid");
}

const inputs = document.querySelectorAll(".form-input");
inputs.forEach((input) => {
  input.addEventListener("input", function () {
    clearErrors(input);
  });
});

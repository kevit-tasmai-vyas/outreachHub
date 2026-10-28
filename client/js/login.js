import { post } from "./api.js";
import { saveLogin, getToken } from "./auth.js";

// already logged in, so skip the login page
if (getToken()) {
  window.location.href = "home.html";
}

const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");
const loginButton = loginForm.querySelector("button");

loginForm.addEventListener("submit", async (event) => {
  // stop the browser from reloading the page
  event.preventDefault();

  // clear the old error
  errorMessage.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // stop double clicks while the request is running
  loginButton.disabled = true;

  try {
    // post already returns the data: { token, user }
    const data = await post("/auth/login", { email, password });

    saveLogin(data.token, data.user);
    window.location.href = "home.html";
  } catch (error) {
    // shows "Invalid email or password" or "Cannot reach the server..."
    errorMessage.textContent = error.message;
  } finally {
    // runs on success and on error: turn the button back on
    loginButton.disabled = false;
  }
});
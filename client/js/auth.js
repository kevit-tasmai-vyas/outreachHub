export const saveLogin = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
}
export const setToken = () => {
    return localStorage.getItem("token");
}

export const getUser = () => {
      const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    return null;
  }
    try {
        return JSON.parse(savedUser);
    } catch (error) {
        return null;
    }
}

export const requireLogin = () => {
    if(!getToken()){
        window.location.href = "login.html"
        return false;
    }
    return true;
};

// true for editors and admins, false for viewers
export const isEditor = () => {
  const user = getUser();
  return user !== null && user.role !== "viewer";
};

// makes the Logout link in the navbar really log the user out
export const setupLogoutLink = () => {
  const logoutLink = document.getElementById("logout-link");

  if (logoutLink) {
    logoutLink.addEventListener("click", (event) => {
      event.preventDefault();
      logout();
    });
  }
};

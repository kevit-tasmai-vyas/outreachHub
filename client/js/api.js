const BASE_URL = "http://localhost:5000/api";

export const request = async (path, method = "GET", body) => {
  // build the headers
  const headers = {};

  // read the saved token (auth.js must save it under this same name)
  const token = localStorage.getItem("token");

  // if the user is logged in, send the token
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  // if we are sending data, tell the server it is JSON
  if (body) {
    headers["Content-Type"] = "application/json";
  }

  // build the options for fetch
  const options = {
    method: method,
    headers: headers,
  };

  // only send a body when there is one
  if (body) {
    options.body = JSON.stringify(body);
  }

  // call the server
  let response;
  try {
    response = await fetch(BASE_URL + path, options);
  } catch (error) {
    // this happens when the server is off or the URL is wrong
    throw new Error("Cannot reach the server. Please try again.");
  }

  // read the reply
  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    // the reply was not JSON, so keep the empty object
  }

  // token expired or invalid, so send the user back to login
  if (response.status === 401 && path !== "/auth/login") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
    throw new Error(data.message || "Please log in again");
  }

  // any other error from the server
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  // everything is fine
  return data;
};

// short helpers so pages stay simple
export const get = (path) => request(path, "GET");

export const post = (path, body) => request(path, "POST", body);

export const put = (path, body) => request(path, "PUT", body);

export const remove = (path) => request(path, "DELETE");
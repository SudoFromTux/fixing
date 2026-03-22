import axios, { AxiosRequestHeaders } from "axios";

const AUTH_TOKEN_KEY = "authToken";
const AUTH_USER_KEY = "isLoggedIn";

function setAxiosAuthorizationHeader(token: string | null) {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete (axios.defaults.headers.common as AxiosRequestHeaders).Authorization;
}

export function syncAuthSession() {
  axios.defaults.withCredentials = true;
  setAxiosAuthorizationHeader(localStorage.getItem(AUTH_TOKEN_KEY));
}

export function saveAuthSession(token: string, email: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, email);
  setAxiosAuthorizationHeader(token);
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  setAxiosAuthorizationHeader(null);
}

export function hasAuthSession() {
  return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
}


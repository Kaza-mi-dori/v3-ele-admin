const TOKEN_KEY = "admin-token";
const TOKEN_KEY_DEV = "Gtzn-Token";

function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function setToken(token: string) {
  return localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  return localStorage.removeItem(TOKEN_KEY);
}

function getToken2(): string {
  return localStorage.getItem(TOKEN_KEY_DEV) || "";
}

function setToken2(token: string) {
  return localStorage.setItem(TOKEN_KEY_DEV, token);
}

function clearToken2() {
  return localStorage.removeItem(TOKEN_KEY_DEV);
}

export { getToken, setToken, clearToken, getToken2, setToken2, clearToken2 };

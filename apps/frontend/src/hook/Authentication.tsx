export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  return localStorage.setItem("token", token);
}

export function isAuthenticated() {
  const token = localStorage.getItem("token");
  return token !== null && token.length > 0;
}

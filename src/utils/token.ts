const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, user);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clear() {
  localStorage.clear();
}

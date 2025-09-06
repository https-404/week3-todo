import store from './store.js';

function setupUserAccount(username) {
  if (!store.allUserAccounts[username]) {
    store.allUserAccounts[username] = { userName: username, userTodoList: [] };
  }
  return store.allUserAccounts[username];
}

function login(username) {
  if (!username) throw new Error('Please provide a username');
  const user = setupUserAccount(username);
  store.whoIsLoggedIn = user;
  return user;
}

function logout() {
  if (!store.whoIsLoggedIn) return null;
  const prev = store.whoIsLoggedIn.userName;
  store.whoIsLoggedIn = null;
  return prev;
}

function currentUser() {
  return store.whoIsLoggedIn;
}

export default { login, logout, currentUser };

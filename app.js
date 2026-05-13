let auth0Client = null;

// Replace these with your Auth0 values
const auth0Config = {
  domain: "leirbacoding.us.auth0.com",
  clientId: "tXCWXbm3SEKpilF8zvDBQruaP7cZlan4",
  authorizationParams: {
    redirect_uri: window.location.origin + window.location.pathname
  }
};

async function configureClient() {
  auth0Client = await auth0.createAuth0Client(auth0Config);
}

async function updateUI() {
  const isAuthenticated = await auth0Client.isAuthenticated();

  document.getElementById("login").style.display = isAuthenticated ? "none" : "block";
  document.getElementById("logout").style.display = isAuthenticated ? "block" : "none";
  document.getElementById("profile").style.display = isAuthenticated ? "block" : "none";

  if (isAuthenticated) {
    const user = await auth0Client.getUser();

    document.getElementById("profile").innerHTML = `
      <h2>Welcome, ${user.name}</h2>
      <img src="${user.picture}" alt="Profile picture" width="100">
      <p><strong>Email:</strong> ${user.email}</p>
    `;
  }
}

window.onload = async () => {
  await configureClient();

  if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  document.getElementById("login").addEventListener("click", async () => {
    await auth0Client.loginWithRedirect();
  });

  document.getElementById("logout").addEventListener("click", () => {
    auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin + window.location.pathname
      }
    });
  });

  await updateUI();
};

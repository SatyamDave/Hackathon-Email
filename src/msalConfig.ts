export const msalConfig = {
  auth: {
    clientId: "c0d46389-f539-4e30-a67b-77d58154ba87",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "http://localhost:5174/",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read", "Mail.Read"],
}; 
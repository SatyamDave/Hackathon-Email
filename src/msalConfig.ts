export const msalConfig = {
  auth: {
    clientId: "c0d46389-f539-4e30-a67b-77d58154ba87",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "http://localhost:5173/",
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    allowNativeBroker: false,
    loggerOptions: {
      loggerCallback: (level: any, message: any, containsPii: any) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case 0:
            console.error(message);
            return;
          case 1:
            console.warn(message);
            return;
          case 2:
            console.info(message);
            return;
          case 3:
            console.debug(message);
            return;
          default:
            return;
        }
      },
      piiLoggingEnabled: false,
      logLevel: 3,
    },
  },
};

export const loginRequest = {
  scopes: [
    "User.Read",
    "Mail.Read",
    "Mail.ReadBasic",
    "Mail.ReadWrite",
    "Calendars.Read",
    "Calendars.ReadWrite",
    "offline_access"
  ],
  prompt: "consent"
}; 
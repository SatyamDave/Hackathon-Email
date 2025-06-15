import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../msalConfig";

export const LoginButton: React.FC = () => {
  const { instance } = useMsal();
  return (
    <button onClick={() => instance.loginPopup(loginRequest)}>
      Sign in with Microsoft
    </button>
  );
}; 
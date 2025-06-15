import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../msalConfig";

export function useOutlookLogin() {
  const { instance } = useMsal();
  const login = () => instance.loginPopup(loginRequest);
  return login;
} 
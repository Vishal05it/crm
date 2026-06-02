import { baseURL } from "./baseURL";

export const checkLogin = async (userId: string) => {
  let response = await fetch(`${baseURL}/auth/${userId}`);
  let loggedData = await response.json();
  if (loggedData.success) {
    localStorage.setItem("tempUserLogin", JSON.stringify(true));
    return true;
  } else {
    localStorage.removeItem("tempUserLogin");
    return false;
  }
};

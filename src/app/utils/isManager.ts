import { baseURL } from "./baseURL";

export const isManager = async (userId: string): Promise<boolean> => {
  try {
    let cacheResponse = await fetch(
      `${baseURL}/cache/personalised/profiledata/${userId}`,
    );
    let cacheData = await cacheResponse.json();
    if (cacheData.success) {
      if (cacheData.user.isManager) return true;
    }
    let response = await fetch(`${baseURL}/users/${userId}`, {
      method: "GET",
    });
    let userData = await response.json();
    if (userData.user.isManager) return true;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

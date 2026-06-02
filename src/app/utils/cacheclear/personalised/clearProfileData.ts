import { baseURL } from "../../baseURL";

export const clearProfileData = async (userId: string) => {
  try {
    let sendResponse = await fetch(
      `${baseURL}/cache/personalised/profiledata/${userId}`,
      {
        method: "DELETE",
      },
    );
  } catch (error) {
    console.log(error);
  }
};

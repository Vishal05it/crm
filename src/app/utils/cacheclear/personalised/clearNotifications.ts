import { baseURL } from "../../baseURL";

export const clearAllNotifications = async (userId: string) => {
  try {
    let sendResponse = await fetch(
      `${baseURL}/cache/personalised/notifications/${userId}`,
      {
        method: "DELETE",
      },
    );
  } catch (error) {
    console.log(error);
  }
};

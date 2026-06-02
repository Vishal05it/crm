import { baseURL } from "../../baseURL";

export const clearUnread = async (projectId: string, userId: string) => {
  try {
    let sendResponse = await fetch(
      `${baseURL}/cache/personalised/unread/${projectId}/${userId}`,
      {
        method: "DELETE",
      },
    );
  } catch (error) {
    console.log(error);
  }
};

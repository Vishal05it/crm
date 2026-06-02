import { baseURL } from "../../baseURL";

export const clearAllMessages = async (projectId: string) => {
  try {
    let sendResponse = await fetch(
      `${baseURL}/cache/shared/messages/${projectId}`,
      {
        method: "DELETE",
      },
    );
  } catch (error) {
    console.log(error);
  }
};

import { baseURL } from "../../baseURL";

export const clearAllTasks = async (projectId: string) => {
  try {
    let sendResponse = await fetch(
      `${baseURL}/cache/shared/tasks/${projectId}`,
      {
        method: "DELETE",
      },
    );
  } catch (error) {
    console.log(error);
  }
};

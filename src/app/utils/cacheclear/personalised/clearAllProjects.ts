import { baseURL } from "../../baseURL";

export const clearAllProjects = async (userId: string) => {
  try {
    let sendResponse = await fetch(
      `${baseURL}/cache/personalised/allprojects/${userId}`,
      {
        method: "DELETE",
      },
    );
  } catch (error) {
    console.log(error);
  }
};

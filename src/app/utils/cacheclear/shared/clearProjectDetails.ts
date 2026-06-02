import { baseURL } from "../../baseURL";

export const clearProjectDetails = async (
  projectId: string,
  companyId: string,
) => {
  try {
    let sendResponse = await fetch(
      `${baseURL}/cache/shared/projectdetails/${projectId}/${companyId}`,
      {
        method: "DELETE",
      },
    );
  } catch (error) {
    console.log(error);
  }
};

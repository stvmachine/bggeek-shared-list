import axios from "axios";
import config from "../utils/config";

export const getCommunities = async (userId: string): Promise<any> => {
  const response = await axios.get(
    `${config.API_ENDPOINT}/communities?userId=${userId}`
  );
  return response.data;
};

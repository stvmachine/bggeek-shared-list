import config from "../utils/config";
import axios from "axios";
import { IExtendedUser } from "../utils/types";

export const getUser = async (userId: string): Promise<IExtendedUser> => {
  const response = await axios.get(
    `${config.API_ENDPOINT}/user/${userId}`
  );
  return response?.data?.user;
};

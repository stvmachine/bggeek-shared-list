import config from "../utils/config";
import axios from "axios";
import { IExtendedUser } from "../utils/types";

export const getUserAccountOptions = async (token: string | null): Promise<IExtendedUser> => {
  const response = await axios.get(
    `${config.API_ENDPOINT}/user/account-options`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response?.data?.user;
};


export const getUser = async (userId: string): Promise<IExtendedUser> => {
  const response = await axios.get(
    `${config.API_ENDPOINT}/user/${userId}`
  );
  return response?.data?.user;
};

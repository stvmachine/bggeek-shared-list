import axios from "axios";
import config from "../utils/config";

type IGetCommunitiesProps = {
  userId?: string | null;
  token?: string | null;
};

export const getCommunities = async ({
  userId,
  token,
}: IGetCommunitiesProps): Promise<any> => {
  const response = await axios.get(
    `${config.API_ENDPOINT}/communities?userId=${userId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response;
};

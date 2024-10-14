import axios from "axios";
import Cookies from "js-cookie";

export const getToken = () => Cookies.get("token");

export const toggleUserBlock = async (userId) => {
  const token = getToken();
  return axios.post(
    `http://localhost:55555/api/v1/users/user/${userId}/toggle-block-unblock`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
export const toggleFollowingUnfollowing = async (userId) => {
  const token = getToken();
  return axios.post(
    `http://localhost:55555/api/v1/users/user/${userId}/toggle-follow-unfollow`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

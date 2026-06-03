import axios from "axios";

const API_URL =
  "http://4.224.186.213/evaluation-service/notifications";

export const fetchNotifications = async (
  page = 1,
  limit = 10,
  type = ""
) => {
  try {
    let url = `${API_URL}?page=${page}&limit=${limit}`;

    if (type) {
      url += `&notification_type=${type}`;
    }

    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return { notifications: [] };
  }
};
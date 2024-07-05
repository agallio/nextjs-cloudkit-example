// Utils
import { getApiURL } from "@/utils/api";

export default async function loginHandler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json("Method not allowed");
    return;
  }

  if (!process.env.APPLE_CK_API_KEY) {
    res.status(500).json("Internal server error.");
    return;
  }

  try {
    const API_URL = getApiURL();

    const fetchResponse = await fetch(
      `${API_URL}/users/current?ckAPIToken=${process.env.APPLE_CK_API_KEY}`
    );
    const data = await fetchResponse.json();

    res.json(data);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
}

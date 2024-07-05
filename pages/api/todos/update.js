import { getCookie } from "cookies-next";

// Utils
import { getApiURL } from "@/utils/api";

export default async function updateTodo(req, res) {
  if (req.method !== "PUT") {
    res.status(405).json("Method not allowed");
    return;
  }

  if (!process.env.APPLE_CK_API_KEY) {
    res.status(500).json("Internal server error.");
    return;
  }

  // Validate `ckWebAuthToken`.
  const rawToken = getCookie("ckWebAuthToken", { req, res });

  if (!rawToken) {
    res.status(401).json("Unauthorized");
    return;
  }

  const encodeToken = encodeURIComponent(rawToken);

  const data = JSON.parse(req.body);

  const updateTodo = {
    operationType: "update",
    record: {
      recordName: data.id,
      recordChangeTag: data.recordChangeTag,
      fields: {
        CD_title: { value: data.title },
        CD_isCompleted: { value: data.isCompleted ? 1 : 0 },
      },
    },
  };

  const requestPayload = {
    zoneID: { zoneName: "com.apple.coredata.cloudkit.zone" },
    operations: [updateTodo],
  };

  try {
    const API_URL = getApiURL();

    const fetchResponse = await fetch(
      `${API_URL}/records/modify?ckAPIToken=${process.env.APPLE_CK_API_KEY}&ckWebAuthToken=${encodeToken}`,
      {
        method: "POST",
        body: JSON.stringify(requestPayload),
      }
    );
    const json = await fetchResponse.json();

    if (!fetchResponse.ok) {
      throw json;
    }

    res.json({ data: json, error: null });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
}

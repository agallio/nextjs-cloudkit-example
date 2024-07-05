import { getCookie } from "cookies-next";

// Utils
import { getApiURL } from "@/utils/api";

export default async function getTodos(req, res) {
  if (req.method !== "GET") {
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

  const requestPayload = {
    zoneID: { zoneName: "com.apple.coredata.cloudkit.zone" },
    query: {
      recordType: "CD_Todo",
      sortBy: [{ fieldName: "CD_createdAt", ascending: false }],
    },
  };

  try {
    const API_URL = getApiURL();

    const fetchResponse = await fetch(
      `${API_URL}/records/query?ckAPIToken=${process.env.APPLE_CK_API_KEY}&ckWebAuthToken=${encodeToken}`,
      {
        method: "POST",
        body: JSON.stringify(requestPayload),
      }
    );
    const json = await fetchResponse.json();

    if (!fetchResponse.ok) {
      throw json;
    }

    if (json.serverErrorCode === "AUTHENTICATION_REQUIRED") {
      throw json;
    }

    if (json.records) {
      const todosToDisplay = json.records
        .filter((record) => !record.deleted)
        .map((record) => ({
          id: record.recordName,
          recordChangeTag: record.recordChangeTag,
          title: record.fields.CD_title.value,
          isCompleted: Boolean(record.fields.CD_isCompleted.value),
        }));

      res.json(todosToDisplay);
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json("Internal server error.");
  }
}

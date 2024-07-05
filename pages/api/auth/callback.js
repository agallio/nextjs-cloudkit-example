import { setCookie } from "cookies-next";

export default async function callback(req, res) {
  if (req.method !== "GET") {
    res.status(405).json("Method not allowed");
    return;
  }

  const ckWebAuthToken = req.query.ckWebAuthToken;

  if (!ckWebAuthToken) {
    res.status(500).json("Missing auth token");
    return;
  }

  setCookie("ckWebAuthToken", ckWebAuthToken, { req, res });
  res.redirect(307, "/");
}

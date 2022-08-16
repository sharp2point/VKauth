import express from "express";
import dotenv from "dotenv";
import path from "path";
import fetch from "node-fetch";
//--------You IMPORT---------//
import { authPath, getAccessToken, user_get, friends_get } from "./modules/vk_paths.js";
import { OAuthModel, UserModel } from "./modules/models.js";
//-----------------------//

//----- You VARIABLES ----//
let oauth_model = undefined;
let user_model = undefined;
let req_data_field = "bdate, online, photo_max_orig, sex, counters";
//------------------------//
dotenv.config();
const __dirname = path.resolve();
const port = process.env.PORT || 1234;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));

app.use(express.static(path.resolve(__dirname, "static")));

app.get("/", async (req, res) => {
  if (oauth_model !== undefined) {
    // запрос данных авторизованного пользователя
    await fetch(user_get(oauth_model.user_id, oauth_model.access_token, req_data_field))
      .then((res) => res.json())
      .then((data) => (user_model = UserModel.fromJson(data.response[0])))
      .catch((err) => console.log("Error: " + err));

    res.render("index", { auth: oauth_model, user: user_model });
  } else {
    res.render("index", { auth: oauth_model, auth_path: "/auth" });
  }
});

app.get("/auth", (req, res) => {
  res.redirect(
    authPath(
      process.env.APPID,
      "http://localhost:1234/oauth_redirect",
      "friends, photos"
    )
  );
});

app.get("/oauth_redirect", (req, res) => {
  const code = req.query["code"];
  if (code) {
    fetch(
      getAccessToken(
        process.env.APPID,
        "http://localhost:1234/oauth_redirect",
        process.env.SECRET,
        code
      )
    )
      .then((res) => res.json())
      .then((json) => (oauth_model = OAuthModel.fromJson(json)))
      .catch((err) => console.log("Err: " + err));

    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`server start on port: ${port}`);
});

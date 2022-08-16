import express from "express";
import dotenv from "dotenv";
import path from "path";
import fetch from "node-fetch";
//--------You IMPORT---------//
import {
  authPath,
  getAccessToken,
  user_get,
  friends_get,
} from "./modules/vk_paths.js";
import { OAuthModel, UserModel } from "./modules/models.js";
//-----------------------//

//----- You VARIABLES ----//
let oauth_model = undefined; // объект хранящий данные авторизации
let user_model = undefined; // модель авторизованного пользователя
let req_data_field = "bdate, online, photo_max_orig, sex, counters"; // запрашиваемые у VK API поля
//------------------------//
dotenv.config();
const __dirname = path.resolve();
const port = process.env.PORT || 1234;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));

app.use(express.static(path.resolve(__dirname, "static")));

app.get("/", async (req, res) => {
  /*
        Если пользователь не авторизован отдать шаблон с кнопкой авторизации,
        иначе отобразить шаблон с данными пользователя
    */
  if (oauth_model !== undefined) {
    // запрос данных авторизованного пользователя
    await fetch(
      // Запросить данные авторизованного пользователя
      user_get(oauth_model.user_id, oauth_model.access_token, req_data_field) // запрос VK API данных
    )
      .then((res) => res.json()) // забрать данные в формате json
      .then((data) => (user_model = UserModel.fromJson(data.response[0]))) // создать объект пользователя
      .catch((err) => console.log("Error: " + err)); // обработать ошибку

    res.render("index", { auth: oauth_model, user: user_model }); // шаблон с данными пользователя
  } else {
    res.render("index", { auth: oauth_model, auth_path: "/auth" }); // шаблон с кнопкой авторизации
  }
});

app.get("/auth", (req, res) => {
  /* Запрос на получение кода авторизации */
  res.redirect(
    authPath(
      process.env.APPID,
      "http://localhost:1234/oauth_redirect",
      "friends, photos"
    )
  );
});

app.get("/oauth_redirect", async (req, res) => {
    /* Если код авторизации получен , запрашиваем access_token и переходи на корневой узел*/
  const code = req.query["code"];
  if (code) {
    await fetch(
      getAccessToken(
        process.env.APPID,
        "http://localhost:1234/oauth_redirect",
        process.env.SECRET,
        code
      )
    )
      .then((res) => res.json())
      .then((json) => (oauth_model = OAuthModel.fromJson(json))) // создаём модель с данными авторизации
      .catch((err) => console.log("Err: " + err));

    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`server start on port: ${port}`);
});

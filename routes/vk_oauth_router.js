import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

import { authPath, getAccessToken, user_get } from "../modules/vk_paths.js"; //"../vk_paths.js";
import { OAuthModel, UserModel } from "../modules/models.js"; //"../models.js";


dotenv.config();

//----- You VARIABLES ----//
let oauth_model = OAuthModel.getOAuthModel(); // объект хранящий данные авторизации
let user_model = undefined; // модель авторизованного пользователя
let req_data_field = "bdate, online, photo_max_orig, sex, counters"; // запрашиваемые у VK API поля
//------------------------//

let router = express.Router();

router.get("/", (req, res) => {
  //------------------------------------
  /* Запрос на получение кода авторизации */
  res.redirect(
    authPath(
      process.env.APPID,
      process.env.REDIRECT_URL,
      "friends, photos"
    )
  );
  //--------------------------------------
});

router.get("/token", async (req, res, next) => {
  //----------------------------------------------------
  /* Если код авторизации получен , запрашиваем access_token и переходи на корневой узел*/
  const code = req.query["code"];
  if (code) {
    await fetch(
      getAccessToken(
        process.env.APPID,
        process.env.REDIRECT_URL,
        process.env.SECRET,
        code
      )
    )
      .then((res) => res.json())
      .then((json) => (oauth_model = OAuthModel.fromJson(json)))
      .catch((err) => console.log("Err: " + err));

    if (oauth_model !== undefined) {
      await fetch(
        // Запросить данные авторизованного пользователя
        user_get(oauth_model.user_id, oauth_model.access_token, req_data_field)
      )
        .then((res) => res.json())
        .then((data) => (user_model = UserModel.fromJson(data.response[0])))
        .catch((err) => console.log("Error: " + err));
      if (user_model !== undefined) {
        res.redirect("/")
      }
    }
  }
  //------------------------------------------------
});

export { router, oauth_model, user_model };

import express from "express";
import dotenv from "dotenv";
import path from "path";
import { router as vk_oauth_router, oauth_model, user_model } from "./routes/vk_oauth_router.js";

dotenv.config();
const __dirname = path.resolve();
const port = process.env.PORT || 1234;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));

app.use(express.static(path.resolve(__dirname, "static")));

// подключение роутинга
app.use("/vk_oauth", vk_oauth_router);

app.get("/", async (req, res) => {
  if(oauth_model === undefined){
    res.render("index", { user: "" }); // шаблон с кнопкой авторизации
  }else{
    res.render("index",{user: user_model});
  }
  
});

app.listen(port, () => {
  console.log(`server start on port: ${port}`);
});
//88005001018

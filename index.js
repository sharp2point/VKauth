import express from "express";
import dotenv from "dotenv";
import path from "path";
import { router as vk_oauth_router } from "./routes/vk_oauth_router.js"

dotenv.config();
const __dirname = path.resolve();
const port = process.env.PORT || 1234;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));

app.use(express.static(path.resolve(__dirname, "static")));

// подключение роутинга
app.use("/vk_oauth", vk_oauth_router)


app.get("/", async (req, res) => {  
  res.render("index"); // шаблон с кнопкой авторизации  
});

app.listen(port, () => {
  console.log(`server start on port: ${port}`);
});

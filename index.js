import express from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const __dirname = path.resolve();
const port = process.env.PORT || 1234;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));

app.use(express.static(path.resolve(__dirname, "static")));

app.get("/",(req, res)=>{
    res.render("index")
})

app.listen(port, () => {
    console.log(`server start on port: ${port}`);
  });
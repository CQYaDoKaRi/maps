// express
import express from "express";
// page
import { page } from "./page";
// api
import { api } from "./api";
// log
import { syslog } from "./config";

// express
const app = express();
const router = express.Router();

// page
const oPage: page = new page("/");
oPage.regist(router);

// api
const oApi: api = new api("/api");
oApi.regist(app);

// express
app.use(router);
app.use("/", express.static("public"));

app.listen(8080, () => {
	syslog.info("Start server : maps");
});

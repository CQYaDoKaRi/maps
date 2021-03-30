import path from "path";
import { log } from "../ts/log";

export const syslogDir = path.join(__dirname, "./../../logs");
export const syslog = new log(syslogDir);

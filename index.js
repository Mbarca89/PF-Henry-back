import { app } from "./app.js";
import { connectDB } from "./db.js";
import { PORT } from "./config.js";
import express from "express"
import Payments from "./routes/Payments.js"
import morgan from "morgan";


app.use(morgan("dev"))

app.use(Payments);

app.use(express.static(path.resolve('src/public')))

connectDB();
app.listen(PORT);
console.log("Server on port", PORT);

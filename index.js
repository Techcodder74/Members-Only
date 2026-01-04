import express from "express";
import 'dotenv/config';
import path from "node:path"
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { userRouter, msgRouter } from "./routes/index.router.js";
import passport from "./middleware/passport.config.js";
import session from "express-session";


if(process.env.isRailway=="True"){
const { default: populateDb } = await import("./db/populateDb.js");

await populateDb(true);
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();



app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(express.static(path.join(process.cwd(), "public")));
app.use("/", userRouter);
app.use("/", msgRouter);

app.use((err, req, res, next) => {
    console.error(err.stack); // Log the actual error stack
    res.status(500).send(`Some error occurred: ${err.message}`);
    res.send(`Some error occured ${err}`);
})
app.listen(3000, () => {
    console.log(`Started at http://localhost:3000`)
})

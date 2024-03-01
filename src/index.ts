import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbconnect } from "./dbconnect";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import passport from "passport";
const app = express();
dotenv.config();
const imageGeneratorRouter = require("./routes/imageGeneratorRouter");
const userAuthRoutes = require("./routes/userAuthRouter");
const contactRouter = require("./routes/contactRouter");
const googleOauthRouter = require("./routes/googleOauthRouter");
require("./passport-config");

const PORT = process.env.PORT || 4000;

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

dbconnect();

app.use(
  cors({
    credentials: true,
    origin: [process.env.FE_URL!],
  })
);

app.use(
  cookieSession({
    name: "session",
    maxAge: 1 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET!],
    sameSite: "lax",
    httpOnly: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use("/image", imageGeneratorRouter);
app.use("/user", userAuthRoutes);
app.use("/google", googleOauthRouter);
app.use("/", contactRouter);

app.get("/", (req, res) => {
  return res.status(401).send("You are not authorized to access this service");
});

app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
});

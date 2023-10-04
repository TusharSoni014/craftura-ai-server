const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const dbconnect = require("./dbconnect");
const cookieParser = require("cookie-parser");
const imageGeneratorRouter = require("./routes/imageGeneratorRouter");
const userAuthRoutes = require("./routes/userAuthRouter");
const contactRouter = require("./routes/contactRouter");
const googleOauthRouter = require("./routes/googleOauthRouter");
const passport = require("passport");
const cookieSession = require("cookie-session");
const promptRouter = require("./routes/promptRouter");
require("./passport-config");
const PORT = process.env.PORT || 4000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

dbconnect();

app.use(
  cors({
    credentials: true,
    origin: [process.env.FE_URL],
  })
);

app.use(
  cookieSession({
    name: "session",
    maxAge: 1 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET],
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
app.use("/prompt", promptRouter);
app.use("/", contactRouter);

app.get("/", (req, res) => {
  return res.status(401).send("You are not authorized to access this service");
});

app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
});

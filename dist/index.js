"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const dbconnect_1 = require("./dbconnect");
const cookie_session_1 = __importDefault(require("cookie-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const imageGeneratorRouter = require("./routes/imageGeneratorRouter");
const userAuthRoutes = require("./routes/userAuthRouter");
const contactRouter = require("./routes/contactRouter");
const googleOauthRouter = require("./routes/googleOauthRouter");
require("./passport-config");
const PORT = process.env.PORT || 4000;
app.use(express_1.default.json({ limit: "2mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
(0, dbconnect_1.dbconnect)();
app.use((0, cors_1.default)({
    credentials: true,
    origin: [process.env.FE_URL],
}));
app.use((0, cookie_session_1.default)({
    name: "session",
    maxAge: 1 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET],
    sameSite: "lax",
    httpOnly: true,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
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

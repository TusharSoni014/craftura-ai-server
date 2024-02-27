const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {

          const email = profile.emails[0].value;
          const emailUsername = email.split("@")[0];

          let username;
          let isUnique = false;

          while (!isUnique) {
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            username = `${emailUsername}${randomNum}`;
            const existingUser = await User.findOne({ username });
            if (!existingUser) {
              isUnique = true;
            }
          }

          const defaultUser = {
            username: username,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
            googleId: profile.id,
          };

          user = new User(defaultUser);
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error("Error in Google OAuth strategy:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log("error deserializing user", error);
    done(error, null);
  }
});

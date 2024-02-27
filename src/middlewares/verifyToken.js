const verifyToken = async (req, res, next) => {
  try {
    const googleOAuthToken = req.user;
    if (googleOAuthToken) {
      req._id = googleOAuthToken._id;
      next();
    } else {
      return res.status(401).send({ message: "Invalid token, login again!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Couldn't connect to servers." });
  }
};

module.exports = verifyToken;

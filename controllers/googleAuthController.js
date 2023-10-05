const getGoogleUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).send({
        message: "Unauthorized! Please login",
      });
    }
    return res.status(200).send({
      username: user.username,
      email: user.email,
      picture: user.picture,
    });
  } catch (error) {
    return res.status(500).send({ message: "Error getting user!" });
  }
};

module.exports = getGoogleUser;

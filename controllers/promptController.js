const Prompt = require("../models/Prompt");

const getRandomPrompt = async (req, res) => {
  try {
    const allPrompts = await Prompt.find();
    if (allPrompts.length === 0) {
      return res
        .status(404)
        .send({ message: "No prompts found in the database" });
    }
    const randomIndex = Math.floor(Math.random() * allPrompts.length);
    const randomPrompt = allPrompts[randomIndex];
    return res.status(200).send(randomPrompt.prompt);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error fetching random prompt", error: error });
  }
};

module.exports = { getRandomPrompt };

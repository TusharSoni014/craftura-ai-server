const { default: axios } = require("axios");
const Post = require("../models/Post");
const User = require("../models/User");

const genImg = async (myPrompt, negPrompt, seed) => {
  const randomSeed = Math.floor(Math.random() * (1000000000 - 1 + 1)) + 1;
  const selectedSeed = seed !== "" ? Number(seed) : randomSeed;

  const requestBody = {
    sessionID: process.env.SESSION_ID,
    prompt: myPrompt,
    negprompt: `${negPrompt}, (((nude))),(((naked))),(((without clothes))),(((exposed breasts))),(((exposed vagina))),(((exposed dick)))`,
    seed: selectedSeed,
    steps: 20,
    modelName: "sdxl_base_r2",
    subseed: Math.floor(randomSeed / 2),
    subseed_strength: 0.5,
  };

  try {
    const response = await fetch(`${process.env.API_SERVER}/api/image`, {
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "text/plain;charset=UTF-8",
        "Alt-Used": process.env.API_ALT,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
      },
      referrer: `${process.env.API_SERVER}/`,
      body: JSON.stringify(requestBody),
      method: "POST",
      mode: "cors",
    });
    const responseJSON = await response.json();
    const imageId = responseJSON.imageID;
    const requestBodyImage = {
      sessionID: requestBody.sessionID,
      imageID: imageId,
    };
    let responseImage = await fetch(`${process.env.API_SERVER}/api/image/status`, {
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "text/plain;charset=UTF-8",
        "Alt-Used": process.env.API_ALT,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
      },
      referrer: `${process.env.API_SERVER}/`,
      body: JSON.stringify(requestBodyImage),
      method: "POST",
      mode: "cors",
    });

    let responseImageJSON = await responseImage.json();

    while (responseImageJSON.status === "pending") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      responseImage = await fetch(`${process.env.API_SERVER}/api/image/status`, {
        headers: {
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "text/plain;charset=UTF-8",
          "Alt-Used": process.env.API_ALT,
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
        },
        referrer: `${process.env.API_SERVER}/`,
        body: JSON.stringify(requestBodyImage),
        method: "POST",
        mode: "cors",
      });
      responseImageJSON = await responseImage.json();
    }
    return { image: responseImageJSON.url, seed: selectedSeed };
  } catch (error) {
    console.error(error);
  }
};

const generateImages = async (req, res) => {
  const userId = req._id;
  let { prompt, amount, negPrompt, seed } = req.body;

  const outputArray = [];
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    if (amount > 4) {
      return res.status(400).send({ message: "Amount cannot be more than 4" });
    }

    for (let i = 0; i < amount; i++) {
      const imageResponse = await genImg(prompt, negPrompt, seed);
      const image = await Post.create({
        url: imageResponse.image,
        seed: imageResponse.seed,
        prompt: prompt,
        owner: userId,
        negPrompt: negPrompt,
      });
      await User.findByIdAndUpdate(userId, { $push: { posts: image.url } });
      const imageContent = await axios.get(imageResponse.image, {
        responseType: "arraybuffer",
      });
      const base64Image = Buffer.from(imageContent.data, "binary").toString(
        "base64"
      );
      outputArray.push({
        image: base64Image,
        seed: imageResponse.seed,
        prompt: image.prompt,
        negPrompt: image.negPrompt,
        _id: image._id,
      });
    }
    return res.send({
      output: outputArray,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error generating image, try again!", error: error });
  }
};

const PAGE_SIZE = 8;
const getPaginatedPosts = async (pageNumber) => {
  const skip = (pageNumber - 1) * PAGE_SIZE;
  const posts = await Post.find()
    .skip(skip)
    .limit(PAGE_SIZE)
    .sort({ createdAt: -1 });
  return posts;
};

const encodeImageToBase64 = async (imageUrl) => {
  const axiosResponse = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });
  const base64Image = Buffer.from(axiosResponse.data).toString("base64");
  return `data:${axiosResponse.headers["content-type"]};base64,${base64Image}`;
};

const getAllImages = async (req, res) => {
  try {
    const pageNumber = parseInt(req.params.page);
    const posts = await getPaginatedPosts(pageNumber);
    const images = await Promise.all(
      posts.map(async (post) => ({
        _id: post._id,
        url: await encodeImageToBase64(post.url),
      }))
    );

    res.json({ posts: images });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error loading posts!" });
  }
};

const deletePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req._id;
  if (!postId) {
    return res.status(400).send({ message: "Requested post not found!" });
  }
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .send({ message: "Post is already deleted or not found!" });
    }

    if (post.owner.toString() !== userId.toString()) {
      return res.status(403).send({
        message: "You do not have permission to delete this post",
      });
    }
    const user = await User.findById(userId);
    if (user) {
      user.posts = user.posts.filter((url) => url !== post.url);
      await user.save();
    }
    await Post.findByIdAndRemove(postId);

    return res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).send({ message: "Error deleting post" });
  }
};

const getUserImages = async (req, res) => {
  const pageSize = 8;
  try {
    const username = req.params.username;
    const page = req.params.page;
    const user = await User.findOne({ username: username }, "-password -email");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const posts = await Post.find({ owner: user._id })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select("negPrompt prompt seed url _id")
      .sort({ createdAt: -1 });

    const postsWithBase64Images = await Promise.all(
      posts.map(async (post) => {
        const imageUrl = post.url;
        try {
          const response = await axios.get(imageUrl, {
            responseType: "arraybuffer",
          });
          if (response.status === 200) {
            const base64Image = Buffer.from(response.data, "binary").toString(
              "base64"
            );
            post.url = `data:image/png;base64,${base64Image}`;
          }
        } catch (error) {
          console.error("Error fetching image:", error.message);
        }
        return post;
      })
    );
    return res.status(200).send({ posts: postsWithBase64Images });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Some error occured" });
  }
};

module.exports = {
  generateImages,
  getAllImages,
  getUserImages,
  deletePost,
};

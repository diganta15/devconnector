const express = require("express");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const router = express.Router();

//@route    POST api/posts
//@desc     Create a post
//@access   Private
router.post(
	"/",
	[auth, [check("text", "text is requires").not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await User.findById(req.user.id).select("-password");
			const newPost = new Post({
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			});
			const post = await newPost.save();
			res.json(post);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send("Server Error");
		}
	}
);

//@route	GET api/posts
//@desc		Get all posts
//@access	Private
router.get("/", auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 });
		res.json(posts);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send("Server error");
	}
});

//@route	GET api/posts/:id
//@desc		Get post by id
//@access	Private
router.get("/:id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({
				msg: "Post not found",
			});
		}
		res.json(post);
	} catch (err) {
		console.error(err.message);

		if (err.kind === "ObjectId") {
			return res.status(404).json({
				msg: "Post not found",
			});
		}

		return res(500).send("Server error");
	}
});

//@route	DELETE api/posts/:id
//@desc 	Delete a post
//@access	Private
router.delete('/:id',auth,async(req,res)=>{
	try {
		const post = await Post.findById(req.params.id);
		console.log(post)
		if (!post) {
			return res.status(404).json({
				msg: "Post not found",
			});
		}
		//Check on user
		if(post.user.toString() !== req.user.id){
			return res.status(401).json({msg:"User not authorized"});

		}	
		await post.remove();

		res.status(200).json({msg:"Post removed"});

	} catch (err) {
		console.error(err.message);
		if (err.kind === "ObjectId") {
			return res.status(404).json({
				msg: "Post not found",
			});
		}

		return res.status(500).send("Server error");
	}
})
module.exports = router;

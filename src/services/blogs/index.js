import express from "express";
import q2m from "query-to-mongo";
import BlogModel from "./schema.js";

const blogRouter = express.Router();

blogRouter.get("/", async (req, resp, next) => {
  try {
    const query = q2m(req.query);
    const blogs = await BlogModel.find(query.criteria, query.options.fields)
      .limit(query.options.limit)
      .skip(query.options.skip)
      .sort(query.options.sort)
      .populate("user");
    resp.send(blogs);
  } catch (err) {
    next(err);
  }
});

blogRouter.post("/", async (req, resp, next) => {
  try {
    const blog = await new BlogModel(req.body).save();
    resp.status(201).send(blog);
  } catch (err) {
    console.log(err);
    resp.status(500).send({ message: err.message });
  }
});

blogRouter.post("/:id/comments", async (req, resp, next) => {
  try {
    const comment = req.body;
    const updatedBlog = await BlogModel.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: comment } },
      { new: true }
    );
    if (updatedBlog) {
      resp.send(updatedBlog);
    }
  } catch (err) {
    next(err);
  }
});

blogRouter.get("/:id/comments", async (req, resp, next) => {
  try {
    const blog = await BlogModel.findById(req.params.id).populate(
      "comments.user"
    );
    if (blog) {
      resp.send(blog.comments);
    } else {
      resp
        .status(404)
        .send({ message: `blog with ${req.params.id} is not found!` });
    }
  } catch (err) {
    next(err);
  }
});

blogRouter.delete("/:id/comments/:commentId", async (req, resp, next) => {
  try {
    const blog = await BlogModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: { _id: req.params.commentId },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (blog) {
      resp.send(blog);
    } else {
      resp
        .status(404)
        .send({ message: `blog with ${req.params.id} is not found!` });
    }
  } catch (err) {
    next(err);
  }
});

export default blogRouter;

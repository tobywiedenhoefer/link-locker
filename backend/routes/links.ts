import { Router } from "express";

const router = Router();

// get

router.get("/", (req, res) => {
  res.json({ message: "get all links" });
});

router.get("/:id", (req, res) => {
  res.json({ message: "get a single link" });
});

// post

router.post("/", (req, res) => {
  res.json({ message: "post a new link" });
});

// delete

router.delete("/:id", (req, res) => {
  res.json({ message: "delete a new link" });
});

// upate

router.patch("/:id", (req, res) => {
  res.json({ message: "update a new link" });
});

export { router as linksRoutes };

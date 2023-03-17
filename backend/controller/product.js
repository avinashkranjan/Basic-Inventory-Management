const express = require("express");
const router = express.Router();
const Product = require("../model/product");

router.get("/product", async (req, res) => {
  Product.find({})
    .sort({ $natural: -1 })
    .then((products) => {
      res.status(200).send(products);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while fetching the products.");
    });
});

router.get("/product/:id", async (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      res.status(200).send(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while fetching the products.");
    });
});

router.post("/product", async (req, res) => {
  const { productName, quantity, imageUrl } = req.body;

  console.log(req.body);

  const product = new Product({
    productName,
    quantity,
    imageUrl,
  });

  product
    .save({})
    .then((product) => {
      res.status(200).send(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while adding the product.");
    });
});

router.put("/product/:id", async (req, res) => {
  const { productName, quantity, imageUrl } = req.body;

  console.log(req.body);

  Product.findByIdAndUpdate(req.params.id, {
    productName,
    quantity,
    imageUrl,
  })
    .then((product) => {
      res.status(200).send(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while updating the product.");
    });
});

router.delete("/product/:id", async (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      res.status(200).send(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while deleting the product.");
    });
});

module.exports = router;

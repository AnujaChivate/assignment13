const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Database connection URL
const dbUrl =
    "mongodb+srv://anuja:anuja@nodeproject.3lp3mm4.mongodb.net/?retryWrites=true&w=majority";

const app = express();
app.use(express.static(__dirname));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(
    dbUrl,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) console.log("MongoDB database connection error", err);
        else console.log("MongoDB database connection successful");
    }
);

// Create MongoDB cluster
const Product = mongoose.model("product", {
    productid: Number,
    category: String,
    price: Number,
    name: String,
    instock: Boolean,
});

// GET endpoint to retrieve all products
app.get("/product/get/", (req, res) => {
    Product.find({}, (err, products) => {
        if (err) console.log("error: ", err);
        else res.send(products);
    });
});

// POST endpoint to create a new product
app.post("/product/create/", (req, res) => {
    const { id, category, price, name, instock } = req.body;
    let product = new Product({
        productid: id,
        category,
        price,
        name,
        instock,
    });

    product.save((err) => {
        if (err) {
            res.sendStatus(500);
            console.log("Error in saving data: ", err);
        } else {
            res.sendStatus(200);
        }
    });
});

// DELETE endpoint to delete a product using ID
app.delete("/product/delete/:id", (req, res) => {
    Product.deleteOne({ productid: req.params.id }, (err) => {
        if (err) console.log("Delete Error: ", err);
        else res.sendStatus(200);
    });
});

// PUT endpoint to update availability of product
app.put("/product/update/:id", (req, res) => {
    Product.findOneAndUpdate(
        { productid: req.params.id },
        {
            instock: req.body.status,
        },
        { upsert: false },
        (err) => {
            if (err) console.log("Update Error: ", err);
            else res.sendStatus(200);
        }
    );
});

// Create NodeJS server and run at port 3001
const server = app.listen(3001, () => {
    console.log("Server is listening on port", server.address().port);
});

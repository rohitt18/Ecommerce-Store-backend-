require("dotenv").config();
//async errors
require("express-async-errors");

const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");

// import error middlewares
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// express json middleware
app.use(express.json());

// routes

app.get("/", (req,res)=>{
    res.send("<h1>Store API</h1><a href='/api/v1/products'>products route</a>");
});

// set up the router and providing the base path
app.use("/api/v1/products", productsRouter ); 

// products route
app.get("/api/v1/products", (req,res) => {
    res.send("products page");
})

// error middlewares
app.use(notFound);  //if user hits the route which does not exist we need this error
app.use(errorHandlerMiddleware); // this will catch all the errors & then we decide what is going to be our response

// PORT
const port = process.env.PORT || 3000;

// this func returns a promise therefore we set up start with async and await
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, ()=>{
            console.log(`Server is running on port ${port}...`);
        })
    } catch (error) {
        console.log(error);
    }
}
start()
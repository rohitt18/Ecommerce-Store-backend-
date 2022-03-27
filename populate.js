// to populate the dummy data (products.json) into the DataBase in 1 sec
// simply means to dynamically add our dummyData to our DB

require("dotenv").config();
const connectDB = require("./db/connect");
const Product = require("./models/Product");
const jsonProducts = require("./products.json");

// another connection for DB since we wanna connect to the DB one more time for populating the dummy data into the DB
// but this time we'll not set up app.listen, we simply wanna connect to the DB & then use the model to automatically 
// add those json products (products.json) to our DB. 


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Product.deleteMany();  // first we want to remove all the products that are currently there in the DB
        await Product.create(jsonProducts);
        console.log("Success!!");
        // in node there is a method by the name of exit & it is very useful in this case bec
        // we have our populate.js, if we're successful then we might as well just terminate the whole process 
        // i mean we dont need this file to be running & if there's an error then again we'll exit but maybe with a error
        process.exit(0);  // And if we pass 0, that just means everything went well & we're just exiting the process
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

start();
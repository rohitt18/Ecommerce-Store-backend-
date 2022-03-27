// numeric filters are more complex than string filters

const Product = require("../models/Product");

const getAllProductsStatic = async (req, res) => {
   
  const products = await Product.find({price:{$gt:30}}).sort('price').select('name price');
  // throw new Error("testing async errors"); 
  res.status(200).json({ products, nbHits: products.length });
};
const getAllProducts = async (req, res) => { 
  const { featured, company, name, sort, fields, numericFilters } = req.query;   // options for filtering featured/company/name
  const queryObject = {}; 

  if(featured){
    queryObject.featured = featured === 'true' ? true : false;
  }
  if(company){
    queryObject.company = company  // if the company exist,then i just want to set up my property on a query object.
  }
  if(name){
    queryObject.name = { $regex: name, $options: "i" };  // regex ka use: name agar 'a' set karenge toh voh sare items dega jisme atleast 1 'a' hoga
  }
  // numeric filters
  if(numericFilters){
    const operatorMap = {  
      ">":"$gt",  
      ">=":"$gte",  // here i want to map the user-friendly one
      "=":"$eq",    // to the ones that are understood by the mongoose
      "<":"$lt",
      "<=":"$lte",
    }
    const regEx = /\b(>|>=|=|<|<=)\b/g  // REGULAR EXPRESSION
    // And then comes the REPLACE method where i call numericFilters which ofc is going to be my string(">=")
    // & then ill pass my regular expression and if there is a match then ofc we'll convert from the user-friendly one
    // to the one that is understood by the mongoose using a callback func as the second argument
    let filters = numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`) // iterating an object ka concept (get me that key & effectively ill swap the values)
    // console.log(filters);
    // We've successfully converted our values to the ones that are understood by the mongoose but we're not done
    // bec ofc i cannot pass this one into my query object, we need to do a bit more data massaging
    const options = ['price', 'rating'] // you can only do this on these properties bec ofc these properties have number values 
    filters = filters.split(",").forEach((item)=>{ // iterate over that array & in the callback func ill have access to that item & its going to be a string of price and the same for rating
      const [field,operator,value] = item.split("-")  // array destructuring where i can pull-out the values
      if(options.includes(field)){
        queryObject[field] = {[operator]:Number(value)}; // dynamically setting up the property on queryObject
      }
    })
  } 


  console.log(queryObject);
  let result = Product.find(queryObject); // In order for this functionality to work where we actually are chaining the sort if ofc it's passed in by the user
  // *sort*
  // Now lets sort our data then we'll implement it in our getProducts as well
  // sorting - does not affect the amount of items we're returning, just the order in which they are displayed
  if(sort){     // we need to remove this await & the way it will look like is this..
    // console.log(sort);      //              
    const sortList = sort.split(',').join(' ');  // essentially i split it into an array & then from the array i join it back together 
    // console.log(sortList);
    result = result.sort(sortList);  // clg(sort) karenge tab 'name,price' ata hai but actual syntax 'name price' hai isliye aysa karna padta hai
  } else{
    result = result.sort('createdAt');
  }
  // *fields* [actual method name select]
  if(fields){    // jo fields select karoge vahi data milega 
    const fieldList = fields.split(',').join(" "); // in this process we'll remove that comma 
    result = result.select(fieldList);
  }
  // *limit & skip* (by using these two we can actaully set up a option for the user to choose a page)
  const page = Number(req.query.page) || 1  // destructure bhi kar sakte hai req.query se page ko but not necessary & bydefault its string(page:'2') therefore we set it to Number
  const limit = Number(req.query.limit) || 10  // bec req.query mai hamesha strings hi hote hai isliye usko Number mai change karna padta hai manually
  const skip = (page -1) * limit;
  // logic for skip - agar sidha page 2 pe click karega toh (2-1)*7 = 7 items so thats how ill see the 2nd page
  result = result.skip(skip).limit(limit);
  // 23 products total
  // so if i decide to limit my response to only seven items, how many pages i have?
  // 4 pages as [7,7,7,2]
  const products = await result;
  res.status(200).json({products, nbHits: products.length});
};

module.exports = { getAllProductsStatic, getAllProducts };
 


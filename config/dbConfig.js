const mongoose = require("mongoose");
const dbConnect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connection Successful");        
    } catch (error) {
        console.log("Connection Failed :",error.message);
    }
}
module.exports = dbConnect;
import mongoose from "mongoose";

const mongoosedb = async() => {
    mongoose.connection.on('connected', () => {
        console.log("db is connected");
    })

    mongoose.connect(`${process.env.MONGO_URI}/lms`)
}

export default mongoosedb;
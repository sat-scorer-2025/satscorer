import mongoose from "mongoose";
// import dotenv from "dotenv";
export const connectDB = async()=>{
    mongoose.connection.on('connected',()=>{
        console.log('Mongo Atlas Database Connected...');
    })

    await mongoose.connect(`${process.env.DATABASE_URL}SatScorer`);
}


// import mongoose from "mongoose";
// import dotenv from "dotenv";

// export const connectDB = async () => {
//   try {
//     mongoose.connection.on('connected', () => {
//       console.log('Mongo Database Connected...');
//     });

//     await mongoose.connect(process.env.DATABASE_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   } catch (error) {
//     console.error('MongoDB Connection Error:', error.message);
//     process.exit(1);
//   }
// };

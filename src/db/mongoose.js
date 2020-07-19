const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
// define model





// Challenges

// const todo = new Task({
//     description: "Studying ReactJs"
  
// });
// todo
//   .save()
//   .then((res) => {
//     console.log("result: ", res);
//   })
//   .catch((err) => console.log("failed to save"));

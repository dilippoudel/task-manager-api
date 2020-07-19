const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express();
const port = process.env.PORT
app.use(express.json())
// registered the user router to app which is bounded in express framework
app.use(userRouter)
// registered the task router to app which is bounded in express framework
app.use(taskRouter)
app.listen(port, ()=> {
    console.log('Server has been started on port '+ port)
})



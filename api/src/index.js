const express = require( 'express' );
const cors = require('cors');

const taskRoutes = require('./routes/tasks.routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(taskRoutes)

app.use((err, req, res, next) => {
    return res.json({
        message: err.message
    })
})

app.listen(4000)
console.log('React-Open on port 4000')
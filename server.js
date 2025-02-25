import express from 'express'
import Connect from './database/db.js'
import "./helpers/env.js";
import AuthRouter from './routes/auth-route.js';
import homeRouter from './routes/home-route.js';
import adminRoute from './routes/admin-route.js';
import fileRouter from './routes/file-route.js';


Connect();

const app = express()
const PORT = process.env.PORT



app.use(express.json())
app.use('/api/auth', AuthRouter)
app.use('/api/home', homeRouter)
app.use('/api/admin', adminRoute)
app.use('/api/image', fileRouter)

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
})
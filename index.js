import 'dotenv/config'
import express from 'express'
import connectDb from './src/db/connectDb.js'
import cors from 'cors'
import UserRouter from './src/routes/userRoute.js';
import RoleRouter from './src/routes/roleRoute.js';
import OrganizerRouter from './src/routes/organizerRoute.js';
import DestinationRouter from './src/routes/destinationRoute.js';
import { fileURLToPath } from 'url';
import path from 'path'
import PriceRouter from './src/routes/priceRoute.js';
import DurationRouter from './src/routes/durationRoute.js';
import TripTypeRouter from './src/routes/tripTypeRoute.js';
import TripFilterRouter from './src/routes/tripFilterRoute.js';
import TripRouter from './src/routes/tripRoute.js';
import DocumentRouter from './src/routes/documentRoute.js';
import AdminRouter from './src/routes/adminRoute.js';
import JoiningRequestRouter from './src/routes/joiningRequestRoute.js';

// import moment from 'moment';
// import  moment from 'moment-timezone';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT;
const app = express()

app.use(cors())
app.use(express.json())

app.use(express.urlencoded({extended:false}))
app.use('/public', express.static(path.join(__dirname, './public')))


app.use('/api/users',UserRouter)
app.use('/api/organizers',OrganizerRouter)
app.use('/api/roles',RoleRouter) 
app.use('/api/destinations',DestinationRouter)
app.use('/api/prices',PriceRouter)
app.use('/api/durations',DurationRouter)
app.use('/api/trip-types',TripTypeRouter)
app.use('/api/filters',TripFilterRouter)
app.use('/api/trips',TripRouter)
app.use('/api/documents',DocumentRouter)
app.use('/api/admins',AdminRouter)
app.use('/api/requests',JoiningRequestRouter)
// console.log("hello")
// console.log(moment("2001-10-04T18:30:00.000Z").format("DD-MM-YYYY"))
// const utcDate = "2001-10-04T18:30:00.000Z"
// const istDate = moment.utc(utcDate).tz('Asia/Kolkata').format("DD-MM-YYYY HH:mm:ss");
// console.log(istDate)

app.get("/",(req,res)=>{
    res.send("hello")

})

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
import express from 'express';
import './utils/db.js';
import { AdminRouter } from './Routes/Admin.route.js';
import { IPORouter } from './Routes/IPO.route.js';
import { CustomerRouter } from './Routes/Customer.route.js';
import cors from 'cors';
const app=express();
app.use(cors())
app.use(express.json());
app.use('/api/admin',AdminRouter)
app.use('/api/ipo',IPORouter)
app.use('/api/customer',CustomerRouter)

const PORT=8080;
app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})
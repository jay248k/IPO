import express from 'express';
import './utils/db.js';
import { AdminRouter } from './Routes/Admin.route.js';
import { IPORouter } from './Routes/IPO.route.js';
import { CustomerRouter } from './Routes/Customer.route.js';
import cors from 'cors';
const app=express();
app.use(cors({
    origin: 'https://ipo-ubmb.onrender.com', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use('/api/admin',AdminRouter)
app.use('/api/ipo',IPORouter)
app.use('/api/customer',CustomerRouter)

const PORT= process.env.URL||8080;
app.listen(PORT,()=>{
    console.log(`${PORT}`)
})
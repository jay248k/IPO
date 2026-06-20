import express from 'express';
import './utils/db.js';
import { AdminRouter } from './Routes/Admin.route.js';
import { IPORouter } from './Routes/IPO.route.js';
import { CustomerRouter } from './Routes/Customer.route.js';
import cors from 'cors';
const app=express();
app.use(cors({
    origin: 'https://ipoinfo.netlify.app', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
// app.use(cors())
app.use(express.json());
app.use('/api/admin',AdminRouter)
app.use('/api/ipo',IPORouter)
app.use('/api/customer',CustomerRouter)
app.get('/', (req, res) => {
  res.send('Server is running');
});
const PORT = process.env.PORT || 8080;

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
});
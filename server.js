import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRouter.js';
import orderModel from './models/orderModel.js';
import orderRouter from './routes/orderRouter.js';


// App Config
const app = express();
const port = process.env.PORT || 4000
connectDB();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(cors());


//api endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/orders', orderRouter);

app.get('/', (req, res)=>{
    res.send('API is working');
})


// listening End Point
app.listen(port, ()=> console.log("Server is started on PORT+"+ port))
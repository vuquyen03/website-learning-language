import express from 'express'; 
import * as dotenv from 'dotenv';
import path from 'path';
import connectDB from './src/config/connection.js';
import cors from 'cors';
import user from './src/routes/userRoute.js';
import course from './src/routes/courseRoute.js';
import cookieParser from 'cookie-parser';


dotenv.config();

// create express app
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
      credentials: true, // Cho phép gửi cookie qua CORS
      origin: true // Cho phép tất cả các nguồn gốc (origin) truy cập
    })
  );
app.use(cookieParser()); // đọc và ghi cookie trong các yêu cầu HTTP

const PORT = process.env.PORT || 5000;

// connect to database
connectDB(process.env.MONGODB_URI);

// Routes
app.use('/api/v1/user', user);
app.use('/api/v1/course', course);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

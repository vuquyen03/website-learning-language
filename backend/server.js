import express from 'express'; 
import * as dotenv from 'dotenv';
import connectDB from './src/config/connection.js';
import morgan from 'morgan';
import cors from 'cors';
import user from './src/routes/userRoute.js';
import course from './src/routes/courseRoute.js';
import quiz from './src/routes/quizRoute.js';
import question from './src/routes/questionRoute.js';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import helmet from 'helmet';

dotenv.config();

// create express app
const app = express();
const csrfProtection = csurf({ cookie: true });

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
      credentials: true, 
      origin: true 
    })
  );
app.use(cookieParser()); // đọc và ghi cookie trong các yêu cầu HTTP
app.use(morgan("dev"));
// Middleware to set Cache-Control headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store', 'no-cache');
  next();
});

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "https://www.google.com", 
      "https://www.google.com/recaptcha/", 
      "https://www.gstatic.com/"
    ],
    styleSrc: [
      "'self'",
      "https://fonts.googleapis.com"
    ],
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    imgSrc: [
      "'self'",
      "data:",
      "https://www.google.com",
    ],
    connectSrc: [
      "'self'",
      "https://www.google.com", 
      "https://www.google.com/recaptcha/", 
    ],
    frameSrc: [
      "'self'",
      "https://www.google.com/recaptcha/", 
    ]
  }
}));

// app.use(csrfProtection);

const PORT = process.env.PORT || 5000;

// connect to database
connectDB(process.env.MONGODB_URI);

// CSRF token route
app.get('/api/v1/csrf-token', csrfProtection, (req, res) => {
  const csrfToken = req.csrfToken(); // Lấy CSRF token từ request
  console.log('csrfToken', csrfToken);
  res.status(200).json({csrfToken: csrfToken}); // Không cần gửi phản hồi JSON
});

// Routes
app.use('/api/v1/user', user);
app.use('/api/v1/course', course);
app.use('/api/v1/quiz', quiz);
app.use('/api/v1/question', question);  

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import { router } from './routes/authRoutes';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const allowedOrigins = [
  "https://sujitha-sekar.github.io",
  "http://localhost:4200" 
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use('/api', router);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
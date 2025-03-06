import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || '3000';
const app = express();

function setupExpress() {
    app.get('/', (req, res) => {
        res.status(200).send('<h1>neuro backend is running</h1>');
    });
}

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

setupExpress();
startServer();

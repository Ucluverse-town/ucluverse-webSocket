import express from 'express';
import cors from 'cors';

const createApp = () => {
    const app = express();
    app.use(express.json());
    app.use(
        cors({
            origin: ['http://localhost:3002', 'http://localhost:3001', 'http://localhost:300']
        }),
    )
    return app;
}

export default createApp;
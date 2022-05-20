import express from 'express';
import cors from 'cors';

const createApp = () => {
    const app = express();
    app.use(express.json());
    app.use(
        cors({
            origin: 'http://localhost:3000'
        }),
    )
    return app;
}

export default createApp;
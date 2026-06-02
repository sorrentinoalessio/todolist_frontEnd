
import express from 'express';
import { registerRoutes } from './src/routes/routes.js';
import { connect } from './database.js';
import { SchedulerService } from './src/services/schedulerService.js';
import {Server} from 'socket.io';
import http from 'http';
import SocketIoInitializer from './src/components/SocketIoInitializer.js';

export const host = 'localhost';
export const port = 3001;
const app = express();

app.use(express.json());

/*
app.get('/', (req, res) => {
  res.send('Server attivo!');
});
*/

await connect()
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // solo per sviluppo/test
    methods: ["GET", "POST"]
  }
});
registerRoutes(app);
new SocketIoInitializer(io);
const scheduler = new SchedulerService();
await scheduler.getJob();
await scheduler.start();
app.use((err, req, res, next) => {
    if(err?.error && err.error.isJoi) {
        res.status(400).json({type: err.type, message: err.error.toString()});
    }
    else{
        next(err);
    }
})
httpServer.listen(port, host, () => {
    console.log(`Server avviato ${host}: ${port}.`)
})

export default app;


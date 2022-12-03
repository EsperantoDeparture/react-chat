import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { Server, Socket } from 'socket.io';
import http from 'http';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

dotenv.config();

interface Message {
    username: string;
    text: string;
    date: number;
}

const messages: Message[] = [];

const app: Express = express();
app.use(cors());
const port = process.env.PORT;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: '*',
    }
  });

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/messages', (req: Request, res: Response) => {
  res.send(messages);
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

io.on('connection', (socket: Socket<DefaultEventsMap, any>) => {
    console.log('a user connected');

    socket.on('message-added', (message: Message) => {
        messages.push(message);
        socket.broadcast.emit('message-added', messages);
    });
});
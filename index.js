import { createServer } from 'http';
import { Server } from 'socket.io';

let allCounts = {};

const PORT = Number(process.env.PORT)

const ORIGIN = 'https://tumo-alex2012as-client.vercel.app';

const httpServer = createServer();

const io = new Server(httpServer, { cors: { origin: ORIGIN } });

io.on('connection', (socket) => {
    console.log(socket.id, 'client server connection');

    socket.join('room');

    if (!allCounts[socket.id]) {
        allCounts[socket.id] = 0;
    }

    socket.emit('update-count', allCounts);

    socket.on('increase-count', () => {
        console.log(allCounts[socket.id], 'increase-count');
        allCounts[socket.id]++;
        if (allCounts[socket.id] >= 30) {
            io.to('room').emit('winner', socket.id);
            io.socketsLeave("room");
        }
        io.to('room').emit('update-count', allCounts);
    })

    socket.on('disconnect', () => {
        delete allCounts[socket.id];
        socket.leave('room');
    });
});

httpServer.listen(PORT, '0.0.0.0', () => console.log(`🟢  http://localhost:${PORT}`));

import { Server } from "socket.io";
import { registerSocketHandlers } from "./handler.js";
let io;

export function initializeSocket(fastify) {
    io = new Server(fastify.server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);
        registerSocketHandlers(io, socket);
        socket.on("disconnect", () => {
            console.log("Client Disconnected", socket.id);
        })
    });
    return io;
}

export function getIO() {
    return io;
}
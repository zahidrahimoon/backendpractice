import { getRoomMessages, savedRoomMessage } from "../db/messages.repository.js";

export function registerSocketHandlers(io, socket) {
    let socketUsername = null;

    // Join room - handles joining with username
    socket.on("join-room", async (data, ack) => {
        try {
            const roomId = typeof data === 'string' ? data : data.roomId;
            const username = typeof data === 'object' ? data.username : null;

            socketUsername = username || socket.id;

            socket.join(roomId);
            console.log(`${socketUsername} (${socket.id}) joined room ${roomId}`);

            const messages = await getRoomMessages(roomId);
            socket.emit("room-history", messages);
            socket.emit("room-joined", roomId);

            socket.to(roomId).emit("user-joined", {
                userId: socket.id,
                username: socketUsername,
                roomId,
            });

            if (ack) {
                ack({ status: "success", roomId });
            }
        } catch (error) {
            console.error("join-room error:", error);
            if (ack) {
                ack({ status: "error", reason: error.message });
            }
        }
    });

    // Send message - handles saving and broadcasting with username
    socket.on("room-message", async (data, ack) => {
        try {
            const { roomId, message, username } = data;
            const senderName = username || socketUsername || socket.id;

            const savedMessage = await savedRoomMessage(roomId, socket.id, message);

            io.to(roomId).emit("room-message", {
                id: savedMessage.id,
                roomId: savedMessage.room_id,
                from: savedMessage.sender_id,
                username: senderName,
                message: savedMessage.message,
                createdAt: savedMessage.created_at,
            });

            if (ack) {
                ack({ status: "success", messageId: savedMessage.id });
            }
        } catch (error) {
            console.error("room-message error:", error);
            if (ack) {
                ack({ status: "error", reason: "Message not saved" });
            }
        }
    });

    // Leave room
    socket.on("leave-room", (roomId) => {
        socket.leave(roomId);
        console.log(`${socketUsername || socket.id} left room ${roomId}`);
        socket.emit("room-left", roomId);
        socket.to(roomId).emit("user-left", {
            userId: socket.id,
            username: socketUsername,
            roomId,
        });
    });

    // Ping/pong
    socket.on("ping", () => {
        socket.emit("pong", "pong!");
    });
}
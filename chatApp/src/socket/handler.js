import { getRoomMessages, savedRoomMessage } from "../db/messages.repository.js";

export function registerSocketHandlers(io, socket) {

    // Join room - only handles joining
    socket.on("join-room", async (roomId, ack) => {
        try {
            socket.join(roomId);
            console.log(`${socket.id} joined room ${roomId}`);

            const messages = await getRoomMessages(roomId);
            socket.emit("room-history", messages);
            socket.emit("room-joined", roomId);

            socket.to(roomId).emit("user-joined", {
                userId: socket.id,
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

    // Send message - handles saving and broadcasting with ack
    socket.on("room-message", async ({ roomId, message }, ack) => {
        try {
            const savedMessage = await savedRoomMessage(roomId, socket.id, message);
            
            io.to(roomId).emit("room-message", {
                id: savedMessage.id,
                roomId: savedMessage.room_id,
                from: savedMessage.sender_id,
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
        console.log(`${socket.id} left room ${roomId}`);
        socket.emit("room-left", roomId);
        socket.to(roomId).emit("user-left", {
            userId: socket.id,
            roomId,
        });
    });

    // Ping/pong
    socket.on("ping", () => {
        socket.emit("pong", "pong!");
    });
}
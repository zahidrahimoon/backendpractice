let socket;
let currentRoom = null;
const logBox = document.getElementById("log");


function log(message) {
    const p = document.createElement("p");
    p.textContent = message;
    logBox.appendChild(p);
}

document.getElementById("connectBtn").addEventListener("click", () => {
    socket = io("http://localhost:3000");

    socket.on("connect", () => {
        log("Connected to ID: " + socket.id);

        socket.emit("ping");
    });

    socket.on("room-joined", (roomId) => {
        currentRoom = roomId;
        log("Joined room: " + roomId);
    })

    socket.on("room-left", (roomId) => {
        currentRoom = null;
        log("Left room: " + roomId);
    })

    socket.on("user-joined", (data) => {
        log(`User ${data.userId} joined room ${data.roomId}`);
    })

    socket.on("user-left", (data) => {
        log(`User ${data.userId} left room ${data.roomId}`);
    })

    socket.on("room-message", (data) => {
        log(`User ${data.userId} sent message ${data.message} in room ${data.roomId}`);
    })

    socket.on("pong", (msg) => {
        log("server says: " + msg);
    });

    socket.on("message", (data) => {
        log(`Message from ${data.from}: ${data.text}`);
    });

    socket.on("disconnect", () => {
        log("Socket disconnected");
    });
});



document.getElementById("joinRoomBtn").addEventListener("click", () => {
    const input = document.getElementById("roomInput");
    const roomId = input.value;

    if (!socket || !socket.connected) {
        alert("Socket not connected");
        return;
    }

    socket.emit("join-room", roomId, (response) => {
        if (response.status === "success") {
            log("Joined room: " + response.roomId);
        } else {
            log("Failed to join: " + response.reason);
        }
    });

});


document.getElementById("leaveRoomBtn").addEventListener("click", () => {
    if (!socket || !socket.connected) {
        alert("Socket not connected");
        return;
    }

    socket.emit("leave-room", currentRoom);
    log("Left room: " + currentRoom);
    currentRoom = null;
});



document.getElementById("sendBtn").addEventListener("click", () => {
    const input = document.getElementById("messageInput");
    const message = input.value;

    if (!socket || !socket.connected) {
        alert("Socket not connected");
        return;
    }

    if (!currentRoom) {
        alert("Not joined any room");
        return;
    }
    socket.emit("room-message", { roomId: currentRoom, message }, (response) => {
        if (response.status === "success") {
            log("Message sent, ID: " + response.messageId);
        } else {
            log("Failed to send: " + response.reason);
        }
    });

    socket.on("room-history", (messages) => {
        log("---- Message History ----");
        messages.forEach((msg) => {
            log(`[${msg.room_id}] ${msg.sender_id}: ${msg.message}`);
        });
    });

    log(`${currentRoom} You: ${message}`).value = "";
});

let socket;
let currentRoom = null;
let username = null;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const appContainer = document.getElementById('appContainer');
const usernameInput = document.getElementById('usernameInput');
const joinBtn = document.getElementById('joinBtn');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const newRoomInput = document.getElementById('newRoomInput');
const createRoomBtn = document.getElementById('createRoomBtn');
const roomsList = document.getElementById('roomsList');
const roomsEmpty = document.getElementById('roomsEmpty');
const chatArea = document.getElementById('chatArea');
const emptyState = document.getElementById('emptyState');
const chatHeader = document.getElementById('chatHeader');
const messagesArea = document.getElementById('messagesArea');
const inputArea = document.getElementById('inputArea');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const roomAvatar = document.getElementById('roomAvatar');
const roomName = document.getElementById('roomName');
const leaveBtn = document.getElementById('leaveBtn');

// Format time
function formatTime(date) {
    return new Date(date || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Add message to chat
function addMessage(sender, text, isOwn = false, time = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isOwn ? 'sent' : 'received'}`;

    messageDiv.innerHTML = `
        <div class="message-content">
            ${!isOwn ? `<div class="sender-name">${sender}</div>` : ''}
            <div class="text">${text}</div>
            <div class="meta">
                <span class="time">${formatTime(time)}</span>
                ${isOwn ? '<span class="check">✓✓</span>' : ''}
            </div>
        </div>
    `;

    messagesArea.appendChild(messageDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Add system message
function addSystemMessage(text) {
    const div = document.createElement('div');
    div.className = 'system-msg';
    div.innerHTML = `<span>${text}</span>`;
    messagesArea.appendChild(div);
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Update room in sidebar
function updateRoomLastMsg(roomId, msg) {
    const roomEl = document.querySelector(`.room-item[data-room="${roomId}"]`);
    if (roomEl) {
        const lastMsg = roomEl.querySelector('.room-last-msg');
        if (lastMsg) lastMsg.textContent = msg;
    }
}

// Add room to sidebar
function addRoomToList(roomId) {
    if (document.querySelector(`.room-item[data-room="${roomId}"]`)) return;

    roomsEmpty.classList.add('hidden');

    const roomItem = document.createElement('div');
    roomItem.className = 'room-item';
    roomItem.dataset.room = roomId;
    roomItem.innerHTML = `
        <div class="room-avatar">${roomId.charAt(0).toUpperCase()}</div>
        <div class="room-info">
            <div class="room-name">${roomId}</div>
            <div class="room-last-msg">Joined</div>
        </div>
    `;
    roomItem.addEventListener('click', () => switchRoom(roomId));
    roomsList.appendChild(roomItem);
}

// Remove room from sidebar
function removeRoomFromList(roomId) {
    const roomEl = document.querySelector(`.room-item[data-room="${roomId}"]`);
    if (roomEl) roomEl.remove();

    if (roomsList.querySelectorAll('.room-item').length === 0) {
        roomsEmpty.classList.remove('hidden');
    }
}

// Connect socket
function connectSocket() {
    socket = io('http://localhost:3000');

    socket.on('connect', () => {
        console.log('Connected:', socket.id);
    });

    socket.on('room-joined', (roomId) => {
        currentRoom = roomId;
        sendBtn.disabled = false;

        document.querySelectorAll('.room-item').forEach(el => el.classList.remove('active'));
        const roomEl = document.querySelector(`.room-item[data-room="${roomId}"]`);
        if (roomEl) roomEl.classList.add('active');

        addSystemMessage(`You joined "${roomId}"`);
    });

    socket.on('room-left', (roomId) => {
        addSystemMessage(`You left "${roomId}"`);
        currentRoom = null;
        sendBtn.disabled = true;
    });

    socket.on('user-joined', (data) => {
        addSystemMessage(`${data.username || 'Someone'} joined`);
    });

    socket.on('user-left', (data) => {
        addSystemMessage(`${data.username || 'Someone'} left`);
    });

    socket.on('room-message', (data) => {
        const isOwn = data.from === socket.id || data.username === username;
        addMessage(data.username || data.from, data.message, isOwn, data.createdAt);

        const preview = `${data.username}: ${data.message}`.substring(0, 30);
        updateRoomLastMsg(data.roomId, preview + (data.message.length > 30 ? '...' : ''));
    });

    socket.on('room-history', (messages) => {
        messagesArea.innerHTML = '';
        if (messages.length === 0) {
            addSystemMessage('No messages yet. Start the conversation!');
        } else {
            messages.reverse().forEach((msg) => {
                const isOwn = msg.sender_id === socket.id;
                addMessage(msg.username || msg.sender_id, msg.message, isOwn, msg.created_at);
            });
        }
    });

    socket.on('disconnect', () => {
        addSystemMessage('Disconnected from server');
        sendBtn.disabled = true;
    });
}

// Switch room
function switchRoom(roomId) {
    if (!roomId) return;

    roomAvatar.textContent = roomId.charAt(0).toUpperCase();
    roomName.textContent = roomId;

    emptyState.classList.add('hidden');
    chatHeader.classList.remove('hidden');
    messagesArea.classList.remove('hidden');
    inputArea.classList.remove('hidden');

    messagesArea.innerHTML = '';

    if (currentRoom && currentRoom !== roomId) {
        socket.emit('leave-room', currentRoom);
    }

    currentRoom = roomId;
    addRoomToList(roomId);

    socket.emit('join-room', { roomId, username }, (response) => {
        if (response && response.status === 'error') {
            addSystemMessage(`Error: ${response.reason}`);
        }
    });

    messageInput.focus();
}

// Leave room
function leaveRoom() {
    if (currentRoom) {
        socket.emit('leave-room', currentRoom);
        removeRoomFromList(currentRoom);

        currentRoom = null;
        sendBtn.disabled = true;

        chatHeader.classList.add('hidden');
        messagesArea.classList.add('hidden');
        inputArea.classList.add('hidden');
        emptyState.classList.remove('hidden');
    }
}

// Send message
function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || !currentRoom) return;

    socket.emit('room-message', { roomId: currentRoom, message, username }, (response) => {
        if (response && response.status === 'error') {
            addSystemMessage(`Failed: ${response.reason}`);
        }
    });

    messageInput.value = '';
    sendBtn.disabled = true;
}

// Event Listeners

// Login
joinBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if (!name) {
        usernameInput.focus();
        return;
    }

    username = name;
    userAvatar.textContent = name.charAt(0).toUpperCase();
    userName.textContent = name;

    loginScreen.classList.add('hidden');
    appContainer.classList.add('active');

    connectSocket();
    newRoomInput.focus();
});

usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') joinBtn.click();
});

// Create/Join room
createRoomBtn.addEventListener('click', () => {
    const roomId = newRoomInput.value.trim().toLowerCase().replace(/\s+/g, '-');
    if (roomId) {
        switchRoom(roomId);
        newRoomInput.value = '';
    }
});

newRoomInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') createRoomBtn.click();
});

// Leave room
leaveBtn.addEventListener('click', leaveRoom);

// Send message
sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

messageInput.addEventListener('input', () => {
    sendBtn.disabled = !messageInput.value.trim() || !currentRoom;
});

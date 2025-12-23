import pool from "./index.js";

export async function savedRoomMessage(roomId, senderId, message){
    const query = "INSERT INTO room_messages (room_id, sender_id, message) VALUES ($1, $2, $3) RETURNING *";
    const values = [roomId, senderId, message];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export async function getRoomMessages(roomId , limit=100){
    const query = "SELECT * FROM room_messages WHERE room_id = $1 ORDER BY id DESC LIMIT $2";
    const values = [roomId, limit];
    const result = await pool.query(query, values);
    return result.rows;
}
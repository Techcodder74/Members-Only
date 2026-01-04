import pool from "./pool.js"


const createUser = async (name, userName, password, isMember = false) => {
  const exists = await pool.query(
    "SELECT id FROM users WHERE username = $1",
    [userName]
  );

  if (exists.rows.length > 0) {
    throw new Error("User with this username already exists");
  }

  const result = await pool.query(
    `INSERT INTO users (name, username, password, is_member)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, userName, password, isMember]
  );

  return result.rows[0];
};


const createMessage = async (title, content, userId) => {
  const result = await pool.query(
    `INSERT INTO messages (title, content, user_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title, content, userId]
  );

  return result.rows[0];
};


const getUser = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [userId]
  );

  return result.rows[0];
};

const searchByusername = async (username) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  return result.rows[0];
};

const giveMembership = async (userId, passcode) => {
  if (passcode !== "1234") {
    throw new Error("incorrect passcode");
  }

  const result = await pool.query(
    `UPDATE users
     SET is_member = true
     WHERE id = $1
     RETURNING *`,
    [userId]
  );

  return result.rows[0];
};

const getAllMessages = async () => {
  const result = await pool.query(
    `SELECT 
        m.id AS "messageId",
        m.title,
        m.content,
        u.name AS author,
        u.is_member AS "isMember"
     FROM messages m
     JOIN users u ON m.user_id = u.id
     ORDER BY m.id DESC`
  );

  return result.rows;
};


const nonMemeberMsgs = async () => {
  const result = await pool.query(
    "SELECT id, title, content FROM messages"
  );

  return result.rows;
};

const db = {
    createUser, createMessage, getUser, giveMembership, getAllMessages, nonMemeberMsgs
    , searchByusername
}
export default db;





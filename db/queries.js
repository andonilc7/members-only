const pool = require("./pool")

async function addUser(username, first_name, last_name, password, is_member) {
  await pool.query("INSERT INTO users (username, first_name, last_name, password, is_member) VALUES ($1, $2, $3, $4, $5)", [username, first_name, last_name, password, is_member])
}

async function getUserByUsername(username) {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username])
  return rows[0]
}

async function getUserById(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id])
  return rows[0]
}

async function getAllMessagesAndAuthors() {
  const { rows } = await pool.query("SELECT messages.*, first_name, last_name FROM messages JOIN users ON messages.user_id = users.id;")
  return rows
}

async function addMessage(title, message, user_id) {
  await pool.query("INSERT INTO messages (title, message, user_id) VALUES ($1, $2, $3)", [title, message, user_id])
}

async function updateMembershipStatusToTrue(user_id) {
  await pool.query("UPDATE users SET is_member = true WHERE id = $1", [user_id])
}

async function updateAdminStatusToTrue(user_id) {
  await pool.query("UPDATE users SET is_admin = true WHERE id = $1", [user_id])
}

async function deleteMessage(msg_id) {
  await pool.query("DELETE FROM messages WHERE id = $1", [msg_id])
}


module.exports = {
  addUser,
  getUserByUsername,
  getUserById,
  getAllMessagesAndAuthors,
  addMessage,
  updateMembershipStatusToTrue,
  updateAdminStatusToTrue,
  deleteMessage
}
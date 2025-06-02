require("dotenv").config()
const { Client } = require("pg")

const SQL = `
CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR (255) UNIQUE NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_member BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS messages(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
`

async function main() {
  console.log("creating tables...")
  const client = new Client({
    connectionString: process.env.DB_URL
  });
  await client.connect()
  await client.query(SQL)
  await client.end()
  console.log("done!")
}

if (require.main === module) {
  main();
}

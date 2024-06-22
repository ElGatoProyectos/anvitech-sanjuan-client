import { createPool, Pool } from "mysql2/promise";

const pool: Pool = createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "app-check",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

export async function getRawData(query: string, params: any[]): Promise<any> {
  let connection;

  try {
    connection = await pool.getConnection();

    const [rows] = await connection.execute(query, params);

    return rows;
  } catch (error) {
    console.error("Error ejecutando la consulta:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

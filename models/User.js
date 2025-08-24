const pool = require("../config/db");

class User {
    static async findByEmail(email) {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return result.rows[0];
    }

    static async create(fullname, email, passwordHash, phone) {
        const result = await pool.query(
            "INSERT INTO users (fullname, email, password_hash, phone) VALUES ($1, $2, $3, $4) RETURNING *",
            [fullname, email, passwordHash, phone]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        return result.rows[0];
    }

    static async updateProfile(id, { fullname, phone }) {
        const result = await pool.query(
            "UPDATE users SET fullname = $1, phone = $2 WHERE id = $3 RETURNING *",
            [fullname, phone, id]
        );
        return result.rows[0];
    }

    static async updatePassword(id, passwordHash) {
        const result = await pool.query(
            "UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING *",
            [passwordHash, id]
        );
        return result.rows[0];
    }
}

module.exports = User;
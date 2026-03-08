const db = require('../config/db');

const Product = {
    findAll: async () => {
        const [rows] = await db.execute('SELECT * FROM products ORDER BY popularity_score DESC');
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    },

    findByStyles: async (styles) => {
        if (!styles || styles.length === 0) return [];
        const placeholders = styles.map(() => '?').join(',');
        const [rows] = await db.execute(
            `SELECT * FROM products WHERE style IN (${placeholders}) ORDER BY popularity_score DESC LIMIT 10`,
            styles
        );
        return rows;
    },

    findTrending: async (limit = 10) => {
        // Uses recent_interactions to identify trending items (for antigravity algo)
        const [rows] = await db.execute(
            `SELECT * FROM products ORDER BY recent_interactions DESC, popularity_score DESC LIMIT ?`,
            [limit]
        );
        return rows;
    },

    create: async (productData) => {
        const { name, category, style, image_url, tags, popularity_score, color } = productData;
        const [result] = await db.execute(
            'INSERT INTO products (name, category, style, image_url, tags, popularity_score, color) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, category, style, image_url, JSON.stringify(tags || []), popularity_score || 5, color || null]
        );
        return result.insertId;
    },

    incrementInteractions: async (id) => {
        await db.execute(
            'UPDATE products SET total_interactions = total_interactions + 1, recent_interactions = recent_interactions + 1 WHERE id = ?',
            [id]
        );
    }
};

module.exports = Product;

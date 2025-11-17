const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM journals WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({ success: true, journals: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM journals WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journal not found' });
    }

    res.json({ success: true, journal: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;

    const result = await db.query(
      `INSERT INTO journals (user_id, title, content, mood, tags, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
       RETURNING *`,
      [req.user.id, title, content, mood, tags]
    );

    res.status(201).json({ success: true, journal: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;

    const result = await db.query(
      `UPDATE journals 
       SET title = $1, content = $2, mood = $3, tags = $4, updated_at = NOW()
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [title, content, mood, tags, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journal not found' });
    }

    res.json({ success: true, journal: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM journals WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journal not found' });
    }

    res.json({ success: true, message: 'Journal deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
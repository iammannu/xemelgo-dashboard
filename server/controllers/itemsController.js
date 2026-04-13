const pool = require('../db');

const getAllItems = async (req, res) => {        // all the items with their current state 
  try {
    const result = await pool.query(`
      SELECT 
        i.id,
        i.name,
        i.status,
        st.name AS solution_type,
        l.name AS current_location
      FROM items i
      LEFT JOIN solution_types st ON i.solution_type_id = st.id
      LEFT JOIN locations l ON i.current_location_id = l.id
      ORDER BY i.id
    `);      
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getItemById = async (req, res) => {    // speific item + everything happened to it 
  const { id } = req.params;
  try {
    const itemResult = await pool.query(`
      SELECT 
        i.id,
        i.name,
        i.status,
        st.name AS solution_type,
        l.name AS current_location
      FROM items i
      LEFT JOIN solution_types st ON i.solution_type_id = st.id
      LEFT JOIN locations l ON i.current_location_id = l.id
      WHERE i.id = $1
    `, [id]);

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const locationHistory = await pool.query(`
      SELECT
        lh.id,
        l.name AS location,
        lh.timestamp
      FROM location_history lh
      JOIN locations l ON lh.location_id = l.id
      WHERE lh.item_id = $1
      ORDER BY lh.timestamp DESC
    `, [id]);

    const actionHistory = await pool.query(`
      SELECT
        ah.id,
        u.name AS user_name,
        ah.action,
        ah.timestamp
      FROM action_history ah
      JOIN users u ON ah.user_id = u.id
      WHERE ah.item_id = $1
      ORDER BY ah.timestamp DESC
    `, [id]);

    res.json({
      item: itemResult.rows[0],
      locationHistory: locationHistory.rows,
      actionHistory: actionHistory.rows
    });  // The response includes the item details, its location history, and its action history, all based on the provided item ID.
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const submitAction = async (req, res) => { // updates the items status, logs the location and action to the history tables.
  const { id } = req.params;
  const { action, location_id, user_id } = req.body;

  const terminalStatuses = ['missing', 'consumed', 'complete'];
  const terminalActions = ['Missing', 'Consumed', 'Complete'];

  try {
    let newStatus = 'active';
    let newLocationId = location_id || null;

    if (terminalActions.includes(action)) {
      newStatus = action.toLowerCase();
      newLocationId = null;
    }

    await pool.query(
      'UPDATE items SET current_location_id = $1, status = $2 WHERE id = $3',
      [newLocationId, newStatus, id]
    );

    if (newLocationId) {
      await pool.query(
        'INSERT INTO location_history (item_id, location_id) VALUES ($1, $2)',
        [id, newLocationId]
      );
    }

    await pool.query(
      'INSERT INTO action_history (item_id, user_id, action) VALUES ($1, $2, $3)',
      [id, user_id, action]
    );

    const updated = await pool.query(`
      SELECT 
        i.id,
        i.name,
        i.status,
        st.name AS solution_type,
        l.name AS current_location
      FROM items i
      LEFT JOIN solution_types st ON i.solution_type_id = st.id
      LEFT JOIN locations l ON i.current_location_id = l.id
      WHERE i.id = $1
    `, [id]);

    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllItems, getItemById, submitAction };
const pool = require('../db');   // connect to db
const bcrypt = require('bcryptjs');   // check password securely
const jwt = require('jsonwebtoken'); // create the authentication token

const login = async (req, res) => {
  const { email, password} = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);    // Search the database- does this email exists?
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);  // Checks password - Is the password correct? 
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(         
      { id: user.id, email: user.email },   // Creates a token - Heres a proof of identity!
      process.env.JWT_SECRET,    // secret key to seal/sign it 
      { expiresIn: '24h' }        // expires in 24 hours 
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login };





// Frontend:
//   User enters email/password
//         ↓
//   api.post('/login')
//         ↓
// Backend:
//   authController.login()
//         ↓
//   Check DB → verify password
//         ↓
//   Generate token
//         ↓
// Send token to frontend
//         ↓
// Frontend:
//   Save token in localStorage
//         ↓
// Future API calls → send token
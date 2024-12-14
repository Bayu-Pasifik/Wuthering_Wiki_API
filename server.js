const express = require('express');
const app = express();
const PORT = 9000;

// Import routes
const resonatorRoutes = require('./routes/resonatorRoutes');

// Middleware
app.use(express.json());

// Register routes
app.use('/resonator', resonatorRoutes);

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

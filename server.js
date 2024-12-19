const express = require('express');
const app = express();
const port = process.env.PORT || 9000;

const resonatorRoutes = require('./routes/resonatorRoutes');
const loreRoutes = require('./routes/loreRoutes');

// Rute utama
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Setup rute resonator dan lore
app.use('/api/resonators', resonatorRoutes);
app.use('/api/lore', loreRoutes);

// Jalankan server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

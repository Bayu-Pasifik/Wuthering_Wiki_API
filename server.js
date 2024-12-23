const express = require('express');
const app = express();
const port = process.env.PORT || 9000;

const resonatorRoutes = require('./routes/resonatorRoutes');
const loreRoutes = require('./routes/loreRoutes');
const weaponRoutes = require('./routes/weaponRoutes');
const factionRoutes = require('./routes/factionRoutes');

// Rute utama
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Setup rute resonator dan lore
app.use('/api/resonators', resonatorRoutes);
app.use('/api/lore', loreRoutes);
app.use('/api/weapon', weaponRoutes);
app.use('/api/factions',factionRoutes);

// Jalankan server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

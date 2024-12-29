const express = require('express');
const cors = require('cors'); // Import paket CORS
const app = express();
const port = process.env.PORT || 9000;

const allowedOrigins = [
    'http://localhost:3000',            // Untuk pengembangan
    'https://your-frontend.vercel.app'  // Untuk produksi
];

app.use(cors({
    origin: (origin, callback) => {
        // Periksa apakah origin ada dalam daftar allowedOrigins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}));


// Rute utama
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Setup rute resonator dan lainnya
const resonatorRoutes = require('./routes/resonatorRoutes');
const loreRoutes = require('./routes/loreRoutes');
const weaponRoutes = require('./routes/weaponRoutes');
const factionRoutes = require('./routes/factionRoutes');
const echoRoutes = require('./routes/echoRoutes');

app.use('/api/resonators', resonatorRoutes);
app.use('/api/lore', loreRoutes);
app.use('/api/weapon', weaponRoutes);
app.use('/api/factions', factionRoutes);
app.use('/api/echo', echoRoutes);

// Jalankan server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

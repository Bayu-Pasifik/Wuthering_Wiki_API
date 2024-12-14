const express = require('express');
const app = express();
const port = process.env.PORT || 9000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Import dan setup route
const resonatorRoutes = require('./routes/resonatorRoutes');
app.use('/api/resonators', resonatorRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

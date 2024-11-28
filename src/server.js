const express = require('express');
const app = express();
const gridRoutes = require('./api/gridRoutes');

app.use(express.static('public'));
app.use('/api', gridRoutes);

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

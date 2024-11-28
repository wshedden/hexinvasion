const express = require('express');
const app = express();
const gridRoutes = require('./api/gridRoutes');

app.use(express.static('public'));

// Serve JavaScript files with the correct MIME type
app.use('/src', express.static('src', {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

app.use('/api', gridRoutes);

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

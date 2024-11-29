const path = require('path');

module.exports = {
  entry: './public/script.js', // Your main entry point
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  mode: 'development' // Use 'production' for minified version
};

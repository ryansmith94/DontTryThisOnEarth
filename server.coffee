express = require('express');
app = express();
app.use(express.static(__dirname + '/dist'));
app.listen(8000);

console.log('Server running at 127.0.0.1:8000')
console.log('Go to 127.0.0.1:8000/index.html')
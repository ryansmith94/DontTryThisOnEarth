(function() {
  var fs, getPage, pages;

  fs = require("fs");

  pages = {};

  getPage = function(path) {
    fs.readFile("dist/" + path, function(err, data) {
      if (err != null) {
        throw err;
      } else {
        return pages[path] = data;
      }
    });
    return pages[path] || '';
  };

  require('http').createServer(function(req, res) {
    var path;
    if (req.method === 'GET') {
      path = req.url.replace('/', '') || 'index.html';
      console.log(path);
      if (path !== 'favicon.ico') {
        res.writeHead(200, {
          'Content-Type': path.indexOf('js') !== -1 ? 'text/javascript' : 'text/html'
        });
        return res.end(getPage(path));
      }
    } else {
      res.writeHead(400, {
        'Content-Type': 'text/plain'
      });
      return res.end('Not found!');
    }
  }).listen(8000);

  console.log('Server running at 127.0.0.1:8000');

  console.log('Go to 127.0.0.1:8000/index.html and refresh a few times');

}).call(this);

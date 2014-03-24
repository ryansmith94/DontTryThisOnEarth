fs = require("fs");
pages = {};

getPage = (path) ->
    fs.readFile("dist/#{path}", (err, data) ->
        if err? then throw err else pages[path] = data;
    )
    pages[path] or ''

require('http').createServer((req, res) ->
    if req.method is 'GET'
        path = req.url.replace('/', '') or 'index.html'
        console.log(path)
        if path isnt 'favicon.ico'
            res.writeHead(200, {
                'Content-Type': if (path.indexOf('js') isnt -1) then 'text/javascript' else 'text/html'
            })
            res.end(getPage(path))
    else
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end('Not found!')
).listen(8000)

console.log('Server running at 127.0.0.1:8000')
console.log('Go to 127.0.0.1:8000/index.html and refresh a few times')
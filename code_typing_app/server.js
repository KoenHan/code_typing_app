const http = require('http')
const server = http.createServer()

server.on('request', function(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/plain'})
    res.write('Example Response!')
    res.end()
})
server.listen(3000)
console.log('Server is working on port 3000')
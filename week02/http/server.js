let http = require('http');

http.createServer((request,response)=>{
    let body = [];
    request.on('error',(err)=>{
        console.log(err);
    }).on('data',(chunk)=>{
        body.push(chunk.toString());
    }).on('end',()=>{
        body = Buffer.concat(body).toString();
        console.log('body:',body);
        response.writeHead(200,{
            'content-Type':'text/html',
            'Transfer-Encoding': "Chunked"
        });
        response.end('Hello world!');
    })
}).listen(3000);

console.log('service running on 3000!')
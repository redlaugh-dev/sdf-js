const http = require('http')
const fs = require('fs')


const server = http.createServer(function(request, response){
    const filePath = request.url.substring(1);
    fs.access(filePath, fs.constants.R_OK, err =>{
        if(err){
            response.statusCode = 404;
            response.end('Resources not found');
        }
        else {
            fs.createReadStream(filePath).pipe(response);
        }
    })
})
.listen(3000,function(){
    console.log("Server started at 3000")
});
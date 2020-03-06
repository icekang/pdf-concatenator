var express = require('express');
var multer = require('multer');

var app = express();
app.use(
    multer({
        dest: __dirname + '/uploads/',
        rename: function(fieldname, filename) {
            return Date.now();
        },
        limits: {
            fileSize: 5000000 //5 MB
        },
        onFileSizeLimit: function(file) {
            console.log('Failed: ' + file.originalname + ' is limited');
            fs.unlink(file.path);
        }
    }).single('file')
);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/upload', function(req, res) {
    console.log(req.file);
    res.send(req.file);
});

app.listen(5555, function() {
    console.log('App running on port 5555');
});

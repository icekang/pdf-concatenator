var express = require('express');
var multer = require('multer');
var mime = require('mime');
var crypto = require('crypto');
const HummusRecipe = require('hummus-recipe');
var app = express();
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            // console.log(raw.toString('hex'));
            // cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
            cb(null, 'input' + '.' + mime.getExtension(file.mimetype));
        });
    }
});
app.use(
    multer({
        dest: __dirname + '/uploads/',
        limits: {
            fileSize: 100000000 //100 MB
        },
        onFileSizeLimit: function(file) {
            console.log('Failed: ' + file.originalname + ' is limited');
            fs.unlink(file.path);
        },
        storage: storage
    }).single('file')
);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/upload', function(req, res) {
    const pdfDoc = new HummusRecipe('new', 'outputs/output.pdf');
    // const pdfDoc = new HummusRecipe('uploads/input.pdf', 'outputs/output.pdf');
    const coverPDF = 'outputs/cover.pdf';
    const bodyPDF = 'outputs/body.pdf';
    pdfDoc
        .appendPage(coverPDF, [1, 2])
        .appendPage(bodyPDF)
        .appendPage(coverPDF, 3)
        .endPDF();
    res.redirect('/download');
});

app.get('/download', function(req, res) {
    res.download('outputs/output.pdf');
});

app.listen(process.env.PORT || 5000, function() {
    console.log('App running on port process.env.PORT || 5000');
});

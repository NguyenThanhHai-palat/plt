const express = require('express');
const app = module.exports = express();
const routes = require('./routes');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(fileUpload());
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/dataupload/:file', function(req, res) {
  // res.sendFile(__dirname + '/.data/'+req.params.file);
   res.sendFile(__dirname + '/public/images/'+req.params.file);
});

app.get('/data', routes.data)

app.get('/display', routes.display);
app.get('/preview', routes.preview);
app.get('/lists', routes.listByFilename);
app.get('/list', routes.listByTimestamp);

app.get('/listByTimestamp', routes.listByTimestamp);

//Post-only routes for upload and destructive operations
app.get('/xoa', routes.remove);
app.post('/upload', routes.upload);

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

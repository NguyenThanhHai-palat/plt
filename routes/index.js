const fs = require('fs');
const low = require('lowdb');

//https://github.com/typicode/lowdb usage instructions
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('images-db.json')
const db = low(adapter)

//initiate a blank database if it doesn't exist


const initializeDb = () => {
    let dbTemplate = {
    files: []
  }
  db.defaults(dbTemplate).write()
}

initializeDb()

exports.upload = (req, res, next) => {
   let timec = new Date();
  var date = new Date();
  var DayG = timec.getDate();
  var MonthG = timec.getMonth()+1;
  var YearG = timec.getFullYear();
  var fulldate = DayG+"/"+MonthG + "/"+YearG;
    var date = new Date();
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  if (m < 10) {
    m = "0" + m;
  }
  if (s < 10) {
    s = "0" + s;
  }
  var timereal = h+7 + ":" + m + ":" + s+" ";
  console.log(req.files)
  console.log(req.body)
  const timestamp = timereal  +" "+ fulldate;

  console.log(req.files.image.name) 

  let fullFileName = req.files.image.name
  let fileNameExtension = fullFileName.split(".").pop()

  const filename = `${fullFileName}`;
  // req.files.image.mv(`.data/${filename}`);
    req.files.image.mv(`./public/images/${filename}`);

  let fileData = {
    name: req.files.image.name,
    filetype: fileNameExtension,
    filename: filename,
    author: "",
    filepath: `/dataupload/${filename}`,
    timestamp: timestamp,
    meta: req.body 
  }
  
   
  // //write the file description to the database
  db.get("files").push(fileData).write()
  
  // res.json(fileData);
  res.redirect("/add.html")
};

exports.data = (req, res, next) => {

  res.json(db.get("files").value())

}


exports.display = async (req, res) => {
  //list all image names and urls
  
  let fileData = db.get("files").value()
  
  let fileDataList = fileData.map((file)=>{
    
    if(file.filetype == "mp4"){
      return `<li><iframe style="height:130px;width:auto;" src="${file.filepath}"></iframe><br><a target="_blank" href="${file.filepath}">${file.filename}<br>${file.filepath}</a></li>`
    } else {
      return `<li><img style="height:130px;width:auto;"src="${file.filepath}"><br><a target="_blank" href="${file.filepath}">${file.filename}<br>${file.filepath}</a></li>`
    }
    
    
  
  
  })
  
  res.set('Content-Type', 'text/html');
  return res.end(`<ul>${fileDataList}</ul>`)
};

exports.preview = async (req, res) => {
  //show all images
  
  let fileData = db.get("files").value()
  
  let fileDataList = fileData.map((file)=>{
    return `<li>
      <span><a target="_blank" href="${file.filepath}">${file.filename}-${file.meta.description}</span><br><span>${file.timestamp} - ${file.author}</span><hr>
      

      </a>
    </li>`
  })

  res.set('Content-Type', 'text/html');
  return res.end(`<ul>${fileDataList}</ul>`)
  
};

exports.listByFilename = async (req, res) => {
  //output all image titles
  
  let fileData = db.get("files").sortBy("filename").value()
  res.json(fileData);
  
};

exports.listByTimestamp = async (req, res) => {
  //output all image titles, most recent first
  
  let fileData = db.get("files").sortBy("timestamp").value()
  res.json(fileData.reverse())
  
};

exports.remove = (req, res) => {
  
  db.get("files").remove(()=>{return true}).write()
  // let images = fs.readdirSync('/app/.data/');
  let images = fs.readdirSync('/app/public/images/');
  
  for(let image of images) {
    console.log(image)
    // fs.unlinkSync(`/app/.data/${image}`);
    let ext = (image.match(/\.([^.]*?)(?=\?|#|$)/) || [])[1] 
    // console.log(ext)
    
    if(ext !== "html"){
          fs.unlinkSync(`/app/public/images/${image}`)
    }

    
    
  }
  
  initializeDb()

  res.end("deleted all file");
}
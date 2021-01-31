var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var fs = require('fs')
var gracefulFs = require('graceful-fs')
gracefulFs.gracefulify(fs)
const request = require('request')

getJSON();



function getJSON (){
    const Http = new XMLHttpRequest();
    const url='https://www.reddit.com/r/dankmemes/hot.json?limit=99';
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
      var obj = JSON.stringify(Http.responseText);
      var obj = JSON.parse(obj)
      fs.writeFile("redditMemeList.json", obj, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
     
        console.log("JSON file has been saved.");
        setTimeout(downloadImages, 3000);
    });
    }
}

function downloadImages() {
  loadJSON()
  var download = (url, path, callback) => {
    request.head(url, (err, res, body) => {
      request(url)
        .pipe(fs.createWriteStream(path))
        .on('close', callback)
    })
  }
  function loadJSON() {
    fs.readFile('./redditMemeList.json','utf-8',(err,jsonString)=>{
      const redditMemeList = JSON.parse(jsonString);
    sendDownloads(redditMemeList);
   })
  }
  function sendDownloads(memeList) {
  const path = require('path');
   for(i=0 ; i < memeList["data"]["children"].length ; i++) {
     var downloadLink = memeList["data"]["children"][i]["data"]["url"]
     var fileExtension = path.parse(downloadLink).ext;
    if(fileExtension == ".jpg") {
    console.log(downloadLink)
    download(downloadLink,"./" + i + ".jpg", function(){
      console.log('done');
    })
    console.log("Trying to download #" + i)
    }
    if (fileExtension == ".png") {
    console.log(downloadLink)
    download(downloadLink,"./" + i + ".jpg", function(){
      console.log('done');
    })
    console.log("Trying to download #" + i)     
    }
    if (fileExtension !== ".jpg" && fileExtension !== ".png") {
    console.log(fileExtension + " is not supported, skipping #" + i + "!")
    }
   }
  }
}

function downloadSuccessful() {
  console.log("Download Successful, proceeding!")
}
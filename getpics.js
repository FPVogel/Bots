/*
MIT License

Copyright (c) 2021 FPVogel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

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

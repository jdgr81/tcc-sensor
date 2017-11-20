const Repeat = require('repeat');
const exec = require('child-process-promise').exec;
const request = require('request');
const fs = require('fs');
const events = require('events');

let eventEmitter = new events.EventEmitter();

let fileText = '';

exec('ifconfig wlan1 down')
    .then(exec('iwconfig wlan1 mode monitor')
         .then(exec('ifconfig wlan1 up')));


///read all files in directory.If file name is the same that prefix, then try to send file to server.
function sendFiles(prefix){
    fs.readdir('./', (err, files) => {
        files.forEach(file =>{
            let name = file.split('_');
            if(name[0] == prefix){
                fs.readFile(file, "utf8", (err, data) =>{
                    let formData = {};
                    formData.file = data;
                    formData.fileName = name[1]+'_'+name[2]+'_'+name[3];
                    request.post({url:"http://",formData}, (err, res, body) =>{
                        if(!err){
                            fs.rename(file, 'sent_'+file, (err) => {});
                        }else{
                            fs.rename(file,'not-sent_'+file, (err) =>{})
                        }
                    });
                });
            }
        });
    });
}

function createFile(){
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year   = date.getFullYear();
    let hour = date.getHours();
    if(hour < 10){
      hour = '0'+hour;
    }
    let fileName = 'LTIA_'+year+'-'+month+'-'+day+'_'+hour+'-00';

    fs.writeFile(fileName, fileText, (err) => {
        if(err) {
            return console.log(err);
        }
        fileText = '';
        eventEmitter.emit('fileCreated');
        repeatScan();
    });
}

function scan() {
  exec('tshark -i wlan1 -Y "wlan.fc.type_subtype eq 4" -T fields -e wlan.sa')
    .then((result) => {
        fileText += result.stdout;
    }).catch((err) => {
        return;
    });
}

//repeat Tshark process
function repeatScan(){
    Repeat(scan).every(20, 'sec').for(3200, 'minutes').start.now(); //every 20 seconds
}

eventEmitter.on('fileCreated', () => {sendFiles('LTIA')});

Repeat(createFile).every(3400, 'sec').for(2, 'minutes').start.wait(3300, 'sec'); //every 1 hour, for X Hours

Repeat(() => {sendFiles('not-sent')}).every(1200, 'sec').for(2, 'minutes').start.now(); // every 30 minutes, for x hours

repeatScan();

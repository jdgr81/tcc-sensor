const Repeat = require('repeat');
// const exec = require('child-process-promise').exec;
const request = require('request');
const fs = require('fs');
const events = require('events');
const spawn = require('child_process').spawn;

let eventEmitter = new events.EventEmitter();

// exec('ifconfig wlan1 down')
//     .then(exec('iwconfig wlan1 mode monitor')
//          .then(exec('ifconfig wlan1 up')));

let texto = '';
// ///read all files in directory.If file name is the same that prefix, then try to send file to server.
// function sendFiles(prefix){
//     console.log('estou enviando arquivos eh')
//     fs.readdir('./', (err, files) => {
//         files.forEach(file =>{
//             let name = file.split('_');
//             if(name[0] == prefix){
//                 fs.readFile(file, "utf8", (err, data) =>{
//                     let formData = {};
//                     formData.file = data;
//                     formData.fileName = name[1]+'_'+name[2]+'_'+name[3];
//                     request.post({url:"http://",formData}, (err, res, body) =>{
//                         if(!err){
//                             fs.rename(file, 'sent_'+file, (err) => {});
//                         }else if(err && prefix != 'not-sent'){
//                             fs.rename(file,'not-sent_'+file, (err) =>{})
//                         }
//                     });
//                 });
//             }
//         });
//     });
// }
//
// function createFile(fileText){
//     let date = new Date();
//     let day = date.getDate();
//     let month = date.getMonth() + 1;
//     let year   = date.getFullYear();
//     let hour = date.getHours();
//     if(hour < 10){
//       hour = '0'+hour;
//     }
//     let fileName = 'LTIA_'+year+'-'+month+'-'+day+'_'+hour+'-00';
//     fs.writeFile(fileName, fileText, (err) => {
//         console.log('escrevi o texto ')
//         if(err) {
//             return console.log(err);
//         }
//         eventEmitter.emit('fileCreated');
//         repeatScan();
//     });
// }

let scan = () => {
  return spawn('tshark',['-i', 'wlan1', '-Y', '"wlan.fc.type_subtype eq 4"','-T','fields','-e','wlan.sa']);

}

scan.stdout.on('data',(data) => {
    console.log(data.toString());
})

scan();

// //repeat Tshark process
// function repeatScan(){
//     let fileText = '';
//     Repeat(scan).every(20, 'sec').for(2, 'minutes').start.now().then(() => {createFile(fileText)}); //every 20 seconds
// }

// eventEmitter.on('fileCreated', () => {sendFiles('LTIA')});
//
// Repeat(() => {sendFiles('not-sent')}).every(1200, 'sec').for(2, 'minutes').start.now(); // every 30 minutes, for x hours
//
// repeatScan();

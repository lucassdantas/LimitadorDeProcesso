const 
ps = require('ps-node'),
fs = require('fs')

let 
processCommands = fs.readFileSync('programs.txt').toString().replace("\r", "").split("\n"), //processNames
time = 0, //initialTime
timeToClose = 10, //timeLimit
currentDate = new Date().getDate(),
lastDate = null,

//Status of process
status = {
    active: false,               
    opened: false,
}
//see if lastdate file's exists. if exist, lastdate recieve the archive content
if(fs.existsSync('./lastDate.txt')) {
    lastDate = Number(fs.readFileSync('./lastDate.txt'))
}

//compare system date and file date. if not match, time is 0
if(lastDate != currentDate){
    fs.writeFileSync("./time.txt", String(time))
}
//if time file's exist, time will recive file's content
if(fs.existsSync('./time.txt')){
    time = Number(fs.readFileSync('./time.txt'))
}

//function that close thhe process
let closer = (pid) => {
    try {
        console.log('finalizado')
        ps.kill(pid)
     } catch (error) {
        console.log(error)
     }
     fs.writeFileSync("./lastDate.txt", String(currentDate))
}
//check if process exist and kill him after the timeLimit
let checkerF = (processName, timeLimit) => {
    //search for project
    ps.lookup({ command: processName }, function(err, resultList ) {
        
        if (err) {
            throw new Error( err );
        }
    
        var process = resultList[ 0 ];
        //ifexists
        if( process ){
            status.opened = true
            status.active = true

            time++

            console.log('aberto')

            if((time%5) === 0){
                fs.writeFileSync("./time.txt", String(time))
            }
            if(time >= timeLimit || lastDate == currentDate){
                closer(process.pid)
            }
        } else{
            status.active = false
            console.log(processName+'fechado')
        }
    });
}



processCommands.forEach(processCommand => {
    //check the process every second
    let checker = setInterval(checkerF, 1000, processCommand, timeToClose)
})
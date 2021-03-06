const exec = require("child_process").exec;

exports.performIISOperations = (data, callback) => {
    if (data) {
        if (data.action == 'start') {
            exec("Powershell.exe  -executionpolicy remotesigned . " + __dirname + "\\actions.ps1; StartIISSite -username " + data.username + " -password " + data.password + " -serverIpAddress " + data.serverIpAddress + " -siteName " + data.name, function (err, stdout, stderr) {
                console.log(stdout);
                callback(err)
            });
        }
        else if (data.action == 'stop') {
            exec("Powershell.exe  -executionpolicy remotesigned . " + __dirname + "\\actions.ps1; StopIISSite -username " + data.username + " -password " + data.password + " -serverIpAddress " + data.serverIpAddress + " -siteName " + data.name, function (err, stdout, stderr) {
                console.log(stdout);
                callback(err)
            });
        }
    } else {
        console.log('Data is null.');
    }
}

exports.performWindowsServiceOperations = (data, callback) => {
    if (data) {
        if (data.action == 'start') {
            exec("cmdkey.exe /add:" + data.serverIpAddress + " /user:" + data.username + " /pass:" + data.password, () => {
                if(err != null)
                {
                    callback(err);
                }
                else
                {
                    console.log('Starting service: ', data.name);
                    exec(__dirname + "\\PsExec64.exe -s \\\\" + data.serverIpAddress + " -u " + data.username + " -p " + data.password + " c:\\windows\\system32\\sc start " + data.name, () => {
                        if(err != null)
                        {
                            callback(err);
                        }
                        else
                        {
                            console.log('Started service: ', data.name);
                            exec("cmdkey.exe /delete:" + data.serverIpAddress + " /user:" + data.username + " /pass:" + data.password, (err, stdout, stderr) => {
                            console.log('Completed the requested operation.');
                            callback(err);
                        });
                        }
                        
                    });
                }
            });
        } else {
            exec("cmdkey.exe /add:" + data.serverIpAddress + " /user:" + data.username + " /pass:" + data.password, (err, stdout, stderr) => {
                if(err != null)
                {
                        callback(err);
                }
                else
                {
                    console.log('Stopping service: ', data.name);
                    exec(__dirname + "\\PsExec64.exe -s \\\\" + data.serverIpAddress + " -u " + data.username + " -p " + data.password + " c:\\windows\\system32\\sc stop " + data.name, (err, stdout, stderr) => {
                        if(err != null)
                        {
                            callback(err);
                        }
                        else
                        {
                            console.log('Stopped service: ', data.name);
                            exec("cmdkey.exe /delete:" + data.serverIpAddress + " /user:" + data.username + " /pass:" + data.password, (err, stdout, stderr) => {
                                console.log('Completed the requested operation.');
                                callback(err);
                            });
                        }
                    });
                }
                
            });
        }
    } else {
        console.log('Data is null.');
    }
}

exports.performRemoteCommands = (data, callback) => {

    if (data) {
            exec("cmdkey.exe /add:" + data.serverIpAddress + " /user:" + data.username + " /pass:" + data.password, (err, stdout, stderr) => {
                if(err != null)
                {
                    callback(err);
                }
                else
                {
                    console.log('Starting service: ', data.name);
                    exec(__dirname + "\\PsExec64.exe -s \\\\" + data.serverIpAddress + " -u " + data.username + " -p " + data.password + " " +  data.directory + " " + data.command, (err, stdout, stderr) => {
                        if(err != null)
                        {
                            callback(err);
                        }
                        else
                        {
                            console.log('Started service: ', data.name);
                            exec("cmdkey.exe /delete:" + data.serverIpAddress + " /user:" + data.username + " /pass:" + data.password, (err, stdout, stderr) => {
                                console.log('Completed the requested operation.');
                                callback(err);
                            });
                        }
                    });
                }
            });
    } else {
        callback("Invalid data.")
    }
}







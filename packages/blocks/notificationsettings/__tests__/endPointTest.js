const { exec } = require("child_process");
var config = require('../src/config')
var host = require('../../../framework/src/config').baseURL.replace("http://", '').replace("https://", '');

console.log("No Backend Tests Configured!");
process.exit(0);

// GET Example

exec(`cd ../../../../ && node endPointTest.js --host ${host} --path ${config.getNotificationAPIEndPoint} --method GET`, (error, stdout, stderr) => {
    if (error) {
        console.error(`EndPoint Failed::${error}`);
        process.exit(-1);
    }
    
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});


var setNotificationData = JSON.stringify({
                "title": "Settings #1 update",
                "description": "Description updated",
                "state": "active"
            })


exec(`cd ../../../.. && node endPointTest.js --host ${host} --path ${config.updateNotificationAPIEndPoint}2 --method PATCH --body '${setNotificationData}'`, (error, stdout, stderr) => {
    if (error) {
        console.log(`EndPoint Returned Error: ${error}`);
    }
    
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});


var setNotificationGroupData = JSON.stringify({
            "group_type": "order_group",
            "group_name": "group #3",
            "state": "active",
            "notification_setting_id": 2
        })


exec(`cd ../../../.. && node endPointTest.js --host ${host} --path ${config.updateNotificationGroupAPIEndPoint}3 --method PATCH --body '${setNotificationGroupData}'`, (error, stdout, stderr) => {
    if (error) {
        console.log(`EndPoint Returned Error: ${error}`);
    }
    
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

var setNotificationSubGroupData = JSON.stringify({
                "subgroup_type": "order_shipped",
                "subgroup_name": "name 4",
                "notification_group_id": 3,
                "state": "active"
            })


exec(`cd ../../../.. && node endPointTest.js --host ${host} --path ${config.updateNotificationSubGroupAPIEndPoint}2 --method PATCH --body '${setNotificationSubGroupData}'`, (error, stdout, stderr) => {
    if (error) {
        console.log(`EndPoint Returned Error: ${error}`);
    }
    
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
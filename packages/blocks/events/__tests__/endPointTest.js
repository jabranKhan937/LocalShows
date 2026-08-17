const { exec } = require("child_process");
var config = require("../src/config");
var host = require("../../../framework/src/config")
  .baseURL.replace("http://", "")
  .replace("https://", "");

const currentDate = new Date();
var data = JSON.stringify({
  data: {
    type: "email_account",
    attributes: {
      title: "Test Event",
      time: currentDate,
      date: currentDate,
      latitude: "",
      longitude: "",
      address: "",
      assign_to: ["All"],
      visibility: ["All"],
      email_account_id: 214,
      notify: "One Day Before",
      repeat: "Never",
      custom_repeat_in_number: null,
      custom_repeat_every: null,
      notes: "Test Notes",
      event_type: "Doctor",
    },
  },
});

exec(
  `cd ../../../.. && node endPointTest.js --host ${host} --path ${
    config.createEventEndPoint
  } --body '${data}'`,
  (error, stdout, stderr) => {
    if (error) {
      console.log(`EndPoint Failed`);
      process.exit(-1);
    }

    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  }
);

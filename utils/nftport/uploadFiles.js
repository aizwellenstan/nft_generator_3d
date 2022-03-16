const FormData = require("form-data");
const fetch = require("node-fetch");
const path = require("path");
const basePath = process.cwd();
const fs = require("fs");

require('dotenv').config();
const AUTH = process.env.NFTPORT_API_KEY;
const TIMEOUT = 1000; // Milliseconds. Extend this if needed to wait for each upload. 1000 = 1 second.

const allMetadata = [];

async function main() {
  const files = fs.readdirSync(`${basePath}/build/glbs`);
  files.sort(function(a, b){
    return a.split(".")[0] - b.split(".")[0];
  });
  for (const file of files) {
    const fileName = path.parse(file).name;
    let jsonFile = fs.readFileSync(`${basePath}/build/json/${fileName}.json`);
    let metaData = JSON.parse(jsonFile);
    if (!metaData.hasOwnProperty('file_url')) {
      var response = await fetchWithRetry(file);
      var resUrl = response.ipfs_url+`?fileName=${fileName}.glb`;
      metaData.file_url = resUrl;
      metaData.animation_url = resUrl;
      metaData.custom_fields = {};
      metaData.custom_fields.edition = metaData.name.split('_').pop();
  
      fs.writeFileSync(
        `${basePath}/build/json/${fileName}.json`,
        JSON.stringify(metaData, null, 2)
      );
      console.log(`${response.file_name} uploaded & ${fileName}.json updated!`);
    } else {
      if(!metaData.file_url.includes('https://')) {
        var response = await fetchWithRetry(file);
        var resUrl = response.ipfs_url+`?fileName=${fileName}.glb`;
        metaData.file_url = resUrl;
        metaData.animation_url = resUrl;
        metaData.custom_fields = {};
        metaData.custom_fields.edition = metaData.name.split('_').pop();
    
        fs.writeFileSync(
          `${basePath}/build/json/${fileName}.json`,
          JSON.stringify(metaData, null, 2)
        );
        console.log(`${response.file_name} uploaded & ${fileName}.json updated!`);
      } else {
        console.log(`${fileName} already uploaded.`);
      }
    }

    allMetadata.push(metaData);
  }
  fs.writeFileSync(
    `${basePath}/build/json/_metadata.json`,
    JSON.stringify(allMetadata, null, 2)
  );
}

main();

function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function fetchWithRetry(file)  {
  await timer(TIMEOUT)
  return new Promise((resolve, reject) => {
    const fetch_retry = (_file) => {
      const formData = new FormData();
      const fileStream = fs.createReadStream(`${basePath}/build/glbs/${_file}`);
      formData.append("file", fileStream);
      let url = "https://api.nftport.xyz/v0/files";
      let options = {
        method: "POST",
        headers: {
          Authorization: AUTH,
        },
        body: formData,
      };

      return fetch(url, options).then(async (res) => {
          const status = res.status;

          if(status === 200) {
            return res.json();
          }            
          else {
            console.error(`ERROR STATUS: ${status}`)
            console.log('Retrying')
            await timer(TIMEOUT)
            fetch_retry(_file)
          }            
      })
      .then(async (json) => {
        if(json.response === "OK"){
          return resolve(json);
        } else {
          console.error(`NOK: ${json.error}`)
          console.log('Retrying')
          await timer(TIMEOUT)
          fetch_retry(_file)
        }
      })
      .catch(async (error) => {  
        console.error(`CATCH ERROR: ${error}`)  
        console.log('Retrying')    
        await timer(TIMEOUT)    
        fetch_retry(_file)
      });
    }        
    return fetch_retry(file);
  });
}
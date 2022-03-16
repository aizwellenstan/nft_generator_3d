const path = require("path");
const basePath = process.cwd();
const fs = require("fs");
const buildDir = path.join(basePath, "/build");

const GENERIC_TITLE = "Unknown" // Replace with what you want the generic titles to say.
const GENERIC_DESCRIPTION = "Unknown" // Replace with what you want the generic descriptions to say.

if (!fs.existsSync(path.join(buildDir, "/genericJson"))) {
  fs.mkdirSync(path.join(buildDir, "/genericJson"));
}

fs.readdirSync(`${buildDir}/json`).forEach((file) => {
  if (file === "_metadata.json" || file === "_ipfsMetas.json") return;

  const jsonFile = JSON.parse(fs.readFileSync(`${buildDir}/json/${file}`));

  jsonFile.description = GENERIC_DESCRIPTION;
  jsonFile.file_url =
    "https://ipfs.io/ipfs/bafkreibos2qb6sgc4smzggchpnwv7fpuu256qbbbzaqvj4wdkjtf65qf24";
    // This is an example url, replace with yours.
  jsonFile.custom_fields = {};
  jsonFile.custom_fields.edition = parseInt(jsonFile.name.split('_').pop());
  delete jsonFile.attributes;

  fs.writeFileSync(
    `${buildDir}/genericJson/${file}`,
    JSON.stringify(jsonFile, null, 2)
  );

  console.log(`${file} copied and updated!`);
});

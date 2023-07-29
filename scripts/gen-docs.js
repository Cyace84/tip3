const { defaultDocgen } = require("tsolidity-docgen-dev");
const config = require("./../docs/config");

async function main() {
  await defaultDocgen(config);
}

main();

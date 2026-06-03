const Log = require("./logger");

async function test() {
  await Log(
    "backend",
    "info",
    "service",
    "Testing logging middleware"
  );
}

test();
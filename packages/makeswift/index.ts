import { login } from "./authentication";

const { Command } = require("commander");
const program = new Command();

program
  .name("Makeswift CLI")
  .description("The official command-line tool to interact with Makeswift.")
  .version("0.0.0");

program
  .command("hello")
  .description("A hello world command. Revolutionary.")
  .argument("<name>", "The name of the person to say hello to.")
  .option("--world", "Say hi to the world, or to the name.")
  .action((name: string, options: { world?: boolean; separator: string }) => {
    if (options.world == true) {
      console.log(`Hello world`);
      return;
    }

    console.log(`name: ${JSON.stringify(name, null, 2)}`);
    console.log(`Hello ${name}`);
  });

program
  .command("login")
  .description(
    "Login and store a token that will give you access to the Makeswift API."
  )
  .action(() => {
    const config = {
      auth0ClientId: "6yMkMqiFxBrBR1l0bF7zxSq71u68Y9Xp",
      auth0Domain: "makeswift-staging.auth0.com",
      auth0TokenAudience: "https://api.staging.makeswift.com",
      auth0TokenScope: "profile",
      port: 42225,
      // 5 minutes
      timeout: 5 * 60 * 1000,
    };

    login(config);
  });

program.parse();

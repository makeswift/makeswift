import init from "./init";
import isNextApp from "./isNextApp";
import link from "./link";

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
  .command("init")
  .description(
    "Create a new Next.js app or integrate an existing one, to use with Makeswift."
  )
  .argument("<name>", "The name of the folder to create.")
  .option(
    "--example <example>",
    "The Github URL of the Makeswift example to clone."
  )
  .action(init);

program
  .command("link")
  .description("Link an existing Next.js app to a Makeswift site.")
  .argument("[name]", "The name of the app.")
  .action(link);

program.parse();

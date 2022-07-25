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

program.parse();

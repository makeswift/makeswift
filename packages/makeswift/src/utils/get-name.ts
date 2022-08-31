import inquirer from 'inquirer'

export async function getProjectName(): Promise<string> {
  return new Promise(resolve => {
    const questions = [
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project named?',
      },
    ]

    inquirer.prompt(questions).then(answers => {
      resolve(answers.projectName)
    })
  })
}

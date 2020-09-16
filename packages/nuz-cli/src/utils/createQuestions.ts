import * as inquirer from 'inquirer'

function createQuestions<T = unknown>(
  questions: inquirer.Answers[],
): Promise<T> {
  return inquirer.prompt(questions).then((answer) => answer) as any
}

export default createQuestions

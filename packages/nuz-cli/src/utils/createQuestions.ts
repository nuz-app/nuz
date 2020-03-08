import * as inquirer from 'inquirer'

const createQuestions = <T = unknown>(
  questions: inquirer.Answers[],
): Promise<T> => inquirer.prompt(questions).then(answer => answer)

export default createQuestions

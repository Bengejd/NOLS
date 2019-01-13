const inquirer = require('inquirer');

export function configQuestions() {
  const questions = [
    {
      name: 'MODE',
      message: 'What would you like to do?',
      type: 'list',
      choices: ['Default', 'Revert', 'Clean']
    },
    {
      name: 'HEIGHT',
      message: 'What is the device HEIGHT that you\'re targeting?',
      type: 'input',
      when(mode) {
        return mode.MODE === 'Default';
      }
    },
    {
      name: 'WIDTH',
      type: 'input',
      message: 'What is the device WIDTH that you\'re targeting?',
      when(mode) {
        return mode.MODE === 'Default';
      }
    },
    {
      name: 'CONFIRM',
      type: 'list',
      message: 'Are you sure you want to proceed?',
      choices: ['YES', 'NO'],
    },
  ];
  return inquirer.prompt(questions);
}

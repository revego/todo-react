#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const axios = require('axios');
const chalk = require('chalk');

yargs(hideBin(process.argv))
  .command({
    command: 'add <task>',
    desc: 'Aggiungi un nuovo task',
    builder: (yargs) => {
      return yargs
        .option('priority', {
          alias: 'p',
          describe: 'Priorità del task',
          choices: ['low', 'medium', 'high'],
          default: 'medium'
        });
    },
    handler: async (argv) => {
      try {
        const newTodo = {
          text: argv.task,
          priority: argv.priority,
          completed: false
        };

        const { data } = await axios.post('http://localhost:3001/todos', newTodo, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log(chalk.green('✅ Task aggiunto con successo!'));
        console.log(chalk.gray(`ID: ${data.id}`));
      } catch (error) {
        console.error(chalk.red('❌ Errore:'), error.response?.data?.error || error.message);
      }
    }
  })
  .command({
    command: 'list',
    desc: 'Lista tutti i task',
    handler: async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/todos');
        console.log(chalk.blue('\n📝 Lista Task:'));
        data.forEach(todo => {
          const status = todo.completed ? chalk.green('✓') : chalk.red('✗');
          const priorityColor = {
            high: chalk.red,
            medium: chalk.yellow,
            low: chalk.green
          }[todo.priority] || chalk.gray;

          console.log(
            `${status} ${todo.text} ` +
            `${priorityColor(`(${todo.priority})`)} ` +
            `${chalk.gray(`[ID: ${todo.id}]`)}`
          );
        });
      } catch (error) {
        console.error(chalk.red('❌ Errore:'), error.message);
      }
    }
  })
  .command({
    command: 'complete <id>',
    desc: 'Segna task come completato',
    handler: async (argv) => {
      try {
        await axios.patch(`http://localhost:3001/todos/${argv.id}`, {
          completed: true
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log(chalk.green('✅ Task completato con successo!'));
      } catch (error) {
        console.error(chalk.red('❌ Errore:'), error.response?.data?.error || error.message);
      }
    }
  })
  .command({
    command: 'delete <id>',
    desc: 'Elimina un task',
    handler: async (argv) => {
      try {
        await axios.delete(`http://localhost:3001/todos/${argv.id}`);
        console.log(chalk.green('🗑️ Task eliminato con successo!'));
      } catch (error) {
        console.error(chalk.red('❌ Errore:'), error.response?.data?.error || error.message);
      }
    }
  })
  .demandCommand(1, chalk.yellow('⚠️  Specifica un comando valido'))
  .help()
  .argv;

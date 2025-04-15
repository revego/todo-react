#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const axios = require('axios');

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
          id: Date.now(),
          text: argv.task,
          priority: argv.priority,
          completed: false,
          createdAt: new Date().toISOString()
        };
        await axios.post('http://localhost:3001/todos', newTodo);
        console.log('✅ Task aggiunto con successo!');
      } catch (error) {
        console.error('❌ Errore:', error.message);
      }
    }
  })
  .command({
    command: 'list',
    desc: 'Lista tutti i task',
    handler: async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/todos');
        console.log('\n📝 Lista Task:');
        console.table(data);
      } catch (error) {
        console.error('❌ Errore:', error.message);
      }
    }
  })
  .command({
	  command: 'complete <id>',
	  desc: 'Segna task come completato',
	  handler: async (argv) => {
		try {
		  await axios.patch(`http://localhost:3001/todos/${argv.id}`, { completed: true });
		  console.log('\x1b[32m%s\x1b[0m', '✅ Task completato con successo!');
		} catch (error) {
		  console.error('\x1b[31m%s\x1b[0m', '❌ Errore:', error.message);
		}
	  }
	})
	.command({
	  command: 'delete <id>',
	  desc: 'Elimina un task',
	  handler: async (argv) => {
		try {
		  await axios.delete(`http://localhost:3001/todos/${argv.id}`);
		  console.log('\x1b[32m%s\x1b[0m', '🗑️ Task eliminato con successo!');
		} catch (error) {
		  console.error('\x1b[31m%s\x1b[0m', '❌ Errore:', error.message);
		}
	  }
	})
  .demandCommand(1, '⚠️  Specifica un comando valido')
  .help()
  .argv;

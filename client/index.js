#!/usr/bin/env node
/*
    chmod +x index.js
*/

import Events from 'events';
import CliConfig from './src/cliConfig.js';
import EventManager from './src/eventManager.js';
import SocketClient from './src/socket.js';
import TerminalController from './src/terminalController.js';

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);

const componentEmitter = new Events();

const socketClient = new SocketClient(config);

await socketClient.initialize();

const eventManager = new EventManager({ componentEmitter, socketClient });

const events = eventManager.getEvents()
socketClient.attachEvents(events)

const data = {
  roomId: config.room,
  username: config.username,
};

if(!data.roomId || !data.username) {
  process.stdout.write(`\nErro:\nArgumentos esperados: \nhacker-chat --username name --room roomname`)
  process.exit(0)
}


eventManager.joinRoomAndWaitForMessages(data);

const controller = new TerminalController();
await controller.initializeTable(componentEmitter);

const PRODUCTION_URL = 'https://hacker-chat-kore.herokuapp.com'
export default class CliConfig {
  constructor({ username, hostUri = PRODUCTION_URL, room }) {
    this.username = username;
    this.room = room;

    const { hostname, port, protocol } = new URL(hostUri);

    this.host = hostname;
    this.port = port;
    this.protocol = protocol.replace(/\W/, '');
  }
  static parseArguments(commands) {
    const cmd = new Map();
    for (const key in commands) {
      const index = parseInt(key);
      const command = commands[key];

      const commandPrefix = '--';
      if (!command.includes(commandPrefix)) continue;
      cmd.set(command.replace(commandPrefix, ''), commands[index + 1]);
    }

    return new CliConfig(Object.fromEntries(cmd)); // Chave-valor para objeto.
    // Inverso de Object.Entries()
  }
}

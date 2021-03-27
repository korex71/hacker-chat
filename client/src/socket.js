import Event from 'events'
export default class SocketClient {
  #serverConnection = {};
  #serverListener = new Event;

  constructor({ host, port, protocol }) {
    this.host = host;
    this.port = port;
    this.protocol = protocol;
  }

  sendMessage(event, message) {
    this.#serverConnection.write(JSON.stringify({ event, message }));
  }

  attachEvents(){
    this.#serverConnection.on('data', data => {
      try {
        data.toString()
        .split('\n') // > 1 Linha break;
        .filter(line => !!line) // Remove linhas vazias
        .map(JSON.parse)
        .map(({event, message}) => {
          this.#serverListener.emit(event, message) // this[event](id, message) em server
        })
      } catch (error) {
        console.log('invalido', data.toString(), error)
      }
      
    })

    this.#serverConnection.on('end', () => {
      console.log('Desconectado do servidor') // Futura feature de try re-connect ?
    })
    this.#serverConnection.on('error', (error) => {
      console.error('vish', error)
    })

    for(const [key, value] of events){
      this.#serverListener.on(key, value) // 42:36
    }
  }

  async createConnection() {
    const options = {
      port: this.port,
      host: this.host,
      headers: {
        Connection: 'Upgrade',
        Upgrade: 'websocket',
      },
    };

    const http = await import(this.protocol); // import http / https
    const req = http.request(options);
    req.end();

    return new Promise((resolve) => {
      req.once('upgrade', (res, socket) => resolve(socket));
    });
  }

  async initialize() {
    this.#serverConnection = await this.createConnection();
    console.log('I connected to the server');
  }
}

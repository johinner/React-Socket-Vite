const BandList = require("./band/band-list");
const TicketList = require("./ticket/ticket-list");

class Sockets {
  constructor(io) {
    this.io = io;
    this.bandList = new BandList();
    this.ticketList = new TicketList();

    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on("connection", (socket) => {
      console.log("Cliente conectado");

      this.EventsBand(socket);
      this.EventsTicket(socket);
    });
  }

  EventsBand(socket) {
    // Emitir al cliente conectado, todas las bandas actuales
    socket.emit("current-bands", this.bandList.getBands());

    // votar por la banda
    socket.on("votar-banda", (id) => {
      this.bandList.increaseVotes(id);
      this.io.emit("current-bands", this.bandList.getBands());
    });

    // Borrar banda
    socket.on("borrar-banda", (id) => {
      this.bandList.removeBand(id);
      this.io.emit("current-bands", this.bandList.getBands());
    });

    // Cambiar nombre de la banda
    socket.on("cambiar-nombre-banda", ({ id, nombre }) => {
      this.bandList.changeName(id, nombre);
      this.io.emit("current-bands", this.bandList.getBands());
    });

    // Crear una nueva banda
    socket.on("crear-banda", ({ nombre }) => {
      this.bandList.addBand(nombre);
      this.io.emit("current-bands", this.bandList.getBands());
    });
  }


  EventsTicket(socket) {

    socket.on("solicitar-ticket", (data, callback) => {
      const nuevoTicket = this.ticketList.crearTicket();
      callback(nuevoTicket);
    });

    socket.on(
      "siguiente-ticket-trabajar",
      ({ agente, escritorio }, callback) => {
        const suTicket = this.ticketList.asignarTicket(agente, escritorio);
        callback(suTicket);

        this.io.emit("ticket-asignado", this.ticketList.ultimos13);
      });
  }
}

module.exports = Sockets;

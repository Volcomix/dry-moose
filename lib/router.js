class Router {
  constructor(io, namespace, routes, events = {}) {
    this.events = events
    this.io = io.of(namespace).on('connection', socket => {
      Object.entries(this.events).forEach(([event, args]) => {
        socket.emit(event, ...args)
      })
      Object.entries(routes).forEach(([event, fn]) => {
        socket.on(event, fn)
      })
    })
  }

  emit(event, ...args) {
    this.events[event] = args
    this.io.emit(event, ...args)
  }
}

module.exports = Router

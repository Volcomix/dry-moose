const Events = {
  Config: 'Config',
}

class Router {
  constructor(io, namespace, routes, events, config = {}) {
    this.events = events
    this.config = config
    this.io = io.of(namespace).on('connection', socket => {
      socket.on(Events.Config, (key, value, ack) => {
        this.config[key] = value
        ack()
      })
      socket.emit(Events.Config, this.config)
      Object.entries(routes).forEach(([event, fn]) => {
        socket.on(event, fn)
      })
      Object.entries(this.events).forEach(([event, args]) => {
        socket.emit(event, ...args)
      })
    })
  }

  emit(event, ...args) {
    this.events[event] = args
    this.io.emit(event, ...args)
  }
}

module.exports = Router

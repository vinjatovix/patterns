class Event {
  constructor() {
    this.handlers = new Map();
    this.count = 0;
  }
  subscribe(handler) {
    this.handlers.set(++this.count, handler);
    return this.count;
  }
  unsubscribe(id) {
    this.handlers.delete(id);
  }
  fire(sender, args) {
    this.handlers.forEach((handler, k) => handler(sender, args));
  }
}

module.exports = Event;

class Person {
  constructor(name) {
    this.name = name;
    this.chatLog = [];
  }
  receive(sender, message) {
    let s = `${sender}: '${message}'`;
    this.chatLog.push(s);
  }

  say(message) {
    this.room.broadcast(this.name, message);
  }

  privateMessage(who, message) {
    this.room.message(this.name, who, message);
  }
}

class ChatRoom {
  constructor() {
    this.people = [];
  }

  broadcast(sender, message) {
    for (let p of this.people) {
      if (p.name !== sender) {
        p.receive(sender, message);
      }
    }
  }

  join(p) {
    let joinMsg = `${p.name} joins the chat`;
    this.broadcast("room", joinMsg);
    p.room = this;
    this.people.push(p);
  }

  leave(p) {
    let index = this.people.indexOf(p);
    if (index !== -1) {
      this.people.splice(index, 1);
    }
    let leaveMsg = `${p.name} leaves the chat`;
    this.broadcast("room", leaveMsg);
  }

  message(sender, receiver, message) {
    let p = this.people.find(p => p.name === receiver);
    if (p) {
      p.chatLog.push(`${sender}: '${message}'`);
    }
  }

  getPeople() {
    return this.people;
  }
}

module.exports = { Person, ChatRoom };

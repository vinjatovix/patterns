const Event = require("../common/Event");

class ChatRoomUser {
  constructor(name) {
    this.name = name;
    this.room = null;
    this.chatLog = [];
  }

  say(message) {
    const args = new ChatRoomUserEventArgs(this.name, message);
    this.room.events.fire(this, args);
  }

  privateMessage(to, message) {
    const args = new ChatRoomUserEventArgs(this.name, message, to);
    this.room.events.fire(this, args);
  }

  join(room) {
    this.room = room;
    this.room.people.push(this);
    const args = new ChatRoomUserEventArgs("room", `${this.name} joins the chat`);
    this.room.events.subscribe((sender, args) => {
      if (args.sender !== this.name && (args.receiver === "room" || args.receiver === this.name)) {
        this.chatLog.push(`${args.sender}: '${args.message}'`);
      }
    });
    this.room.events.fire(this, args);
  }

  leave() {
    const args = new ChatRoomUserEventArgs("room", `${this.name} leaves the chat`);
    this.room.events.fire(this, args);
    this.room.people = this.room.people.filter(person => person.name !== this.name);
    this.room = null;
  }
}

class ChatRoomUserEventArgs {
  constructor(sender, message, receiver = "room") {
    this.sender = sender;
    this.message = message;
    this.receiver = receiver;
  }
}

class ChatRoom {
  constructor() {
    this.events = new Event();
    this.people = [];
  }
}

module.exports = { ChatRoomUser, ChatRoom };

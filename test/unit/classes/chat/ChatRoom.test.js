const { ChatRoom, Person } = require("../../../../src/classes/chat/ChatRoom");

//

describe("ChatRoom", () => {
  it("should have a ChatRoom", () => {
    const room = new ChatRoom();
    expect(room).toBeDefined();
    expect(room.people).toBeDefined();
    expect(room.people).toHaveLength(0);
    expect(room.join).toBeDefined();
    expect(room.broadcast).toBeDefined();
    expect(room.message).toBeDefined();
  });

  it("should have a Person", () => {
    const person = new Person("John");
    expect(person).toBeDefined();
    expect(person.name).toBeDefined();
    expect(person.name).toBe("John");
    expect(person.chatLog).toBeDefined();
    expect(person.chatLog).toHaveLength(0);
    expect(person.receive).toBeDefined();
    expect(person.say).toBeDefined();
    expect(person.privateMessage).toBeDefined();
  });

  it("should have a Person join a ChatRoom", () => {
    const room = new ChatRoom();
    const person = new Person("John");
    room.join(person);
    expect(room.people).toHaveLength(1);
  });

  it("should have three Person join a ChatRoom", () => {
    const room = new ChatRoom();
    const john = new Person("John");
    const jane = new Person("Jane");
    const simon = new Person("Simon");

    room.join(john);
    room.join(jane);

    expect(john.chatLog).toHaveLength(1);
    expect(jane.chatLog).toHaveLength(0);
    expect(john.chatLog[0]).toBe("room: 'Jane joins the chat'");

    room.join(simon);
    expect(john.chatLog).toHaveLength(2);
    expect(jane.chatLog).toHaveLength(1);
    expect(simon.chatLog).toHaveLength(0);
    expect(john.chatLog[1]).toBe("room: 'Simon joins the chat'");
    expect(jane.chatLog[0]).toBe("room: 'Simon joins the chat'");
  });

  it("should have a Person say something in a ChatRoom", () => {
    const room = new ChatRoom();
    const john = new Person("John");
    const jane = new Person("Jane");

    room.join(john);
    room.join(jane);

    john.say("hi room");
    expect(john.chatLog).toHaveLength(1);
    expect(jane.chatLog).toHaveLength(1);
    expect(john.chatLog[0]).toBe("room: 'Jane joins the chat'");
    expect(jane.chatLog[0]).toBe("John: 'hi room'");
  });

  it("should have a Person private message another Person in a ChatRoom", () => {
    const room = new ChatRoom();
    const john = new Person("John");
    const jane = new Person("Jane");
    const simon = new Person("Simon");

    room.join(john);
    room.join(jane);
    room.join(simon);

    john.say("hi room");
    jane.privateMessage("John", "glad you could join us!");
    expect(john.chatLog).toHaveLength(3);
    expect(jane.chatLog).toHaveLength(2);
    expect(simon.chatLog).toHaveLength(1);

    expect(john.chatLog[0]).toBe("room: 'Jane joins the chat'");
    expect(john.chatLog[1]).toBe("room: 'Simon joins the chat'");
    expect(john.chatLog[2]).toBe("Jane: 'glad you could join us!'");

    expect(jane.chatLog[0]).toBe("room: 'Simon joins the chat'");
    expect(jane.chatLog[1]).toBe("John: 'hi room'");

    expect(simon.chatLog[0]).toBe("John: 'hi room'");
  });

  // simon leaves
  it("should have a Person leave a ChatRoom", () => {
    const room = new ChatRoom();
    const john = new Person("John");
    const simon = new Person("Simon");

    room.join(john);
    room.join(simon);
    room.leave(simon);

    expect(john.chatLog).toHaveLength(2);
    expect(simon.chatLog).toHaveLength(0);

    expect(john.chatLog[0]).toBe("room: 'Simon joins the chat'");
    expect(john.chatLog[1]).toBe("room: 'Simon leaves the chat'");
  });
});

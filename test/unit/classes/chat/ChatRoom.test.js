const { ChatRoom, ChatRoomUser } = require("../../../../src/classes/chat/ChatRoom");

//

describe("ChatRoom", () => {
  it("should have a ChatRoom", () => {
    const room = new ChatRoom();

    expect(room).toBeDefined();
    expect(room.people).toBeDefined();
    expect(room.people).toHaveLength(0);
  });

  it("should have a ChatRoomUser", () => {
    const room = new ChatRoom();
    const person = new ChatRoomUser("John");

    person.join(room);

    expect(room.people).toHaveLength(1);
    expect(person.name).toBe("John");
    expect(person.chatLog).toHaveLength(1);
    expect(person.chatLog[0]).toBe("room: 'John joins the chat'");
    expect(person.say).toBeDefined();
    expect(person.privateMessage).toBeDefined();
    expect(person.leave).toBeDefined();
  });

  it("should have three ChatRoomUser join a ChatRoom", () => {
    const room = new ChatRoom();
    const john = new ChatRoomUser("John");
    const jane = new ChatRoomUser("Jane");
    john.join(room);
    jane.join(room);
    expect(john.chatLog).toHaveLength(2);
    expect(jane.chatLog).toHaveLength(1);
    expect(john.chatLog[1]).toBe("room: 'Jane joins the chat'");
    const simon = new ChatRoomUser("Simon");

    simon.join(room);

    expect(john.chatLog).toHaveLength(3);
    expect(jane.chatLog).toHaveLength(2);
    expect(simon.chatLog).toHaveLength(1);
    expect(john.chatLog[2]).toBe("room: 'Simon joins the chat'");
    expect(jane.chatLog[1]).toBe("room: 'Simon joins the chat'");
  });

  it("should have a ChatRoomUser say something in a ChatRoom", () => {
    const room = new ChatRoom();
    const john = new ChatRoomUser("John");
    const jane = new ChatRoomUser("Jane");
    john.join(room);
    jane.join(room);

    john.say("hi room");

    expect(john.chatLog).toHaveLength(2);
    expect(jane.chatLog).toHaveLength(2);
    expect(john.chatLog[1]).toBe("room: 'Jane joins the chat'");
    expect(jane.chatLog[1]).toBe("John: 'hi room'");
  });

  it("should have a ChatRoomUser private message another ChatRoomUser in a ChatRoom", () => {
    const room = new ChatRoom();
    const john = new ChatRoomUser("John", room);
    const jane = new ChatRoomUser("Jane", room);
    const simon = new ChatRoomUser("Simon", room);
    john.join(room);
    jane.join(room);
    simon.join(room);
    john.say("hi room");

    jane.privateMessage("John", "glad you could join us!");

    expect(john.chatLog).toHaveLength(4);
    expect(jane.chatLog).toHaveLength(3);
    expect(simon.chatLog).toHaveLength(2);
    expect(john.chatLog[1]).toBe("room: 'Jane joins the chat'");
    expect(john.chatLog[2]).toBe("room: 'Simon joins the chat'");
    expect(john.chatLog[3]).toBe("Jane: 'glad you could join us!'");
    expect(jane.chatLog[1]).toBe("room: 'Simon joins the chat'");
    expect(jane.chatLog[2]).toBe("John: 'hi room'");
    expect(simon.chatLog[1]).toBe("John: 'hi room'");
  });

  it("should have a ChatRoomUser leave a ChatRoom", () => {
    const room = new ChatRoom();
    const john = new ChatRoomUser("John", room);
    const simon = new ChatRoomUser("Simon", room);
    john.join(room);
    simon.join(room);

    simon.leave();

    expect(john.chatLog).toHaveLength(3);
    expect(simon.chatLog).toHaveLength(2);

    expect(john.chatLog[1]).toBe("room: 'Simon joins the chat'");
    expect(john.chatLog[2]).toBe("room: 'Simon leaves the chat'");
  });
});

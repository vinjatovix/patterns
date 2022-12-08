const Event = require("../../../../src/classes/common/Event");

describe("Event", () => {
  it("should create a new event", () => {
    const event = new Event();

    expect(event.handlers).toBeInstanceOf(Map);
    expect(event.handlers.size).toBe(0);
    expect(event.count).toBe(0);
  });

  it("should subscribe a handler", () => {
    const event = new Event();
    const handler = jest.fn();

    const id = event.subscribe(handler);

    expect(id).toBe(1);
    expect(event.handlers.size).toBe(1);
    expect(event.handlers.get(1)).toBe(handler);
  });

  it("should unsubscribe a handler", () => {
    const event = new Event();
    const handler = jest.fn();
    const id = event.subscribe(handler);

    event.unsubscribe(id);

    expect(event.handlers.size).toBe(0);
  });

  it("should fire an event", () => {
    const event = new Event();
    const handler = jest.fn();
    event.subscribe(handler);

    event.fire();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should fire an event with args", () => {
    const event = new Event();
    const handler = jest.fn();
    event.subscribe(handler);

    event.fire({}, { foo: "bar" });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({}, { foo: "bar" });
  });
});

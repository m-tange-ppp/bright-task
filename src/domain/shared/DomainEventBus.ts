type Handler<T> = (event: T) => Promise<void>;

class DomainEventBus {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly handlers = new Map<string, Handler<any>[]>();

  subscribe<T>(eventType: string, handler: Handler<T>): void {
    // 上書きにすることで Hot Reload 等での重複登録を防ぐ
    this.handlers.set(eventType, [handler]);
  }

  async publish<T>(eventType: string, event: T): Promise<void> {
    const list = this.handlers.get(eventType) ?? [];
    for (const handler of list) {
      await handler(event);
    }
  }
}

export const domainEventBus = new DomainEventBus();

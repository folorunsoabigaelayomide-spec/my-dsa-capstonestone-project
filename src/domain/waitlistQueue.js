export class Queue {
  #head = null;
  #tail = null;
  #size = 0;

  enqueue(value) {
    const node = { value, next: null };
    if (this.#tail) this.#tail.next = node;
    else this.#head = node;
    this.#tail = node;
    this.#size++;
  }

  dequeue() {
    if (!this.#head) return undefined;
    const node = this.#head;
    this.#head = node.next;
    if (!this.#head) this.#tail = null;
    this.#size--;
    return node.value;
  }

  peek() {
    return this.#head ? this.#head.value : undefined;
  }

  get size() {
    return this.#size;
  }
}
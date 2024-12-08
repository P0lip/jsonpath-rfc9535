interface INode<T> {
	value: T;
	next: INode<T> | null;
}

interface INode<T> {
	value: T;
	next: INode<T> | null;
}

export class Stack<T> {
	private head: INode<T> | null = null;
	private tail: INode<T> | null = null;
	public size = 0;

	push(element: T): void {
		const newNode: INode<T> = { value: element, next: null };
		if (this.tail !== null) {
			this.tail.next = newNode;
		}
		this.tail = newNode;
		if (this.head === null) {
			this.head = newNode;
		}
		this.size++;
	}

	pop(): T | undefined {
		if (this.head === null) return;
		const value = this.head.value;
		this.head = this.head.next;
		if (this.head === null) {
			this.tail = null;
		}
		this.size--;
		return value;
	}
}

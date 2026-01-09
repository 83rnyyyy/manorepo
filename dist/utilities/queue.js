/**
 * The class for a queue ADT. This version uses a generic to be statically typed. It can be removed if a dynamic version is needed. It uses a static array.
 * @public array: The actual queue
 * @public front: The index of the front of the queue
 * @public n: The number of elements in the queue
 */
export class CircularQueue {
    max;
    array;
    front = 0;
    n = 0;
    constructor(max = 16) {
        this.max = max;
        //Defaults the array to length 16 if not provided a length
        this.array = new Array(this.max);
    }
    /**
     * Helper method to resize the current array to the set size. All elements will be placed at the front of the array and "front" will be reset to zero.
     * @param size: the size the new array will be
     */
    resize(size) {
        const newArray = new Array(size);
        for (let i = 0; i < this.n; i++) {
            newArray[i] = this.array[(this.front + i) % this.array.length];
        }
        this.front = 0;
        this.array = newArray;
        this.max = size;
    }
    /**
     * Adds the input element to the back of the queue. First the size of the queue will checked. If the queue is too short, it will be first resized before enqueuing the element.
     * @param value: The element to be added.
     */
    enqueue(value) {
        if (this.n >= this.max) {
            this.resize(this.max * 2);
        }
        this.array[(this.front + this.n) % this.max] = value;
        this.n++;
    }
    /**
     * Removes the element at the front of queue and returns it. Doing is will change the value of front, effectively "shifting it forward" by one. Resize the queue if there's too many empty slots. Min size is 16.
     */
    dequeue() {
        if (this.n === 0)
            return;
        const r = this.array[this.front];
        delete this.array[this.front];
        this.front = (this.front + 1) % this.max;
        this.n--;
        if (this.n < this.max / 4 && this.max > 16) {
            this.resize(this.max / 2);
        }
        //We can also choose to decrease the length of array to save space here
        return r;
    }
    /**
     * Returns the element at the front of the queue without removing it.
     */
    peek() {
        return this.array[this.front];
    }
    /**
     * Searches through the queue to see if the input element exists in the queue.
     * @param arg: The element to search for.
     */
    contains(arg) {
        for (let i = 0; i < this.array.length; i++) {
            if (this.array[i] === arg) {
                return true;
            }
        }
        return false;
    }
    /**
     * Returns the length of the queue
     */
    size() {
        return this.n;
    }
}
//# sourceMappingURL=queue.js.map
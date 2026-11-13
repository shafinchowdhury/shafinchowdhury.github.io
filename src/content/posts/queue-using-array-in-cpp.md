---
title: "Queue Implementation Using Array in C++: Linear & Circular Queue Guide"
author: "Shafin Chowdhury"
pubDatetime: 2026-11-13T11:00:00+06:00
featured: false
draft: false
tags:
  - cpp
  - data-structures
  - queue
  - arrays
  - beginners
description: "Learn how to implement a Queue from scratch using a fixed-size array in C++. Master front and rear index management, enqueue and dequeue operations, Queue Overflow and Underflow, visual dry runs, linear Queue limitations, and Circular Queue improvements."
---

In [Step 1: Understanding Queue in C++](/posts/understanding-queue-in-cpp/), we learned how `std::queue` manages FIFO operations behind the scenes. Now it is time to open the hood and build a **Queue from scratch using a fixed-size C++ array**.

> **Part of the Queue Series:** This article is **Step 2** of our [Queue in C++: Complete Beginner-to-Advanced Guide](/topics/queue/).

---

## 1. How an Array-Based Queue Works

When we implemented a [Stack using an array](/posts/stack-using-array-in-cpp/), we only needed **one** index variable (`topIndex`) because both insertions and removals happened at the exact same end.

A **Queue**, however, inserts elements at the **Rear** and removes elements from the **Front**. To build a Queue on top of a fixed-size array `arr[MAX_SIZE]`, our class needs **two integer index trackers**:

1. **`frontIndex`**: Stores the array index of the **oldest element** currently at the front of the line (where `dequeue` happens).
2. **`rearIndex`**: Stores the array index of the **newest element** most recently added at the back of the line (where `enqueue` happens).

```cpp
const int MAX_SIZE = 5;

class Queue {
private:
    int arr[MAX_SIZE]; // Fixed-size storage array
    int frontIndex;    // Index of the front (oldest) element
    int rearIndex;     // Index of the rear (newest) element
};
```

Here is what an array-based Queue looks like when three elements (`10`, `20`, `30`) are inside:

```text
Array Indices:     [0]     [1]     [2]     [3]     [4]
                 +-----+ +-----+ +-----+ +-----+ +-----+
Array Values:    |  10 | |  20 | |  30 | |     | |     |
                 +-----+ +-----+ +-----+ +-----+ +-----+
                    ^               ^
               frontIndex = 0  rearIndex = 2
               (Next to exit)  (Last inserted)
```

---

## 2. Initializing an Empty Queue (`front = -1`, `rear = -1`)

When a new `Queue` object is created, its [constructor](/posts/cpp-constructors-and-destructors/) sets both `frontIndex` and `rearIndex` to **`-1`**:

```cpp
Queue() {
    frontIndex = -1;
    rearIndex = -1;
}
```

### Why `-1` Instead of `0`?

In C++, `0` is a valid [array index](/posts/cpp-arrays/) (`arr[0]`). If we initialized `frontIndex = 0` and `rearIndex = 0`, it would look like there is already 1 valid element sitting at `arr[0]`!

Setting both `frontIndex = -1` and `rearIndex = -1` provides an unmistakable signal that **zero elements are currently in the Queue**:

```text
Empty Queue State (frontIndex = -1, rearIndex = -1):

   (-1)         [0]     [1]     [2]     [3]     [4]
    ^         +-----+ +-----+ +-----+ +-----+ +-----+
frontIndex &  |     | |     | |     | |     | |     |
 rearIndex    +-----+ +-----+ +-----+ +-----+ +-----+
 (Outside)
```

---

## 3. Enqueue Operation (Inserting at the Rear)

Adding a new element (`enqueue`) always happens at the **Rear** of the queue. However, we must handle two cases carefully:

1. **Inserting into an Empty Queue (`frontIndex == -1`):** Since this is the very first element entering the queue, it becomes **both** the front and the rear! So we must set `frontIndex = 0` in addition to advancing `rearIndex` to `0`.
2. **Inserting into a Non-Empty Queue:** `frontIndex` stays where it is, and we simply increment `rearIndex++` and store the new value at `arr[rearIndex]`.

```cpp
// Insert an element at the rear of the queue
void enqueue(int value) {
    // 1. Check for Queue Overflow
    if (isFull()) {
        cout << "Queue Overflow! Cannot enqueue " << value << "." << endl;
        return;
    }

    // 2. If queue was empty, move frontIndex to 0
    if (frontIndex == -1) {
        frontIndex = 0;
    }

    // 3. Advance rearIndex and insert the new element
    rearIndex++;
    arr[rearIndex] = value;
    cout << value << " enqueued at index " << rearIndex << "." << endl;
}
```

### Visual Trace of `enqueue(10)`, `enqueue(20)`, and `enqueue(30)`

```text
1. Initial Empty Queue:
   frontIndex = -1, rearIndex = -1
   Index:    [0]   [1]   [2]   [3]   [4]
           +-----+-----+-----+-----+-----+
   arr:    |     |     |     |     |     |
           +-----+-----+-----+-----+-----+

2. After enqueue(10) -> First element sets frontIndex = 0, rearIndex = 0:
   Index:    [0]   [1]   [2]   [3]   [4]
           +-----+-----+-----+-----+-----+
   arr:    |  10 |     |     |     |     |
           +-----+-----+-----+-----+-----+
              ^
        frontIndex = 0
         rearIndex = 0

3. After enqueue(20) -> rearIndex++ becomes 1:
   Index:    [0]   [1]   [2]   [3]   [4]
           +-----+-----+-----+-----+-----+
   arr:    |  10 |  20 |     |     |     |
           +-----+-----+-----+-----+-----+
              ^     ^
          front=0 rear=1

4. After enqueue(30) -> rearIndex++ becomes 2:
   Index:    [0]   [1]   [2]   [3]   [4]
           +-----+-----+-----+-----+-----+
   arr:    |  10 |  20 |  30 |     |     |
           +-----+-----+-----+-----+-----+
              ^           ^
          front=0       rear=2
```

---

## 4. Dequeue Operation (Removing from the Front)

Removing an element (`dequeue`) always happens at the **Front** of the queue. Instead of shifting every remaining element one slot to the left (which would waste $O(n)$ time), we simply **move `frontIndex` one step to the right** (`frontIndex++`) in $O(1)$ time!

There is one critical edge case to watch for:

- **What if we are removing the last remaining element in the Queue (`frontIndex == rearIndex`)?**
  When only one element is left, `frontIndex` and `rearIndex` point to the exact same slot. Once that last element is removed, the Queue is completely empty again—so we **reset both `frontIndex = -1` and `rearIndex = -1`**.

```cpp
// Remove the front element from the queue
void dequeue() {
    // 1. Check for Queue Underflow
    if (isEmpty()) {
        cout << "Queue Underflow! Cannot dequeue from an empty queue." << endl;
        return;
    }

    int removedValue = arr[frontIndex];
    cout << removedValue << " dequeued from index " << frontIndex << "." << endl;

    // 2. If this was the only element left, reset queue to empty state
    if (frontIndex == rearIndex) {
        frontIndex = -1;
        rearIndex = -1;
    }
    // 3. Otherwise, advance frontIndex to the next element in line
    else {
        frontIndex++;
    }
}
```

### Visual Trace of `dequeue()`

```text
Before dequeue() (frontIndex = 0, rearIndex = 2):
   Index:    [0]   [1]   [2]   [3]   [4]
           +-----+-----+-----+-----+-----+
   arr:    |  10 |  20 |  30 |     |     |
           +-----+-----+-----+-----+-----+
              ^           ^
          front=0       rear=2

After 1st dequeue() -> 10 leaves; frontIndex++ becomes 1:
   Index:    [0]   [1]   [2]   [3]   [4]
           +-----+-----+-----+-----+-----+
   arr:    | (10)|  20 |  30 |     |     |
           +-----+-----+-----+-----+-----+
                    ^     ^
                front=1 rear=2
   (Slot [0] is now outside the active queue boundary)

After 2nd dequeue() -> 20 leaves; frontIndex++ becomes 2:
   Index:    [0]   [1]   [2]   [3]   [4]
           +-----+-----+-----+-----+-----+
   arr:    | (10)| (20)|  30 |     |     |
           +-----+-----+-----+-----+-----+
                          ^
                      front = 2
                       rear = 2 (Only 1 element left!)

After 3rd dequeue() -> 30 leaves; since front == rear, reset both to -1:
   frontIndex = -1, rearIndex = -1 (Queue is completely empty again)
```

---

## 5. Queue Overflow, Queue Underflow, and Boundary Helpers

To keep our array-based Queue safe from out-of-bounds memory access, we implement six clean helper functions:

### 1. `isEmpty()` (Queue Underflow Check)

```cpp
bool isEmpty() {
    return frontIndex == -1;
}
```

Whenever `frontIndex == -1`, the queue holds zero elements. Calling `dequeue()`, `front()`, or `rear()` when `isEmpty()` is `true` triggers **Queue Underflow**.

### 2. `isFull()` (Queue Overflow Check)

```cpp
bool isFull() {
    return rearIndex == MAX_SIZE - 1;
}
```

In a simple linear array Queue, once `rearIndex` reaches the final array index (`MAX_SIZE - 1`), no more elements can be appended to the right. Calling `enqueue()` when `isFull()` is `true` triggers **Queue Overflow**.

### 3. `front()`, `rear()`, and `size()`

```cpp
int front() {
    if (isEmpty()) {
        cout << "Queue is empty! No front element." << endl;
        return -1;
    }
    return arr[frontIndex];
}

int rear() {
    if (isEmpty()) {
        cout << "Queue is empty! No rear element." << endl;
        return -1;
    }
    return arr[rearIndex];
}

int size() {
    if (isEmpty()) {
        return 0;
    }
    return rearIndex - frontIndex + 1;
}
```

Look at the formula inside `size()`: because active elements sit contiguously from `frontIndex` to `rearIndex` inclusive, the number of elements in the queue is always **`rearIndex - frontIndex + 1`**! (For example, if `frontIndex = 1` and `rearIndex = 3`, active indices are `1, 2, 3`, and `3 - 1 + 1 = 3` elements.)

---

## 6. Complete C++ Code: Linear Array Queue

Here is the complete, compilable C++ implementation of a `Queue` class using a fixed-size array:

```cpp
#include <iostream>

using namespace std;

const int MAX_SIZE = 5;

class Queue {
private:
    int arr[MAX_SIZE];
    int frontIndex;
    int rearIndex;

public:
    // Constructor: initialize an empty queue
    Queue() {
        frontIndex = -1;
        rearIndex = -1;
    }

    // Check if the queue is empty
    bool isEmpty() {
        return frontIndex == -1;
    }

    // Check if the linear queue has reached the end of the array
    bool isFull() {
        return rearIndex == MAX_SIZE - 1;
    }

    // Insert an element at the rear
    void enqueue(int value) {
        if (isFull()) {
            cout << "Queue Overflow! Cannot enqueue " << value << "." << endl;
            return;
        }
        if (frontIndex == -1) {
            frontIndex = 0;
        }
        rearIndex++;
        arr[rearIndex] = value;
        cout << value << " enqueued at index " << rearIndex << "." << endl;
    }

    // Remove the oldest element from the front
    void dequeue() {
        if (isEmpty()) {
            cout << "Queue Underflow! Cannot dequeue from an empty queue." << endl;
            return;
        }
        int removedValue = arr[frontIndex];
        cout << removedValue << " dequeued from index " << frontIndex << "." << endl;

        if (frontIndex == rearIndex) {
            // Queue had only 1 element; reset to empty state
            frontIndex = -1;
            rearIndex = -1;
        } else {
            frontIndex++;
        }
    }

    // Read the front element without removing it
    int front() {
        if (isEmpty()) {
            cout << "Queue is empty!" << endl;
            return -1;
        }
        return arr[frontIndex];
    }

    // Read the rear element without removing it
    int rear() {
        if (isEmpty()) {
            cout << "Queue is empty!" << endl;
            return -1;
        }
        return arr[rearIndex];
    }

    // Return the number of active elements in the queue
    int size() {
        if (isEmpty()) {
            return 0;
        }
        return rearIndex - frontIndex + 1;
    }

    // Print all active elements from Front to Rear
    void display() {
        if (isEmpty()) {
            cout << "Queue is empty." << endl;
            return;
        }
        cout << "Queue (Front to Rear): ";
        for (int i = frontIndex; i <= rearIndex; i++) {
            cout << arr[i] << " ";
        }
        cout << endl;
    }
};

int main() {
    Queue q;

    // 1. Enqueue 5 elements to fill the queue
    q.enqueue(10);
    q.enqueue(20);
    q.enqueue(30);
    q.enqueue(40);
    q.enqueue(50);

    // 2. Test Queue Overflow
    q.enqueue(60);

    cout << "---" << endl;
    q.display();
    cout << "Front element: " << q.front() << endl;
    cout << "Rear element: " << q.rear() << endl;
    cout << "Current size: " << q.size() << endl;

    cout << "---" << endl;

    // 3. Dequeue 2 elements from the front
    q.dequeue();
    q.dequeue();
    q.display();
    cout << "New Front element: " << q.front() << endl;
    cout << "Current size: " << q.size() << endl;

    return 0;
}
```

### Output

```text
10 enqueued at index 0.
20 enqueued at index 1.
30 enqueued at index 2.
40 enqueued at index 3.
50 enqueued at index 4.
Queue Overflow! Cannot enqueue 60.
---
Queue (Front to Rear): 10 20 30 40 50
Front element: 10
Rear element: 50
Current size: 5
---
10 dequeued from index 0.
20 dequeued from index 1.
Queue (Front to Rear): 30 40 50
New Front element: 30
Current size: 3
```

---

## 7. Complete Step-by-Step Dry Run

Let's trace a sequence of operations on a linear array Queue with `MAX_SIZE = 3`:

| Step  | Operation        | `frontIndex` | `rearIndex` | Active Queue (`front..rear`) | Explanation                                              |
| :---: | :--------------- | :----------: | :---------: | :--------------------------- | :------------------------------------------------------- |
| **1** | `Queue q;`       |     `-1`     |    `-1`     | `[ ]` (Empty)                | Initialized to `-1`.                                     |
| **2** | `q.enqueue(10);` |     `0`      |     `0`     | `[10]`                       | First item sets both `front` and `rear` to `0`.          |
| **3** | `q.enqueue(20);` |     `0`      |     `1`     | `[10, 20]`                   | `rearIndex` increments to `1`.                           |
| **4** | `q.dequeue();`   |     `1`      |     `1`     | `[20]`                       | `10` removed from index `0`; `frontIndex` moves to `1`.  |
| **5** | `q.enqueue(30);` |     `1`      |     `2`     | `[20, 30]`                   | `rearIndex` increments to `2` (`MAX_SIZE - 1`).          |
| **6** | `q.dequeue();`   |     `2`      |     `2`     | `[30]`                       | `20` removed from index `1`; `frontIndex` moves to `2`.  |
| **7** | `q.dequeue();`   |     `-1`     |    `-1`     | `[ ]` (Empty)                | Since `front == rear == 2`, both reset to `-1`!          |
| **8** | `q.dequeue();`   |     `-1`     |    `-1`     | `[ ]` (Empty)                | `isEmpty()` is `true` $\rightarrow$ **Queue Underflow!** |

---

## 8. The Limitation of a Simple Linear Queue ("False Overflow")

Look closely at **Step 5** in the dry run above, or look at what happens in `main()` after we dequeued `10` and `20`:

```text
State after 5 enqueues and 2 dequeues (MAX_SIZE = 5):

   Index:     [0]     [1]     [2]     [3]     [4]
            +-----+ +-----+ +-----+ +-----+ +-----+
   arr:     |Empty| |Empty| |  30 | |  40 | |  50 |
            +-----+ +-----+ +-----+ +-----+ +-----+
              ^^^     ^^^      ^               ^
            Vacated slots!  front=2         rear=4 (MAX_SIZE - 1)
```

Notice the problem:

- The Queue currently holds only **3 elements** (`30`, `40`, `50`).
- Slots `[0]` and `[1]` are **completely unoccupied** because `10` and `20` were already dequeued.
- Yet if we try to call `q.enqueue(60)`, `isFull()` checks `rearIndex == MAX_SIZE - 1` (`4 == 4`) and rejects it with **Queue Overflow**!

Why? Because in a simple linear Queue, `frontIndex` and `rearIndex` **only move rightward**. Unless the entire queue becomes completely empty (which resets both to `-1`), the vacated slots to the left of `frontIndex` can never be reused. This flaw is called **False Overflow**.

---

## 9. Improvement: Circular Queue (Ring Buffer)

How can we reuse those empty slots at the beginning of the array without shifting elements? By connecting the last index (`MAX_SIZE - 1`) back to index `0` in a circle—creating a **Circular Queue**!

### How Modulo Arithmetic (`% MAX_SIZE`) Creates a Circle

In a Circular Queue, instead of incrementing indices with `rearIndex++`, we advance both pointers using the **modulo operator (`%`)**:

$$\text{nextIndex} = (\text{currentIndex} + 1) \bmod \text{MAX\_SIZE}$$

Look at what `(index + 1) % 5` produces when `MAX_SIZE = 5`:

- When `rearIndex = 0` $\rightarrow$ `(0 + 1) % 5 = 1`
- When `rearIndex = 1` $\rightarrow$ `(1 + 1) % 5 = 2`
- When `rearIndex = 2` $\rightarrow$ `(2 + 1) % 5 = 3`
- When `rearIndex = 3` $\rightarrow$ `(3 + 1) % 5 = 4`
- When `rearIndex = 4` $\rightarrow$ **`(4 + 1) % 5 = 0` (Wraps right back to index `0`!)**

```text
Wrapping Around in a Circular Queue (MAX_SIZE = 5):

   enqueue(60) wraps rearIndex from 4 -> (4 + 1) % 5 = 0!
                  +---------------------------------------+
                  v                                       |
   Index:        [0]     [1]     [2]     [3]     [4]      |
               +-----+ +-----+ +-----+ +-----+ +-----+    |
   arr:        |  60 | |Empty| |  30 | |  40 | |  50 | ---+
               +-----+ +-----+ +-----+ +-----+ +-----+
                  ^               ^
               rear=0          front=2
        (Newest element)   (Oldest element)
```

### Complete Circular Queue Class in C++

By maintaining a `currentSize` counter alongside `frontIndex` and `rearIndex`, a Circular Queue becomes remarkably clean to write and eliminates False Overflow completely:

```cpp
#include <iostream>

using namespace std;

const int MAX_SIZE = 5;

class CircularQueue {
private:
    int arr[MAX_SIZE];
    int frontIndex;
    int rearIndex;
    int currentSize;

public:
    CircularQueue() {
        frontIndex = 0;
        rearIndex = -1;
        currentSize = 0;
    }

    bool isEmpty() {
        return currentSize == 0;
    }

    bool isFull() {
        return currentSize == MAX_SIZE;
    }

    void enqueue(int value) {
        if (isFull()) {
            cout << "Circular Queue Overflow! All " << MAX_SIZE << " slots are in use." << endl;
            return;
        }
        // Wrap rearIndex around using modulo arithmetic
        rearIndex = (rearIndex + 1) % MAX_SIZE;
        arr[rearIndex] = value;
        currentSize++;
        cout << value << " enqueued at index " << rearIndex << "." << endl;
    }

    void dequeue() {
        if (isEmpty()) {
            cout << "Circular Queue Underflow!" << endl;
            return;
        }
        cout << arr[frontIndex] << " dequeued from index " << frontIndex << "." << endl;
        // Wrap frontIndex around using modulo arithmetic
        frontIndex = (frontIndex + 1) % MAX_SIZE;
        currentSize--;
    }

    int front() {
        if (isEmpty()) return -1;
        return arr[frontIndex];
    }

    int rear() {
        if (isEmpty()) return -1;
        return arr[rearIndex];
    }

    void display() {
        if (isEmpty()) {
            cout << "Queue is empty." << endl;
            return;
        }
        cout << "Circular Queue (Front to Rear): ";
        for (int count = 0; count < currentSize; count++) {
            int index = (frontIndex + count) % MAX_SIZE;
            cout << arr[index] << " ";
        }
        cout << endl;
    }
};

int main() {
    CircularQueue cq;

    // Fill all 5 slots (indices 0..4)
    cq.enqueue(10);
    cq.enqueue(20);
    cq.enqueue(30);
    cq.enqueue(40);
    cq.enqueue(50);

    // Free up indices 0 and 1
    cq.dequeue();
    cq.dequeue();

    // Reuse indices 0 and 1 by wrapping around!
    cq.enqueue(60);
    cq.enqueue(70);

    cq.display();
    cout << "Front: " << cq.front() << " | Rear: " << cq.rear() << endl;

    return 0;
}
```

### Output

```text
10 enqueued at index 0.
20 enqueued at index 1.
30 enqueued at index 2.
40 enqueued at index 3.
50 enqueued at index 4.
10 dequeued from index 0.
20 dequeued from index 1.
60 enqueued at index 0.
70 enqueued at index 1.
Circular Queue (Front to Rear): 30 40 50 60 70
Front: 30 | Rear: 70
```

---

## 10. Time and Space Complexity

Both the Linear Array Queue and the Circular Array Queue perform all core operations in **$O(1)$ constant time**:

| Operation                    |      Linear Array Queue      |       Circular Array Queue       | Explanation                                                  |
| :--------------------------- | :--------------------------: | :------------------------------: | :----------------------------------------------------------- |
| **`enqueue(value)`**         |          **$O(1)$**          |            **$O(1)$**            | Updates `rearIndex` and writes `arr[rearIndex]` in one step. |
| **`dequeue()`**              |          **$O(1)$**          |            **$O(1)$**            | Advances `frontIndex` in one step without shifting elements. |
| **`front()` / `rear()`**     |          **$O(1)$**          |            **$O(1)$**            | Direct array index lookup.                                   |
| **`isEmpty()` / `isFull()`** |          **$O(1)$**          |            **$O(1)$**            | Single integer comparison.                                   |
| **Reuses Vacated Space?**    | Only when completely emptied | **Always ($100\%$ utilization)** | Circular Queue wraps around via `(idx + 1) % MAX_SIZE`.      |

- **Space Complexity:** **$O(\text{MAX\_SIZE})$**, as the fixed array reserves `MAX_SIZE` contiguous integer slots up front.

---

## Summary

- An array-based Queue tracks **two indices**: `frontIndex` (oldest element) and `rearIndex` (newest element), both initialized to **`-1`**.
- **`enqueue(x)`** inserts at `rearIndex`; if the queue was empty (`frontIndex == -1`), it also sets `frontIndex = 0`.
- **`dequeue()`** removes from `frontIndex` by advancing `frontIndex++`; if `frontIndex == rearIndex`, it resets both to `-1`.
- A **simple linear Queue** suffers from **False Overflow** when `rearIndex` hits `MAX_SIZE - 1` even if earlier slots were vacated.
- A **Circular Queue** uses modulo arithmetic `(index + 1) % MAX_SIZE` to wrap around and reuse every vacated array slot.

---

## Continue Learning in the Queue Series

What if you don't know the maximum number of elements ahead of time and want to use a dynamic C++ `std::vector`? In Step 3, we will build a Queue using `std::vector` and uncover a crucial performance trap with `vector.erase()`!

- **Topic Hub:** [Queue in C++: Complete Beginner-to-Advanced Guide](/topics/queue/)
- **Previous Article (Step 1):** [Understanding Queue in C++: Complete Beginner's Guide](/posts/understanding-queue-in-cpp/)
- **Next Article (Step 3):** [Queue Implementation Using Vector in C++](/posts/queue-using-vector-in-cpp/)
- **Step 4:** [Queue Implementation Using Linked List in C++](/posts/queue-using-linked-list-in-cpp/)
- **Step 5:** [Most Famous Queue Problems in Competitive Programming](/posts/top-5-queue-problems-in-cpp/)
- **Step 6:** [Queue vs Stack in C++: Complete Comparison](/posts/queue-vs-stack-in-cpp/)

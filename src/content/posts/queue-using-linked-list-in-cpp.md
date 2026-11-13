---
title: "Queue Implementation Using Linked List in C++: Dynamic Pointers Guide"
author: "Shafin Chowdhury"
pubDatetime: 2026-11-13T13:00:00+06:00
featured: false
draft: false
tags:
  - cpp
  - data-structures
  - queue
  - linked-list
  - pointers
  - dynamic-memory
description: "Learn how to implement a Queue using a singly linked list in C++. Master Node structs, front and rear pointers, dynamic memory allocation with new and delete, empty queue edge cases, destructor cleanup, visual pointer diagrams, and Array vs Linked List trade-offs."
---

In our previous guides, we saw that a [fixed-size Array Queue](/posts/queue-using-array-in-cpp/) has a hard capacity limit (`MAX_SIZE`), while a naive [`std::vector` Queue](/posts/queue-using-vector-in-cpp/) takes $O(n)$ time to erase from the front.

By implementing a Queue using a **Singly Linked List**, we get the best of both worlds:

1. **Unbounded Dynamic Size:** The Queue grows one node at a time on the heap as long as RAM is available.
2. **Strict $O(1)$ Worst-Case Enqueue and Dequeue:** No shifting elements and no array reallocation pauses.
3. **Immediate Memory Reclamation:** Every `dequeue()` immediately frees the removed node's memory with `delete`.

In this guide, we will build a Linked-List Queue in C++ from scratch, trace how the `frontNode` and `rearNode` pointers move using step-by-step diagrams, and ensure zero memory leaks with a proper destructor.

> **Part of the Queue Series:** This article is **Step 4** of our [Queue in C++: Complete Beginner-to-Advanced Guide](/topics/queue/).

---

## 1. Node Structure in C++

A singly linked list stores elements in heap-allocated building blocks called **Nodes**. Each `Node` contains two members:

1. **`data`**: The value stored inside the node (for example, an `int`).
2. **`next`**: A [pointer](/posts/cpp-pointers/) holding the memory address of the next node in the queue (or `nullptr` if this node is at the very end).

```cpp
class Node {
public:
    int data;
    Node* next;

    // Constructor: initialize node value and set next pointer to nullptr
    Node(int value) {
        data = value;
        next = nullptr;
    }
};
```

---

## 2. Front and Rear Pointers (Which End Is Head and Which Is Tail?)

When we built a [Stack using a Linked List](/posts/stack-using-linked-list-in-cpp/), we only needed a single `topNode` pointer at the **Head** of the linked list because both `push()` and `pop()` operated at the exact same end.

A **Queue**, however, inserts at the **Rear** and removes from the **Front**. In a Singly Linked List, every node's `next` pointer points forward in one direction (`Head -> ... -> Tail -> nullptr`).

Let's think carefully: **Which end of the singly linked list should be `Front` (dequeue), and which should be `Rear` (enqueue)?**

- **Removing a node at the Head (first node)** only requires advancing `head = head->next`, which is **$O(1)$**.
- **Removing a node at the Tail (last node)** would require walking from the beginning of the list to find the second-to-last node, which takes slow **$O(n)$ time**!
- **Inserting a node at the Tail (last node)** is **$O(1)$** as long as we maintain a tail pointer (`rearNode->next = newNode`)!

Therefore, in a Linked-List Queue:

- **`frontNode` points to the Head (first node)** of the linked list $\rightarrow$ **`dequeue()` removes from the Head in $O(1)$ time.**
- **`rearNode` points to the Tail (last node)** of the linked list $\rightarrow$ **`enqueue()` appends to the Tail in $O(1)$ time.**

```text
Linked-List Queue Architecture:

  frontNode (Head)                                 rearNode (Tail)
  (Dequeue here in O(1))                           (Enqueue here in O(1))
       |                                                |
       v                                                v
   +------+------+       +------+------+       +------+---------+
   |  10  | next | ----> |  20  | next | ----> |  30  | nullptr |
   +------+------+       +------+------+       +------+---------+
   Oldest Element                              Newest Element
```

### Initializing an Empty Queue

When our `Queue` class is constructed, zero nodes exist on the heap, so both `frontNode` and `rearNode` are initialized to `nullptr`:

```cpp
class Queue {
private:
    Node* frontNode; // Points to the oldest node (Head)
    Node* rearNode;  // Points to the newest node (Tail)
    int currentSize; // Tracks active element count in O(1)

public:
    Queue() {
        frontNode = nullptr;
        rearNode = nullptr;
        currentSize = 0;
    }

    bool isEmpty() {
        return frontNode == nullptr;
    }
};
```

---

## 3. Enqueue Operation (With Visual Pointer Diagrams)

When `enqueue(int value)` is called, we allocate a new node on the heap using [dynamic memory allocation (`new`)](/posts/dynamic-memory-allocation/):

```cpp
Node* newNode = new Node(value);
```

Next, we must handle **two distinct cases**:

### Case 1: The Queue Is Currently Empty (`frontNode == nullptr`)

If the queue is empty, `newNode` is the only node in the queue—so **both `frontNode` and `rearNode` must point to `newNode`**!

```text
Case 1: enqueue(10) into an Empty Queue

Before:
  frontNode = nullptr
  rearNode  = nullptr

After frontNode = rearNode = newNode:
  frontNode ──┐
              ▼
            +------+---------+
            |  10  | nullptr |
            +------+---------+
              ▲
  rearNode  ──┘
```

### Case 2: The Queue Already Has Nodes

If the queue is not empty, we attach `newNode` after the current tail (`rearNode->next = newNode`) and then move `rearNode` forward to point to `newNode` (`rearNode = newNode`):

```text
Case 2: enqueue(20) into a Non-Empty Queue [10]

Step 1: Node* newNode = new Node(20);
  frontNode / rearNode ──► [ 10 | nullptr ]      newNode ──► [ 20 | nullptr ]

Step 2: rearNode->next = newNode;
  frontNode / rearNode ──► [ 10 | next ] ──────────────────► [ 20 | nullptr ]

Step 3: rearNode = newNode;
  frontNode ─────────────► [ 10 | next ] ──────────────────► [ 20 | nullptr ]
                                                               ▲
  rearNode ────────────────────────────────────────────────────┘
```

### C++ Code for `enqueue(int value)`

```cpp
void enqueue(int value) {
    // 1. Dynamically allocate a new node on the heap
    Node* newNode = new Node(value);

    // 2. If the queue is empty, newNode is both front and rear
    if (isEmpty()) {
        frontNode = newNode;
        rearNode = newNode;
    }
    // 3. Otherwise, link newNode at the end and advance rearNode
    else {
        rearNode->next = newNode;
        rearNode = newNode;
    }

    currentSize++;
    cout << value << " enqueued into the queue." << endl;
}
```

---

## 4. Dequeue Operation & Handling an Empty Queue Transition

When `dequeue()` is called, we remove the oldest node at `frontNode` and free its heap memory using `delete`:

1. **Check for Underflow:** If `isEmpty()` is `true`, print a Queue Underflow message and return.
2. **Save the Old Front Node:** Store `Node* temp = frontNode;` so we have its address to `delete`.
3. **Advance `frontNode`:** Set `frontNode = frontNode->next;`.
4. **Critical Edge Case — What if the Queue Just Became Empty (`frontNode == nullptr`)?**
   Suppose there was only **one node** left in the queue (`frontNode` and `rearNode` both pointed to that single node).
   - When we execute `frontNode = frontNode->next`, `frontNode` becomes `nullptr`.
   - Next, we execute `delete temp;`, which destroys that node in memory.
   - **Wait! What is `rearNode` still pointing to?** `rearNode` would still hold the address of the deleted node—a dangerous **dangling pointer**!
   - Therefore, whenever `frontNode` becomes `nullptr` after advancing, we **must also set `rearNode = nullptr;`**!

```text
Dequeue Visual Trace on [10 -> 20]:

Before dequeue():
  frontNode ──► [ 10 | next ] ──► [ 20 | nullptr ] ◄── rearNode

Step 1: Node* temp = frontNode;
  temp ──────┐
             ▼
  frontNode ──► [ 10 | next ] ──► [ 20 | nullptr ] ◄── rearNode

Step 2: frontNode = frontNode->next;
  temp ───────► [ 10 | next ] ──┐
                                ▼
  frontNode ────────────────────► [ 20 | nullptr ] ◄── rearNode

Step 3: delete temp;
                (Memory Freed)
  frontNode ────────────────────► [ 20 | nullptr ] ◄── rearNode

When the LAST node [20] is dequeued:
  1. temp = frontNode ([20])
  2. frontNode = frontNode->next (becomes nullptr!)
  3. Since frontNode == nullptr, we ALSO set rearNode = nullptr!
  4. delete temp; (Both frontNode and rearNode are cleanly nullptr)
```

### C++ Code for `dequeue()`

```cpp
void dequeue() {
    if (isEmpty()) {
        cout << "Queue Underflow! Cannot dequeue from an empty queue." << endl;
        return;
    }

    Node* temp = frontNode;          // 1. Save current front node
    int removedValue = temp->data;

    frontNode = frontNode->next;     // 2. Advance frontNode to the next node

    // 3. If frontNode became nullptr, the queue is now empty -> reset rearNode too!
    if (frontNode == nullptr) {
        rearNode = nullptr;
    }

    delete temp;                     // 4. Free the old front node's heap memory
    currentSize--;
    cout << removedValue << " dequeued from the queue." << endl;
}
```

---

## 5. Memory Management and the Destructor (`~Queue`)

Because every node in our Linked-List Queue is allocated on the heap with `new`, C++ will **not** automatically free remaining nodes when a `Queue` object goes out of scope unless we write a [destructor](/posts/cpp-constructors-and-destructors/).

Inside `~Queue()`, we simply call `dequeue()` in a `while (!isEmpty())` loop so every remaining node is properly deleted:

```cpp
// Destructor: free all remaining heap nodes to prevent memory leaks
~Queue() {
    while (!isEmpty()) {
        Node* temp = frontNode;
        frontNode = frontNode->next;
        delete temp;
    }
    rearNode = nullptr;
    currentSize = 0;
}
```

---

## 6. Complete C++ Class Implementation: Queue Using Linked List

Here is the complete, self-contained C++ program implementing a `Queue` using a Singly Linked List:

```cpp
#include <iostream>

using namespace std;

// Node structure representing a single element in the linked-list queue
class Node {
public:
    int data;
    Node* next;

    Node(int value) {
        data = value;
        next = nullptr;
    }
};

// Queue class implemented using a Singly Linked List
class Queue {
private:
    Node* frontNode;
    Node* rearNode;
    int currentSize;

public:
    // Constructor: initialize an empty queue
    Queue() {
        frontNode = nullptr;
        rearNode = nullptr;
        currentSize = 0;
    }

    // Destructor: clean up all remaining nodes on the heap
    ~Queue() {
        while (!isEmpty()) {
            Node* temp = frontNode;
            frontNode = frontNode->next;
            delete temp;
        }
        rearNode = nullptr;
        currentSize = 0;
    }

    // Check if the queue is empty
    bool isEmpty() {
        return frontNode == nullptr;
    }

    // Insert a new element at the rear of the queue
    void enqueue(int value) {
        Node* newNode = new Node(value);

        if (isEmpty()) {
            frontNode = newNode;
            rearNode = newNode;
        } else {
            rearNode->next = newNode;
            rearNode = newNode;
        }

        currentSize++;
        cout << value << " enqueued into the queue." << endl;
    }

    // Remove the oldest element from the front of the queue
    void dequeue() {
        if (isEmpty()) {
            cout << "Queue Underflow! Cannot dequeue from an empty queue." << endl;
            return;
        }

        Node* temp = frontNode;
        int removedValue = temp->data;

        frontNode = frontNode->next;

        // If the last node was removed, reset rearNode to nullptr as well
        if (frontNode == nullptr) {
            rearNode = nullptr;
        }

        delete temp;
        currentSize--;
        cout << removedValue << " dequeued from the queue." << endl;
    }

    // Return the front element without removing it
    int front() {
        if (isEmpty()) {
            cout << "Queue is empty! No front element." << endl;
            return -1;
        }
        return frontNode->data;
    }

    // Return the rear element without removing it
    int rear() {
        if (isEmpty()) {
            cout << "Queue is empty! No rear element." << endl;
            return -1;
        }
        return rearNode->data;
    }

    // Return the total number of elements in the queue
    int size() {
        return currentSize;
    }

    // Print all elements from Front to Rear
    void display() {
        if (isEmpty()) {
            cout << "Queue is empty." << endl;
            return;
        }
        cout << "Queue (Front -> Rear): ";
        Node* current = frontNode;
        while (current != nullptr) {
            cout << current->data;
            if (current->next != nullptr) {
                cout << " -> ";
            }
            current = current->next;
        }
        cout << " -> nullptr" << endl;
    }
};

int main() {
    Queue q;

    // 1. Enqueue elements
    q.enqueue(10);
    q.enqueue(20);
    q.enqueue(30);

    cout << "---" << endl;
    q.display();
    cout << "Front element: " << q.front() << endl;
    cout << "Rear element: " << q.rear() << endl;
    cout << "Current size: " << q.size() << endl;

    cout << "---" << endl;

    // 2. Dequeue one element and inspect
    q.dequeue();
    q.display();
    cout << "New Front element: " << q.front() << endl;

    cout << "---" << endl;

    // 3. Dequeue remaining elements and test empty transition
    q.dequeue();
    q.dequeue();
    q.dequeue(); // Triggers Queue Underflow safely

    // 4. Enqueue again after emptying to verify frontNode/rearNode reset
    q.enqueue(99);
    q.display();

    return 0;
}
```

### Output

```text
10 enqueued into the queue.
20 enqueued into the queue.
30 enqueued into the queue.
---
Queue (Front -> Rear): 10 -> 20 -> 30 -> nullptr
Front element: 10
Rear element: 30
Current size: 3
---
10 dequeued from the queue.
Queue (Front -> Rear): 20 -> 30 -> nullptr
New Front element: 20
---
20 dequeued from the queue.
30 dequeued from the queue.
Queue Underflow! Cannot dequeue from an empty queue.
99 enqueued into the queue.
Queue (Front -> Rear): 99 -> nullptr
```

---

## 7. Complete Pointer Dry Run

Let's trace the exact state of `frontNode`, `rearNode`, and the heap chain across each step:

| Step  | Operation        | `frontNode` | `rearNode` | Linked List Chain                          | `currentSize` |
| :---: | :--------------- | :---------: | :--------: | :----------------------------------------- | :-----------: |
| **1** | `Queue q;`       |  `nullptr`  | `nullptr`  | `nullptr`                                  |      `0`      |
| **2** | `q.enqueue(10);` |   `[10]`    |   `[10]`   | `[10] -> nullptr`                          |      `1`      |
| **3** | `q.enqueue(20);` |   `[10]`    |   `[20]`   | `[10] -> [20] -> nullptr`                  |      `2`      |
| **4** | `q.enqueue(30);` |   `[10]`    |   `[30]`   | `[10] -> [20] -> [30] -> nullptr`          |      `3`      |
| **5** | `q.dequeue();`   |   `[20]`    |   `[30]`   | `[20] -> [30] -> nullptr` (`[10]` deleted) |      `2`      |
| **6** | `q.dequeue();`   |   `[30]`    |   `[30]`   | `[30] -> nullptr` (`[20]` deleted)         |      `1`      |
| **7** | `q.dequeue();`   |  `nullptr`  | `nullptr`  | `nullptr` (`[30]` deleted; both reset!)    |      `0`      |

---

## 8. Time and Space Complexity

| Operation                  | Time Complexity | Explanation                                                          |
| :------------------------- | :-------------: | :------------------------------------------------------------------- |
| **`enqueue(value)`**       |   **$O(1)$**    | Allocates one node and updates `rearNode->next` and `rearNode`.      |
| **`dequeue()`**            |   **$O(1)$**    | Advances `frontNode = frontNode->next` and frees the old front node. |
| **`front()`**              |   **$O(1)$**    | Directly reads `frontNode->data`.                                    |
| **`rear()`**               |   **$O(1)$**    | Directly reads `rearNode->data`.                                     |
| **`isEmpty()` / `size()`** |   **$O(1)$**    | Checks `frontNode == nullptr` or returns `currentSize`.              |
| **`display()`**            |   **$O(n)$**    | Walks through all $n$ nodes from `frontNode` to `nullptr`.           |

- **Space Complexity:** **$O(n)$**, where $n$ is the exact number of elements currently in the queue. Each node stores an `int` plus one `Node*` pointer.

---

## 9. Comparison: Array Queue vs. Linked-List Queue

How do you choose between an [Array-Based Queue](/posts/queue-using-array-in-cpp/) and a Linked-List Queue?

| Feature                         | Array Queue (Circular Buffer)          | Linked-List Queue                                       |
| :------------------------------ | :------------------------------------- | :------------------------------------------------------ |
| **Memory Layout**               | Contiguous block of memory             | Non-contiguous heap nodes linked by pointers            |
| **Capacity**                    | Fixed at compile time (`MAX_SIZE`)     | Dynamic (grows until system RAM is full)                |
| **Memory per Element**          | Data only (`sizeof(int)`)              | Data + `next` pointer (`sizeof(int) + sizeof(Node*)`)   |
| **Overflow Risk**               | Yes, if active items exceed `MAX_SIZE` | None (unless RAM is exhausted)                          |
| **Wasted Space**                | Unused array slots sit idle            | Zero unused capacity; frees memory on every `dequeue()` |
| **CPU Cache Locality**          | Excellent (elements sit side by side)  | Lower (nodes are scattered on the heap)                 |
| **`enqueue` / `dequeue` Speed** | $O(1)$ (fastest raw hardware speed)    | $O(1)$ (slight overhead from `new` and `delete`)        |

---

## Summary

- A Linked-List Queue uses **`frontNode` (Head)** for $O(1)$ `dequeue()` and **`rearNode` (Tail)** for $O(1)$ `enqueue()`.
- When enqueueing into an **empty queue**, both `frontNode` and `rearNode` must be set to `newNode`.
- When dequeueing the **last remaining element** (`frontNode` becomes `nullptr`), you must also set **`rearNode = nullptr`** to prevent a dangling pointer.
- Always call `delete temp` inside `dequeue()` and clean up remaining nodes inside the **`~Queue()` destructor**.

---

## Continue Learning in the Queue Series

You have now mastered every way to implement a Queue in C++! In Step 5, we will apply Queues, Breadth-First Search (BFS), and Monotonic Deques to solve the **5 most famous Queue problems in competitive programming and coding interviews**.

- **Topic Hub:** [Queue in C++: Complete Beginner-to-Advanced Guide](/topics/queue/)
- **Previous Article (Step 3):** [Queue Implementation Using Vector in C++](/posts/queue-using-vector-in-cpp/)
- **Next Article (Step 5):** [Most Famous Queue Problems in Competitive Programming](/posts/top-5-queue-problems-in-cpp/)
- **Step 6:** [Queue vs Stack in C++: Complete Comparison](/posts/queue-vs-stack-in-cpp/)

---
title: "Stack Using Linked List in C++: Dynamic Node & Pointer Implementation"
author: "Shafin Chowdhury"
pubDatetime: 2026-10-30T13:00:00+06:00
featured: false
draft: false
tags:
  - cpp
  - data-structures
  - stack
  - linked-list
  - pointers
  - dynamic-memory
description: "Learn how to implement a Stack using a singly linked list in C++ from scratch. Understand Node structs, the top pointer, dynamic memory allocation with new and delete, destructor cleanup, visual pointer diagrams, and array vs linked list trade-offs."
---

In our previous tutorial on [Stack Using Array in C++](/posts/stack-using-array-in-cpp/), we saw that a fixed-size array has a major limitation: you must guess its maximum capacity in advance. Choose too small, and your program hits **Stack Overflow**; choose too large, and you waste memory.

By implementing a Stack using a **Singly Linked List**, we completely eliminate that problem. A linked-list stack allocates memory for **one element at a time** when `push()` is called and frees that memory immediately when `pop()` is called.

In this guide, we will build a Linked-List Stack in C++ from scratch, trace every pointer movement with diagrams, and learn how to prevent memory leaks using `new`, `delete`, and a class destructor.

> **Part of the Stack Series:** This article is **Step 4** of our [Stack in C++: Complete Beginner-to-Advanced Guide](/topics/stack/).

---

## 1. Brief Introduction to Linked Lists

Unlike an array, which stores all elements in one contiguous block of memory, a **Linked List** stores elements inside independent building blocks called **Nodes** scattered across the heap.

Each node holds two things:
1. **`data`**: The actual value stored (for example, an `int`).
2. **`next`**: A [pointer](/posts/cpp-pointers/) that stores the memory address of the next node in the chain.

The last node in the chain points to `nullptr` to mark the end of the list.

```text
+------+------+     +------+------+     +------+---------+
|  30  | next | --> |  20  | next | --> |  10  | nullptr |
+------+------+     +------+------+     +------+---------+
   ^
topNode (Head of List)
```

---

## 2. Why Use a Linked List to Implement a Stack?

A Singly Linked List is a natural match for a Stack for three reasons:

1. **Truly Dynamic Size:** The stack can grow as large as your computer's available RAM allows. It never hits a fixed capacity limit and never needs to pause to copy elements into a larger array.
2. **Zero Wasted Capacity:** Memory is allocated only when an item is pushed and released the exact moment it is popped.
3. **Strict $O(1)$ Worst-Case Operations:** Inserting or removing a node at the **front (head)** of a singly linked list takes just two pointer assignments—always $O(1)$ time, regardless of whether the stack has 5 nodes or 5 million nodes.

---

## 3. Understanding Nodes and Pointers

To represent a single node in C++, we create a simple `Node` class (or `struct`):

```cpp
class Node {
public:
    int data;
    Node* next;

    Node(int value) {
        data = value;
        next = nullptr;
    }
};
```

Let's break this down:
- **`int data;`**: Stores the integer value inside the node.
- **`Node* next;`**: A pointer to another `Node`. Initially set to `nullptr` inside the constructor.
- **`Node(int value)`**: A [constructor](/posts/cpp-constructors-and-destructors/) that initializes `data` with `value` and sets `next = nullptr` whenever we create a new node.

---

## 4. How the `top` Pointer Works (Why Head = Top)

Inside our `Stack` class, we keep a pointer named `topNode` and an integer counter `currentSize`, initialized in the constructor when the stack is empty:

```cpp
class Stack {
private:
    Node* topNode;   // Points to the Head (topmost node) of the linked list
    int currentSize; // Tracks the total number of elements

public:
    // Constructor: initialize an empty stack
    Stack() {
        topNode = nullptr; // nullptr indicates the stack is empty
        currentSize = 0;
    }

    // Check if the stack is empty
    bool isEmpty() {
        if (topNode == nullptr) {
            return true;
        } else {
            return false;
        }
    }
};
```

Here is the most important design decision when building a Stack with a Singly Linked List:

**Should the `top` of our Stack be at the Front (Head) or the Back (Tail) of the linked list?**

- If we put `top` at the **Tail (end)** of a singly linked list, removing the last node requires walking all the way from the first node to the second-to-last node, which takes slow **$O(n)$ time**.
- If we put `top` at the **Head (front)** of the singly linked list, both inserting a new node before the head and removing the current head node take **$O(1)$ constant time**!

Therefore, in a linked-list Stack:
- Our stack's `topNode` pointer **always points to the Head (first node)** of the linked list.
- Each node's `next` pointer points to the **node directly underneath it** in the stack!

```text
Visualizing Linked List as a Vertical Stack:

topNode ──► +-------------+
            | data: 30    |  <-- TOP (Newest element)
            | next: ──────┼──┐
            +-------------+  │
                             ▼
            +-------------+
            | data: 20    |
            | next: ──────┼──┐
            +-------------+  │
                             ▼
            +-------------+
            | data: 10    |  <-- Bottom (Oldest element)
            | next:nullptr|
            +-------------+
```

---

## 5. Dynamic Memory Allocation (`new`), Deallocation (`delete`), and Destructor Cleanup

Because we don't know in advance how many nodes the user will push, we create nodes on the **Heap** using [dynamic memory allocation](/posts/dynamic-memory-allocation/):

### Allocating a Node on `push()` with `new`
```cpp
Node* newNode = new Node(value);
```
The `new` keyword asks the system heap for enough memory to hold one `Node`, runs the `Node(value)` constructor, and returns its memory address into the pointer `newNode`.

### Deallocating a Node on `pop()` with `delete`
Unlike Java or Python, C++ does not have automatic garbage collection for raw pointers. When we pop a node off the stack, simply moving the `topNode` pointer away is not enough—the popped node would remain stranded in RAM, causing a **memory leak**.

```cpp
Node* temp = topNode;       // 1. Save address of current top node
topNode = topNode->next;    // 2. Move topNode down to the next node
delete temp;                // 3. Free the old node's memory back to the OS
```

### Automatic Cleanup in the Destructor (`~Stack`)
What if a `Stack` object still contains nodes when `main()` finishes? We write a [destructor](/posts/cpp-constructors-and-destructors/) that pops every remaining node automatically:

```cpp
// Destructor: free all remaining nodes to prevent memory leaks
~Stack() {
    while (!isEmpty()) {
        pop();
    }
}
```

---

## 6. Implementing Each Operation with Visual Pointer Diagrams

### 1. How `push(int value)` Works Step by Step

Here is the C++ function that inserts a new element at the top (head) of our linked-list stack:

```cpp
// Insert a new element onto the top of the stack
void push(int value) {
    Node* newNode = new Node(value); // Step 1: Allocate a new node on the heap
    newNode->next = topNode;         // Step 2: Point newNode->next to old topNode
    topNode = newNode;               // Step 3: Update topNode to point to newNode
    currentSize++;
    cout << value << " pushed onto the stack." << endl;
}
```

Suppose our stack currently holds `20` on top of `10`, and we call `push(30)`. Watch how the three lines of pointer code execute:

```text
Before push(30):
topNode ──► [ 20 | next ] ──► [ 10 | nullptr ]

Step 1: Node* newNode = new Node(30);
newNode ──► [ 30 | nullptr ]
topNode ──► [ 20 | next ] ──► [ 10 | nullptr ]

Step 2: newNode->next = topNode;
newNode ──► [ 30 | next ] ──┐
                            ▼
topNode ────────────────► [ 20 | next ] ──► [ 10 | nullptr ]

Step 3: topNode = newNode;
topNode ──► [ 30 | next ] ──► [ 20 | next ] ──► [ 10 | nullptr ]
```

### 2. How `pop()` Works Step by Step

Here is the C++ function that removes the top node and frees its heap memory:

```cpp
// Remove the top element from the stack
void pop() {
    if (isEmpty()) {
        cout << "Stack Underflow! Cannot pop from an empty stack." << endl;
        return;
    }
    Node* temp = topNode;            // Step 1: Save current topNode in temp
    int removedValue = temp->data;
    topNode = topNode->next;         // Step 2: Advance topNode to the next node
    delete temp;                     // Step 3: Free the old top node from memory
    currentSize--;
    cout << removedValue << " popped from the stack." << endl;
}
```

Now suppose we call `pop()` on the stack `[30 -> 20 -> 10]`:

```text
Before pop():
topNode ──► [ 30 | next ] ──► [ 20 | next ] ──► [ 10 | nullptr ]

Step 1: Node* temp = topNode;
temp ─────┐
          ▼
topNode ──► [ 30 | next ] ──► [ 20 | next ] ──► [ 10 | nullptr ]

Step 2: topNode = topNode->next;
temp ─────► [ 30 | next ] ──┐
                            ▼
topNode ──────────────────► [ 20 | next ] ──► [ 10 | nullptr ]

Step 3: delete temp;
            (Memory Freed)
topNode ──────────────────► [ 20 | next ] ──► [ 10 | nullptr ]
```

### 3. What Happens When the Stack Becomes Empty?

When only one node (`[ 10 | nullptr ]`) remains in the stack and we call `pop()`:

```cpp
Node* temp = topNode;      // temp points to [ 10 | nullptr ]
topNode = topNode->next;   // topNode->next is nullptr, so topNode becomes nullptr!
delete temp;               // Frees the last node
```

- `topNode = topNode->next;` sets `topNode` equal to `nullptr` (because the last node's `next` was `nullptr`).
- `delete temp;` frees that last node.
- Now `topNode == nullptr`, so `isEmpty()` automatically returns `true`!

### 4. Inspecting `top()`, `size()`, and `display()`

Finally, here are the three read-only functions that inspect our linked-list stack:

```cpp
// Return the value of the top element without removing it
int top() {
    if (isEmpty()) {
        cout << "Stack is empty! No top element." << endl;
        return -1;
    }
    return topNode->data;
}

// Return the total number of elements in the stack
int size() {
    return currentSize;
}

// Display all elements from Top to Bottom
void display() {
    if (isEmpty()) {
        cout << "Stack is empty." << endl;
        return;
    }
    cout << "Stack elements (Top to Bottom): ";
    Node* current = topNode;
    while (current != nullptr) {
        cout << current->data << " ";
        current = current->next;
    }
    cout << endl;
}
```

- **`top()`**: Reads `topNode->data` directly in $O(1)$ time without moving `topNode`.
- **`size()`**: Returns `currentSize` in $O(1)$ time.
- **`display()`**: Creates a temporary pointer `Node* current = topNode;` and walks down the chain using `current = current->next;` until `current` reaches `nullptr`.

---

## 7. Complete C++ Implementation: Stack Using Singly Linked List

Here is the complete, compilable C++ program implementing `Node` and `Stack` using a singly linked list, including proper memory cleanup in the destructor:

```cpp
#include <iostream>

using namespace std;

// Node class representing a single element in the linked list
class Node {
public:
    int data;
    Node* next;

    Node(int value) {
        data = value;
        next = nullptr;
    }
};

// Stack class implemented using a Singly Linked List
class Stack {
private:
    Node* topNode;
    int currentSize;

public:
    // Constructor: initialize an empty stack
    Stack() {
        topNode = nullptr;
        currentSize = 0;
    }

    // Destructor: free all remaining nodes to prevent memory leaks
    ~Stack() {
        while (!isEmpty()) {
            pop();
        }
    }

    // Check if the stack is empty
    bool isEmpty() {
        if (topNode == nullptr) {
            return true;
        } else {
            return false;
        }
    }

    // Insert a new element onto the top of the stack
    void push(int value) {
        Node* newNode = new Node(value);
        newNode->next = topNode;
        topNode = newNode;
        currentSize++;
        cout << value << " pushed onto the stack." << endl;
    }

    // Remove the top element from the stack
    void pop() {
        if (isEmpty()) {
            cout << "Stack Underflow! Cannot pop from an empty stack." << endl;
            return;
        }
        Node* temp = topNode;
        int removedValue = temp->data;
        topNode = topNode->next;
        delete temp;
        currentSize--;
        cout << removedValue << " popped from the stack." << endl;
    }

    // Return the value of the top element without removing it
    int top() {
        if (isEmpty()) {
            cout << "Stack is empty! No top element." << endl;
            return -1;
        }
        return topNode->data;
    }

    // Return the total number of elements in the stack
    int size() {
        return currentSize;
    }

    // Display all elements from Top to Bottom
    void display() {
        if (isEmpty()) {
            cout << "Stack is empty." << endl;
            return;
        }
        cout << "Stack elements (Top to Bottom): ";
        Node* current = topNode;
        while (current != nullptr) {
            cout << current->data << " ";
            current = current->next;
        }
        cout << endl;
    }
};

int main() {
    Stack myStack;

    // 1. Push elements onto the linked-list stack
    myStack.push(10);
    myStack.push(20);
    myStack.push(30);

    cout << "---" << endl;
    myStack.display();
    cout << "Current Top element: " << myStack.top() << endl;
    cout << "Current Stack size: " << myStack.size() << endl;

    cout << "---" << endl;

    // 2. Pop one element and inspect the stack
    myStack.pop();
    myStack.display();
    cout << "New Top element: " << myStack.top() << endl;

    cout << "---" << endl;

    // 3. Pop remaining elements and test empty state
    myStack.pop();
    myStack.pop();
    myStack.pop(); // Tests Stack Underflow protection

    return 0;
}
```

### Output

```text
10 pushed onto the stack.
20 pushed onto the stack.
30 pushed onto the stack.
---
Stack elements (Top to Bottom): 30 20 10 
Current Top element: 30
Current Stack size: 3
---
30 popped from the stack.
Stack elements (Top to Bottom): 20 10 
New Top element: 20
---
20 popped from the stack.
10 popped from the stack.
Stack Underflow! Cannot pop from an empty stack.
```

---

## 8. Step-by-Step Function Explanation

Let's examine every function in `class Stack` line by line:

### 1. Constructor `Stack()`
Sets `topNode = nullptr` and `currentSize = 0`. A `nullptr` in `topNode` means the stack does not point to any node yet.

### 2. `isEmpty()`
Checks `if (topNode == nullptr)`. Whenever `topNode` is `nullptr`, there are zero nodes in the chain, so `isEmpty()` returns `true`.

### 3. `push(int value)`
1. `Node* newNode = new Node(value);` — Allocates a fresh node on the heap holding `value`.
2. `newNode->next = topNode;` — Connects the new node's `next` pointer to whatever node was previously at the top (even if `topNode` was `nullptr`).
3. `topNode = newNode;` — Updates `topNode` so the new node is officially the new top of the stack.
4. `currentSize++;` — Increments our element counter.

### 4. `pop()`
1. Checks `if (isEmpty())` first to prevent dereferencing a null pointer.
2. `Node* temp = topNode;` — Saves the address of the current top node so we don't lose track of it.
3. `topNode = topNode->next;` — Moves `topNode` down to the next node in the stack.
4. `delete temp;` — Releases the old top node's heap memory back to the operating system.
5. `currentSize--;` — Decrements our element counter.

### 5. `top()`
Checks `if (isEmpty())`. If not empty, returns `topNode->data`, which is the integer stored inside the topmost node.

### 6. `display()`
Creates a traversal pointer `Node* current = topNode;` and walks down the chain using `current = current->next;` until `current` hits `nullptr`, printing each node's `data` along the way.

### 7. Destructor `~Stack()`
What if a programmer pushes 100 elements onto `myStack` and then `main()` ends without popping them? The destructor `~Stack()` automatically runs when `myStack` goes out of scope and calls `pop()` in a `while (!isEmpty())` loop until every single heap-allocated `Node` is properly deleted!

---

## 9. Complete Dry Run

Let's trace the exact state of `topNode` and the linked list across a sequence of operations:

| Step | Operation | Action on Pointers | Linked List Chain (`topNode` $\rightarrow$ ...) | `currentSize` |
| :--- | :--- | :--- | :--- | :---: |
| **1** | `Stack s;` | `topNode = nullptr` | `nullptr` | `0` |
| **2** | `s.push(10);` | `newNode(10)->next = nullptr`, `topNode = newNode(10)` | `[10] -> nullptr` | `1` |
| **3** | `s.push(20);` | `newNode(20)->next = [10]`, `topNode = newNode(20)` | `[20] -> [10] -> nullptr` | `2` |
| **4** | `s.top();` | Read `topNode->data` (`20`) | `[20] -> [10] -> nullptr` | `2` |
| **5** | `s.pop();` | `temp = [20]`, `topNode = [10]`, `delete [20]` | `[10] -> nullptr` | `1` |
| **6** | `s.pop();` | `temp = [10]`, `topNode = nullptr`, `delete [10]` | `nullptr` (Empty!) | `0` |
| **7** | `s.pop();` | `topNode == nullptr` $\rightarrow$ Underflow message | `nullptr` | `0` |

---

## 10. Time and Space Complexity

| Operation | Time Complexity | Explanation |
| :--- | :--- | :--- |
| **`push(value)`** | **$O(1)$** | Allocates one node and updates two pointers at the head. Never copies existing elements. |
| **`pop()`** | **$O(1)$** | Updates `topNode = topNode->next` and frees one node. |
| **`top()`** | **$O(1)$** | Reads `topNode->data` directly. |
| **`isEmpty()`** | **$O(1)$** | Checks `topNode == nullptr`. |
| **`size()`** | **$O(1)$** | Returns the maintained `currentSize` counter. |
| **`display()`** | **$O(n)$** | Traverses all $n$ nodes from `topNode` to `nullptr`. |

- **Space Complexity:** **$O(n)$**, where $n$ is the exact number of elements currently in the stack. Note that each node uses extra bytes to store its `Node* next` pointer (typically 8 bytes on a 64-bit system).

---

## 11. Advantages and Disadvantages

### Advantages
- **No Fixed Capacity Limit:** Grows and shrinks seamlessly at runtime without ever overflowing (unless system RAM is completely exhausted).
- **No Reallocation Spikes:** Unlike `std::vector`, pushing a new element never triggers an $O(n)$ array copy. Every `push()` is strictly $O(1)$.
- **Memory Efficient for Fluctuating Sizes:** Immediately returns memory to the system when elements are popped.

### Disadvantages
- **Extra Memory Per Element:** Every single node must store an extra `next` pointer alongside its data.
- **Slower CPU Cache Performance:** Because nodes are allocated individually at different heap addresses, jumping from `current` to `current->next` can cause CPU cache misses.
- **Manual Memory Management Required:** Forgetting `delete temp;` in `pop()` or omitting the destructor causes memory leaks.

---

## 12. Comparison: Array Stack vs. Linked-List Stack

| Feature | [Stack Using Fixed Array](/posts/stack-using-array-in-cpp/) | Stack Using Linked List |
| :--- | :--- | :--- |
| **Memory Layout** | Contiguous block in memory | Scattered heap nodes connected by pointers |
| **Maximum Size** | Fixed at compile time (`MAX_SIZE`) | Dynamic (grows until RAM is full) |
| **Memory per Element** | Only the data (`sizeof(int)`) | Data + `next` pointer (`sizeof(int) + sizeof(Node*)`) |
| **Stack Overflow Risk** | High if elements exceed `MAX_SIZE` | Almost none |
| **CPU Cache Locality** | Excellent (elements sit side by side) | Lower (pointer chasing across heap) |
| **`push()` / `pop()` Speed** | $O(1)$ (fastest raw speed) | $O(1)$ (slightly slower due to `new`/`delete` calls) |

---

## 13. Frequently Asked Questions (FAQ)

### Why don't we need an `isFull()` function in a Linked-List Stack?
Because a linked list allocates nodes dynamically on the heap one by one, there is no preset size limit to fill up. Memory only runs out if the entire computer's heap is exhausted.

### What happens if I forget to write `delete temp;` inside `pop()`?
The node is detached from the stack (`topNode` moves past it), so your stack still behaves correctly, **but the detached node stays in RAM forever** until the program exits. In long-running software, this memory leak can eventually crash the system.

### Why did we keep a `currentSize` variable instead of counting nodes inside `size()`?
Counting nodes with a `while` loop inside `size()` would take $O(n)$ time. By incrementing `currentSize` in `push()` and decrementing it in `pop()`, `size()` returns the answer in $O(1)$ constant time.

---

## Summary

- A Linked-List Stack stores elements inside dynamically allocated **`Node`** objects on the heap.
- The **`topNode` pointer** always points to the **head (front)** of the singly linked list so that both `push()` and `pop()` run in $O(1)$ time.
- **`push(x)`** creates a node with `new`, sets `newNode->next = topNode`, and updates `topNode = newNode`.
- **`pop()`** saves `topNode` in `temp`, advances `topNode = topNode->next`, and frees memory with `delete temp`.
- Always include a **destructor (`~Stack()`)** to clean up any remaining nodes when the stack object is destroyed.

---

## Continue Learning in the Stack Series

Congratulations! You now know how to use `std::stack` and how to build a Stack in three different ways (Vector, Array, and Linked List). Now it is time to put your knowledge into action by solving the five most famous Stack problems asked in coding interviews and competitive programming!

- **Topic Hub:** [Stack in C++: Complete Beginner-to-Advanced Guide](/topics/stack/)
- **Previous Article (Step 3):** [Stack Using Array in C++: Fixed-Size Implementation & Dry Run](/posts/stack-using-array-in-cpp/)
- **Next Article (Step 5):** [Top 5 Famous Stack Problems in Competitive Programming](/posts/top-5-stack-problems-in-cpp/)


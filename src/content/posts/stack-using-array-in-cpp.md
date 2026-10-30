---
title: "Stack Using Array: Fixed-Size Implementation, Overflow & Dry Run"
author: "Shafin Chowdhury"
pubDatetime: 2026-10-30T12:00:00+06:00
featured: false
draft: false
tags:
  - cpp
  - data-structures
  - stack
  - arrays
  - beginners
description: "Learn how to implement a Stack using a fixed-size array in C++ without STL. Understand why top starts at -1, how push and pop work, Stack Overflow and Underflow, visual dry runs, and why pop() doesn't erase physical memory."
---

In our previous tutorial on [Stack Using Vector in C++](/posts/stack-using-vector-in-cpp/), `vector` handled all the index tracking and memory resizing for us behind the scenes.

In this guide, we will build an array-based Stack step by step, understand why the famous `topIndex = -1` initialization exists, visualize how elements move in and out of the array, and trace a complete dry run.

> **Part of the Stack Series:** This article is **Step 3** of our [Stack in C++: Complete Beginner-to-Advanced Guide](/topics/stack/).

---

## 1. Why Implement a Stack Using an Array?

Building a Stack on top of a fixed-size C++ array gives you three major benefits:

1. **You Learn the True Mechanics:** Without STL helper functions like `push_back()`, you control the exact array index where the top of the stack lives.
2. **Zero Dynamic Memory Overhead:** A fixed-size array reserves all of its memory up front. There are no slow heap allocations or resizing pauses during execution.
3. **Maximum Hardware Speed:** Array elements sit in contiguous memory slots, making array-based stacks the fastest possible implementation when the maximum number of elements is known ahead of time.

---

## 2. Understanding the `top` Variable

An array of size `5` always has 5 slots in memory (`arr[0]` through `arr[4]`), even before you put any meaningful numbers into it.

So how does our program know **how many elements are currently in the stack** and **which slot holds the newest element**?

Inside our `Stack` class, we declare the fixed-size array alongside a single integer variable—named `topIndex`—to store the **array index of the topmost element**:

```cpp
const int MAX_SIZE = 5;

class Stack {
private:
    int arr[MAX_SIZE]; // Fixed-size array that holds stack elements
    int topIndex;      // Tracks the index of the current top element
};
```

Here is how `topIndex` tracks the active stack:

- When the stack has 1 element, `topIndex` is `0` (`arr[0]`).
- When the stack has 2 elements, `topIndex` is `1` (`arr[1]`).
- When the stack has 3 elements, `topIndex` is `2` (`arr[2]`).

```text
Array Indices:     [0]     [1]     [2]     [3]     [4]
                 +-----+ +-----+ +-----+ +-----+ +-----+
Array Values:    |  10 | |  20 | |  30 | |  ?  | |  ?  |
                 +-----+ +-----+ +-----+ +-----+ +-----+
                                    ^
                                topIndex = 2
                           (3 valid elements: indices 0, 1, 2)
```

---

## 3. Why Do We Initialize `top = -1`?

When a new `Stack` object is created, its [constructor](/posts/cpp-constructors-and-destructors/) initializes `topIndex` to `-1`:

```cpp
class Stack {
private:
    int arr[MAX_SIZE];
    int topIndex;

public:
    // Constructor: initialize topIndex to -1 (empty stack)
    Stack() {
        topIndex = -1;
    }
};
```

This is one of the most common questions beginners ask: **Why do we set `topIndex = -1` when creating an empty stack, instead of `0`?**

Think about how [C++ arrays](/posts/cpp-arrays/) are indexed:

- The **first valid slot** of any C++ array is **`index 0`**.
- If we initialized `topIndex = 0`, that would mean _"there is already a valid element sitting at `arr[0]`!"_
- We wouldn't be able to tell the difference between an **empty stack** and a **stack containing 1 element at `arr[0]`**.

By initializing `topIndex = -1`:

1. `-1` is not a valid array index, so it clearly signals that **the stack is completely empty**.
2. When we push our very first element, we increment `topIndex` by `1` (`-1 + 1 = 0`), which lands right on **`index 0`**!

```text
Empty Stack (topIndex = -1):
   (-1)      [0]     [1]     [2]     [3]     [4]
    ^      +-----+ +-----+ +-----+ +-----+ +-----+
 topIndex  |     | |     | |     | |     | |     |
 (Outside) +-----+ +-----+ +-----+ +-----+ +-----+

After First push(10) -> topIndex becomes -1 + 1 = 0:
             [0]     [1]     [2]     [3]     [4]
           +-----+ +-----+ +-----+ +-----+ +-----+
           |  10 | |     | |     | |     | |     |
           +-----+ +-----+ +-----+ +-----+ +-----+
              ^
         topIndex = 0
```

---

## 4. How Insertion (`push`) Works

Here is the C++ function that inserts a new element onto the top of our array-based stack:

```cpp
// Insert an element onto the top of the stack
void push(int value) {
    if (isFull()) {
        cout << "Stack Overflow! Cannot push " << value << " because stack is full." << endl;
        return;
    }
    topIndex++;
    arr[topIndex] = value;
    cout << value << " pushed into stack at index " << topIndex << "." << endl;
}
```

Look at how `push(int value)` executes a strict **two-step sequence**:

1. **Step 1 (Check if full):** First, it calls `isFull()` to verify that `topIndex` has not already reached the last array index (`MAX_SIZE - 1`). If the array is full, it prints a **Stack Overflow** warning and exits early with `return;`.
2. **Step 2 (Increment, then store):**
   - First, move `topIndex` one slot to the right: `topIndex++;`.
   - Second, place the new value into that slot: `arr[topIndex] = value;`.

```text
Before push(25) (topIndex = 1):
Index:      [0]     [1]     [2]     [3]     [4]
          +-----+ +-----+ +-----+ +-----+ +-----+
arr:      |  10 | |  20 | |     | |     | |     |
          +-----+ +-----+ +-----+ +-----+ +-----+
                     ^
                topIndex = 1

Step A: topIndex++ (topIndex becomes 2)
Step B: arr[2] = 25

After push(25) (topIndex = 2):
Index:      [0]     [1]     [2]     [3]     [4]
          +-----+ +-----+ +-----+ +-----+ +-----+
arr:      |  10 | |  20 | |  25 | |     | |     |
          +-----+ +-----+ +-----+ +-----+ +-----+
                             ^
                        topIndex = 2
```

---

## 5. How Deletion (`pop`) Works

Here is the C++ function that removes the top element from our array-based stack:

```cpp
// Remove the top element from the stack
void pop() {
    if (isEmpty()) {
        cout << "Stack Underflow! Cannot pop from an empty stack." << endl;
        return;
    }
    int removedValue = arr[topIndex];
    topIndex--;
    cout << removedValue << " popped from stack." << endl;
}
```

Removing the top element follows two simple steps:

1. **Step 1 (Check if empty):** Calls `isEmpty()` to verify that `topIndex` is not `-1`. If the stack is empty, it prints a **Stack Underflow** message and returns immediately.
2. **Step 2 (Read and Decrement `topIndex`):**
   - Saves `arr[topIndex]` into `removedValue` so we can print which number was removed.
   - Moves `topIndex` one slot to the left using `topIndex--;`.

```text
Before pop() (topIndex = 2):
Index:      [0]     [1]     [2]     [3]     [4]
          +-----+ +-----+ +-----+ +-----+ +-----+
arr:      |  10 | |  20 | |  25 | |     | |     |
          +-----+ +-----+ +-----+ +-----+ +-----+
                             ^
                        topIndex = 2

After pop() -> topIndex-- (topIndex becomes 1):
Index:      [0]     [1]     [2]     [3]     [4]
          +-----+ +-----+ +-----+ +-----+ +-----+
arr:      |  10 | |  20 | |(25) | |     | |     |
          +-----+ +-----+ +-----+ +-----+ +-----+
                     ^       ^
                topIndex = 1 (Ignored / out of bounds of active stack)
```

---

## 6. Why `pop()` Does Not Physically Delete the Array Element

Look closely at slot `[2]` in the diagram above after `pop()`. The number `25` is still physically sitting in RAM at `arr[2]`! Why didn't we write `arr[topIndex] = 0;` inside `pop()`?

```cpp
// Inside pop():
int removedValue = arr[topIndex];
topIndex--; // We only move the index! We do NOT need arr[topIndex + 1] = 0;
```

Because **`topIndex` defines the boundary of our stack**:

- Any slot at an index greater than `topIndex` is considered **outside the stack** ("inactive memory").
- `top()` only reads `arr[topIndex]` (`arr[1]`).
- `display()` only loops from `topIndex` down to `0`.
- The very next time you call `push(99)`, `topIndex` increments back to `2` and **overwrites** `arr[2]` with `99`:
  ```cpp
  topIndex++;          // topIndex moves from 1 back to 2
  arr[topIndex] = 99;  // Overwrites the old 25 at arr[2] with 99!
  ```

Skipping an unnecessary write like `arr[topIndex] = 0` saves CPU work while keeping the stack 100% logically accurate.

---

## 7. Stack Overflow (`isFull`) and Stack Underflow (`isEmpty`)

When working with a fixed-size array of size `MAX_SIZE` (whose valid indices are `0` to `MAX_SIZE - 1`), two boundary errors can occur. We write two dedicated helper functions—`isFull()` and `isEmpty()`—to guard against them:

### 1. Stack Overflow (Pushing into a Full Stack)

```cpp
// Check if the stack has reached its maximum capacity
bool isFull() {
    if (topIndex == MAX_SIZE - 1) {
        return true;
    } else {
        return false;
    }
}
```

When `topIndex == MAX_SIZE - 1`, every single slot in the array is occupied. If you try to `push()` another item without checking `isFull()`, `topIndex` becomes `MAX_SIZE`, and `arr[topIndex]` writes into illegal memory outside the array!

### 2. Stack Underflow (Popping from an Empty Stack)

```cpp
// Check if the stack is completely empty
bool isEmpty() {
    if (topIndex == -1) {
        return true;
    } else {
        return false;
    }
}
```

When `topIndex == -1`, there are zero elements in the stack. If you try to `pop()` or read `arr[topIndex]` without checking `isEmpty()`, your program will attempt to access `arr[-1]`, which is invalid memory!

```text
  topIndex == -1                             topIndex == MAX_SIZE - 1
 (STACK UNDERFLOW                            (STACK OVERFLOW
  isEmpty() is true)                          isFull() is true)
        |                                            |
        v                                            v
      (-1)      [0]     [1]     [2]     [3]     [4] (MAX_SIZE = 5)
              +-----+ +-----+ +-----+ +-----+ +-----+
              |  10 | |  20 | |  30 | |  40 | |  50 |
              +-----+ +-----+ +-----+ +-----+ +-----+
```

---

## 8. Inspecting the Top (`top`), `size()`, and `display()`

To complete our `Stack` toolkit, we need three read-only functions that inspect the stack without modifying it:

### 1. `top()` — Peeking at the Top Element

```cpp
// Return the top element without removing it
int top() {
    if (isEmpty()) {
        cout << "Stack is empty! No top element." << endl;
        return -1;
    }
    return arr[topIndex];
}
```
First checks `isEmpty()`. If the stack is not empty, it directly returns the value sitting at `arr[topIndex]` without changing `topIndex`.

### 2. `size()` — Counting Active Elements

```cpp
// Return current number of elements in the stack
int size() {
    return topIndex + 1;
}
```
Because C++ array indices start at `0`, the number of elements in the stack is always `topIndex + 1`. (When empty, `-1 + 1 = 0`; when `topIndex` is `2`, `2 + 1 = 3` elements.)

### 3. `display()` — Printing from Top to Bottom

```cpp
// Print all elements currently in the stack from top to bottom
void display() {
    if (isEmpty()) {
        cout << "Stack is empty." << endl;
        return;
    }
    cout << "Stack elements (Top to Bottom): ";
    for (int i = topIndex; i >= 0; i--) {
        cout << arr[i] << " ";
    }
    cout << endl;
}
```
Starts a loop variable `i` at `topIndex` (the newest element) and counts **downward** to `0` (the oldest element at the bottom), printing only the active stack elements.

---

## 9. Complete C++ Implementation: Stack Using a Fixed-Size Array

Below is the complete, beginner-friendly C++ implementation of a `Stack` class using a fixed-size array of capacity `5`. No STL containers are used.

```cpp
#include <iostream>

using namespace std;

const int MAX_SIZE = 5;

class Stack {
private:
    int arr[MAX_SIZE];
    int topIndex;

public:
    // Constructor: initialize topIndex to -1 (empty stack)
    Stack() {
        topIndex = -1;
    }

    // Check if the stack is completely empty
    bool isEmpty() {
        if (topIndex == -1) {
            return true;
        } else {
            return false;
        }
    }

    // Check if the stack has reached its maximum capacity
    bool isFull() {
        if (topIndex == MAX_SIZE - 1) {
            return true;
        } else {
            return false;
        }
    }

    // Insert an element onto the top of the stack
    void push(int value) {
        if (isFull()) {
            cout << "Stack Overflow! Cannot push " << value << " because stack is full." << endl;
            return;
        }
        topIndex++;
        arr[topIndex] = value;
        cout << value << " pushed into stack at index " << topIndex << "." << endl;
    }

    // Remove the top element from the stack
    void pop() {
        if (isEmpty()) {
            cout << "Stack Underflow! Cannot pop from an empty stack." << endl;
            return;
        }
        int removedValue = arr[topIndex];
        topIndex--;
        cout << removedValue << " popped from stack." << endl;
    }

    // Return the top element without removing it
    int top() {
        if (isEmpty()) {
            cout << "Stack is empty! No top element." << endl;
            return -1;
        }
        return arr[topIndex];
    }

    // Return current number of elements in the stack
    int size() {
        return topIndex + 1;
    }

    // Print all elements currently in the stack from top to bottom
    void display() {
        if (isEmpty()) {
            cout << "Stack is empty." << endl;
            return;
        }
        cout << "Stack elements (Top to Bottom): ";
        for (int i = topIndex; i >= 0; i--) {
            cout << arr[i] << " ";
        }
        cout << endl;
    }
};

int main() {
    Stack myStack;

    // 1. Test pushing elements up to capacity (MAX_SIZE = 5)
    myStack.push(10);
    myStack.push(20);
    myStack.push(30);
    myStack.push(40);
    myStack.push(50);

    // 2. Try pushing a 6th element to trigger Stack Overflow
    myStack.push(60);

    cout << "---" << endl;
    myStack.display();
    cout << "Current Top element: " << myStack.top() << endl;
    cout << "Current Stack size: " << myStack.size() << endl;

    cout << "---" << endl;

    // 3. Pop two elements and check the updated state
    myStack.pop();
    myStack.pop();
    myStack.display();
    cout << "New Top element: " << myStack.top() << endl;

    return 0;
}
```

### Output

```text
10 pushed into stack at index 0.
20 pushed into stack at index 1.
30 pushed into stack at index 2.
40 pushed into stack at index 3.
50 pushed into stack at index 4.
Stack Overflow! Cannot push 60 because stack is full.
---
Stack elements (Top to Bottom): 50 40 30 20 10
Current Top element: 50
Current Stack size: 5
---
50 popped from stack.
40 popped from stack.
Stack elements (Top to Bottom): 30 20 10
New Top element: 30
```

---

## 10. Quick Reference Summary of Member Functions

Let's review how all the member functions inside `class Stack` fit together:

1. **`Stack()` ([Constructor](/posts/cpp-constructors-and-destructors/)):** Runs automatically when `Stack myStack;` is created. It sets `topIndex = -1` so the stack starts empty.
2. **`isEmpty()`:** Compares `topIndex` with `-1`. If `topIndex == -1`, no elements are in the stack, so it returns `true`.
3. **`isFull()`:** Compares `topIndex` with `MAX_SIZE - 1` (`4` when `MAX_SIZE` is `5`). If `topIndex == 4`, all 5 slots (`0` through `4`) are full, so it returns `true`.
4. **`push(int value)`:** First calls `isFull()`. If there is room, it increments `topIndex` by 1 and stores `value` at `arr[topIndex]`.
5. **`pop()`:** First calls `isEmpty()`. If there is at least one element, it reads `arr[topIndex]` (for the confirmation message) and decrements `topIndex` by 1.
6. **`top()`:** Checks `isEmpty()`. If not empty, it returns `arr[topIndex]` without changing `topIndex`.
7. **`size()`:** Since array indices start at `0`, the number of active elements is always `topIndex + 1` (for example, when `topIndex` is `-1`, size is `0`; when `topIndex` is `2`, size is `3`).
8. **`display()`:** Loops backwards using index `i` starting from `topIndex` down to `0`, printing each active element from Top to Bottom.

---

## 11. Complete Dry Run

Let's trace a smaller sequence of operations step by step on a stack with `MAX_SIZE = 3`:

| Step  | Operation Called | `topIndex` Before | Action Taken                                             | `topIndex` After | Active Stack (`0` .. `topIndex`) | Output / Return        |
| :---- | :--------------- | :---------------: | :------------------------------------------------------- | :--------------: | :------------------------------- | :--------------------- |
| **1** | `Stack s;`       |         —         | Initialize `topIndex = -1`                               |       `-1`       | `[ ]` (Empty)                    | —                      |
| **2** | `s.push(5);`     |       `-1`        | `topIndex++` $\rightarrow$ `0`; `arr[0] = 5`             |       `0`        | `[5]`                            | `5 pushed at index 0`  |
| **3** | `s.push(15);`    |        `0`        | `topIndex++` $\rightarrow$ `1`; `arr[1] = 15`            |       `1`        | `[5, 15]`                        | `15 pushed at index 1` |
| **4** | `s.top();`       |        `1`        | Return `arr[1]`                                          |       `1`        | `[5, 15]`                        | Returns `15`           |
| **5** | `s.pop();`       |        `1`        | Read `arr[1]`, then `topIndex--` $\rightarrow$ `0`       |       `0`        | `[5]`                            | `15 popped`            |
| **6** | `s.push(25);`    |        `0`        | `topIndex++` $\rightarrow$ `1`; overwrites `arr[1] = 25` |       `1`        | `[5, 25]`                        | `25 pushed at index 1` |
| **7** | `s.pop();`       |        `1`        | `topIndex--` $\rightarrow$ `0`                           |       `0`        | `[5]`                            | `25 popped`            |
| **8** | `s.pop();`       |        `0`        | `topIndex--` $\rightarrow$ `-1`                          |       `-1`       | `[ ]` (Empty)                    | `5 popped`             |
| **9** | `s.pop();`       |       `-1`        | `isEmpty()` is `true`!                                   |       `-1`       | `[ ]` (Empty)                    | `Stack Underflow!`     |

---

## 12. Time and Space Complexity

Because an array allows direct $O(1)$ access to any index, and we never shift elements, every core stack operation runs in constant time:

| Operation         | Time Complexity | Explanation                                                    |
| :---------------- | :-------------- | :------------------------------------------------------------- |
| **`push(value)`** | **$O(1)$**      | Increments `topIndex` and assigns `arr[topIndex]` in one step. |
| **`pop()`**       | **$O(1)$**      | Decrements `topIndex` in one step.                             |
| **`top()`**       | **$O(1)$**      | Reads `arr[topIndex]` directly.                                |
| **`isEmpty()`**   | **$O(1)$**      | Single integer comparison (`topIndex == -1`).                  |
| **`isFull()`**    | **$O(1)$**      | Single integer comparison (`topIndex == MAX_SIZE - 1`).        |
| **`display()`**   | **$O(n)$**      | Prints all $n$ active elements from `topIndex` down to `0`.    |

- **Space Complexity:** **$O(\text{MAX\_SIZE})$** (or $O(n)$ where $n$ is the fixed capacity of the array), because all `MAX_SIZE` array slots are reserved in memory as soon as the `Stack` object is created.

---

## 13. Advantages, Disadvantages, and Limitations

### Advantages

- **Simple to Implement:** Requires no pointers or manual `new`/`delete` memory management.
- **Fastest Execution Speed:** Zero heap allocation overhead and optimal CPU cache locality.
- **Predictable Memory Footprint:** Memory usage is fixed and known at compile time.

### Disadvantages & Limitations of Fixed-Size Arrays

1. **Fixed Capacity (Risk of Stack Overflow):** You must guess `MAX_SIZE` before the program runs. If your program suddenly needs `MAX_SIZE + 1` elements, the stack fails with Stack Overflow.
2. **Wasted Memory:** If you set `MAX_SIZE = 10000` to be "safe," but your program only pushes 10 elements at a time, `9,990` integer slots sit completely wasted in memory.

How can we get a Stack that grows dynamically one element at a time without ever wasting unused array slots or hitting a fixed limit? The answer is a **Linked List**—which we will build in the next article!

---

## 14. Frequently Asked Questions (FAQ)

### Why is the full condition `topIndex == MAX_SIZE - 1` instead of `topIndex == MAX_SIZE`?

Because C++ arrays use **0-based indexing**. An array of size `5` has indices `0, 1, 2, 3, 4`. The last valid index is `5 - 1 = 4`. When `topIndex` reaches `4`, all 5 slots are full.

### How can I find the current number of elements in an array-based stack?

The number of elements is always `topIndex + 1`. When the stack is empty (`topIndex = -1`), `-1 + 1 = 0`. When `arr[0]` through `arr[3]` are filled (`topIndex = 3`), `3 + 1 = 4` elements.

### Can we implement two stacks inside a single array?

Yes! This is a classic interview problem: start `Stack 1` at the left end (`top1 = -1`, growing rightward) and `Stack 2` at the right end (`top2 = MAX_SIZE`, growing leftward). Both stacks can grow freely until `top1 + 1 == top2`.

---

## Summary

- An array-based Stack uses an integer `topIndex` to track the index of the newest element.
- `topIndex` starts at **`-1`** to indicate an empty stack.
- **`push(x)`** checks `isFull()`, increments `topIndex`, and sets `arr[topIndex] = x`.
- **`pop()`** checks `isEmpty()` and decrements `topIndex` (leaving the old value in memory to be overwritten later).
- **`isFull()`** is true when `topIndex == MAX_SIZE - 1`; **`isEmpty()`** is true when `topIndex == -1`.

---

## Continue Learning in the Stack Series

Ready to remove the fixed-size limitation and learn how pointer-based stacks work? Move on to Step 4!

- **Topic Hub:** [Stack in C++: Complete Beginner-to-Advanced Guide](/topics/stack/)
- **Previous Article (Step 2):** [Stack Using Vector in C++: Step-by-Step Implementation](/posts/stack-using-vector-in-cpp/)
- **Next Article (Step 4):** [Stack Using Linked List in C++: Dynamic Node Implementation](/posts/stack-using-linked-list-in-cpp/)
- **Step 5:** [Top 5 Famous Stack Problems in Competitive Programming](/posts/top-5-stack-problems-in-cpp/)

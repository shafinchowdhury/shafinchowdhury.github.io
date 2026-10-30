---
title: "Stack Using Vector in C++: Step-by-Step Class Implementation"
author: "Shafin Chowdhury"
pubDatetime: 2026-10-30T11:00:00+06:00
featured: false
draft: false
tags:
  - cpp
  - data-structures
  - stack
  - vector
  - stl
description: "Learn how to implement a Stack using std::vector in C++. Includes visual diagrams, step-by-step explanations of push_back, pop_back, and back, a complete C++ class implementation, and complexity analysis."
---

In this tutorial, you will learn how a C++ `vector` works under the hood, why its back end maps naturally to the **Top** of a Stack, and how to write a complete, reusable `Stack` class using `vector`.

> **Part of the Stack Series:** This article is **Step 2** of our [Stack in C++: Complete Beginner-to-Advanced Guide](/topics/stack/).

---

## 1. What Is a Vector in C++?

A `vector` (available in the `<vector>` header) is a **dynamic array** provided by the C++ Standard Template Library (STL):

```cpp
#include <vector>

class Stack {
private:
    vector<int> elements; // Dynamic array that grows and shrinks automatically
};
```

Like a normal [C++ array](/posts/cpp-arrays/), a `vector` stores elements side by side in contiguous memory and lets you access any element by index (`elements[0]`, `elements[1]`, etc.). However, unlike a fixed-size array whose size must be locked in at compile time, a `vector` **automatically grows and shrinks at runtime** as you add or remove elements.

---

## 2. Why Can We Use a Vector to Implement a Stack?

Recall what a Stack requires:
- We must insert new elements at one end (**Top**).
- We must remove elements from that same end (**Top**).
- We must inspect the newest element at that end (**Top**).

A `vector` already provides three built-in $O(1)$ operations at its **back end** (the highest index):

```cpp
elements.push_back(40);      // 1. Insert 40 at the back (Top of Stack)
int topVal = elements.back();// 2. Read the back element (40) without removing it
elements.pop_back();         // 3. Remove the back element (40)
```

By treating the **back of the vector** (`index = size - 1`) as the **Top of our Stack**, every Stack operation maps directly to a built-in `vector` function!

```text
Vector Indices:     [0]     [1]     [2]     [3]
                  +-----+ +-----+ +-----+ +-----+
Vector Elements:  |  10 | |  20 | |  30 | |  40 | <-- Back of Vector = TOP of Stack
                  +-----+ +-----+ +-----+ +-----+
                     ^                       ^
                   Bottom                   TOP
                (First In)               (Last In)
```

> **Why not use the front (`index 0`) as the Top?**
> If you insert or delete at `index 0` of a vector, every other element must shift one slot to the right or left, which takes slow $O(n)$ time. Operating at the **back** requires zero shifting!

---

## 3. Mapping Stack Operations to Vector Functions

Before writing the class, let's see how each Stack operation translates into a `std::vector` member function:

| Stack Operation | Vector Function Used | What It Does |
| :--- | :--- | :--- |
| **`push(value)`** | `elements.push_back(value)` | Appends `value` to the end of the vector. |
| **`pop()`** | `elements.pop_back()` | Removes the last element from the vector (does **not** return it). |
| **`top()`** | `elements.back()` | Returns the last element in the vector without removing it. |
| **`empty()`** | `elements.empty()` | Returns `true` if the vector has 0 elements, otherwise `false`. |
| **`size()`** | `elements.size()` | Returns the total number of elements currently in the vector. |

---

## 4. Implementing Each Operation Step by Step (With Visual Traces)

Let's examine each operation individually alongside its C++ code and visual memory trace. Assume our `Stack` class has the private member variable:

```cpp
vector<int> elements;
```

### 1. `push(int value)` — Inserting an Element

```cpp
// Push an element onto the top of the stack
void push(int value) {
    elements.push_back(value);
    cout << value << " pushed onto the stack." << endl;
}
```

- **`elements.push_back(value);`**: Places `value` at the very end of the vector. Since the end of the vector represents the **Top** of our stack, `value` becomes the new top element.

Here is the visual trace when we call `push(10)`, `push(20)`, and `push(30)` on an empty stack:

```text
1. Initial State (empty):
   elements: [ ]
   size = 0

2. After push(10) -> elements.push_back(10):
   Index:     0
            +----+
   elements:| 10 |
            +----+
              ^
             TOP (elements.back() == 10)

3. After push(20) -> elements.push_back(20):
   Index:     0    1
            +----+----+
   elements:| 10 | 20 |
            +----+----+
                   ^
                  TOP (elements.back() == 20)

4. After push(30) -> elements.push_back(30):
   Index:     0    1    2
            +----+----+----+
   elements:| 10 | 20 | 30 |
            +----+----+----+
                        ^
                       TOP (elements.back() == 30)
```

### 2. `pop()` — Removing the Top Element

```cpp
// Remove the top element from the stack
void pop() {
    if (elements.empty()) {
        cout << "Stack Underflow! Cannot pop from an empty stack." << endl;
        return;
    }
    int removedValue = elements.back();
    elements.pop_back();
    cout << removedValue << " popped from the stack." << endl;
}
```

- **`if (elements.empty())`**: Always check whether the stack is empty before removing anything. Calling `pop_back()` on an empty vector causes undefined behavior (a crash).
- **`int removedValue = elements.back();`**: **Important detail:** `elements.pop_back()` removes the last element from the vector, **but its return type is `void`—it does not return the removed value!** If we want to print or use the value being removed, we must first read it using `elements.back()`.
- **`elements.pop_back();`**: Shrinks the vector's size by `1`, effectively removing the top element.

Here is the visual trace when we call `pop()` on `[10, 20, 30]`:

```text
Before pop():
   Index:     0    1    2
            +----+----+----+
   elements:| 10 | 20 | 30 |
            +----+----+----+
                        ^
                       TOP (size = 3)

After pop() -> elements.pop_back():
   Index:     0    1
            +----+----+
   elements:| 10 | 20 |        (30 is removed from the back)
            +----+----+
                   ^
                  TOP (elements.back() == 20, size = 2)
```

### 3. `top()` — Reading the Top Element

```cpp
// Return the top element without removing it
int top() {
    if (elements.empty()) {
        cout << "Stack is empty! No top element exists." << endl;
        return -1;
    }
    return elements.back();
}
```

- **`elements.back()`**: Accesses and returns the last element of the vector (at index `elements.size() - 1`) without deleting it.
- If the stack is empty, we print a clear warning message and return `-1` as a sentinel value.

### 4. `empty()` — Checking if the Stack Is Empty

```cpp
// Check if the stack is empty
bool empty() {
    return elements.empty();
}
```

- **`elements.empty()`**: Returns `true` when the vector contains zero elements, and `false` otherwise.

### 5. `size()` — Counting the Elements

```cpp
// Return the number of elements in the stack
int size() {
    return elements.size();
}
```

- **`elements.size()`**: Returns the current number of elements stored in the vector.

### 6. `display()` — Printing from Top to Bottom

```cpp
// Display all elements from top to bottom
void display() {
    if (elements.empty()) {
        cout << "Stack is empty." << endl;
        return;
    }
    cout << "Stack elements (Top to Bottom): ";
    for (int i = elements.size() - 1; i >= 0; i--) {
        cout << elements[i] << " ";
    }
    cout << endl;
}
```

- Because the newest element is at `elements.size() - 1` and the oldest element is at `index 0`, looping `i` **backwards** from `elements.size() - 1` down to `0` prints the stack from **Top to Bottom**.

---

## 5. Complete Class-Based Implementation in C++

Here is the complete, compilable C++ program implementing a `Stack` class using `std::vector`, along with a `main()` function that tests every operation:

```cpp
#include <iostream>
#include <vector>

using namespace std;

class Stack {
private:
    vector<int> elements;

public:
    // Push an element onto the top of the stack
    void push(int value) {
        elements.push_back(value);
        cout << value << " pushed onto the stack." << endl;
    }

    // Remove the top element from the stack
    void pop() {
        if (elements.empty()) {
            cout << "Stack Underflow! Cannot pop from an empty stack." << endl;
            return;
        }
        int removedValue = elements.back();
        elements.pop_back();
        cout << removedValue << " popped from the stack." << endl;
    }

    // Return the top element without removing it
    int top() {
        if (elements.empty()) {
            cout << "Stack is empty! No top element." << endl;
            return -1;
        }
        return elements.back();
    }

    // Check if the stack is empty
    bool empty() {
        return elements.empty();
    }

    // Return the number of elements in the stack
    int size() {
        return elements.size();
    }

    // Display all elements from top to bottom
    void display() {
        if (elements.empty()) {
            cout << "Stack is empty." << endl;
            return;
        }
        cout << "Stack elements (Top to Bottom): ";
        for (int i = elements.size() - 1; i >= 0; i--) {
            cout << elements[i] << " ";
        }
        cout << endl;
    }
};

int main() {
    Stack myStack;

    // Push elements
    myStack.push(10);
    myStack.push(20);
    myStack.push(30);

    // Display current state
    myStack.display();
    cout << "Current Top element: " << myStack.top() << endl;
    cout << "Current Stack size: " << myStack.size() << endl;

    cout << "---" << endl;

    // Pop elements
    myStack.pop();
    cout << "Top element after one pop: " << myStack.top() << endl;
    myStack.display();

    cout << "---" << endl;

    // Pop remaining elements and test underflow protection
    myStack.pop();
    myStack.pop();
    myStack.pop(); // Attempting to pop from an empty stack

    if (myStack.empty()) {
        cout << "Confirmed: Stack is now empty." << endl;
    }

    return 0;
}
```

### Output

```text
10 pushed onto the stack.
20 pushed onto the stack.
30 pushed onto the stack.
Stack elements (Top to Bottom): 30 20 10 
Current Top element: 30
Current Stack size: 3
---
30 popped from the stack.
Top element after one pop: 20
Stack elements (Top to Bottom): 20 10 
---
20 popped from the stack.
10 popped from the stack.
Stack Underflow! Cannot pop from an empty stack.
Confirmed: Stack is now empty.
```

### How the `display()` Function Works
Look closely at the `for` loop inside `display()`:
```cpp
for (int i = elements.size() - 1; i >= 0; i--)
```
Because the newest element is at the end of the vector (`elements.size() - 1`) and the oldest element is at `index 0`, counting **backwards** from `elements.size() - 1` down to `0` prints the stack from **Top to Bottom**.

---

## 6. STL `std::stack` vs. Manually Implemented Vector Stack

You might wonder: *"If `std::stack` already exists in STL, why build a Stack with `std::vector`?"*

| Feature | STL `std::stack<T>` | Manual Vector-Based `Stack` |
| :--- | :--- | :--- |
| **Default Underlying Container** | `std::deque<T>` (can also be configured as `std::stack<int, vector<int>>`) | `std::vector<T>` |
| **Inspecting All Elements (`display`)** | Not allowed (strictly hides everything except `.top()`) | Easy! You can loop through the internal `vector` for debugging or printing. |
| **Underflow Safety** | Calling `.pop()` on an empty `std::stack` crashes with undefined behavior. | You can add beginner-friendly `if (empty())` checks and error messages. |
| **Memory Layout** | Chunked blocks (`deque`) by default | Single contiguous block of memory (great CPU cache locality). |

In fact, you can even tell `std::stack` to use `std::vector` internally by writing:
```cpp
stack<int, vector<int>> customStlStack;
```
Building the class yourself removes the magic and proves that a container adapter is simply a clean wrapper around an existing data structure!

---

## 7. Time and Space Complexity

| Operation | Time Complexity | Explanation |
| :--- | :--- | :--- |
| **`push(val)`** | **$O(1)$ Amortized** | Instantaneous almost every time. Occasionally takes $O(n)$ when the vector resizes, averaging out to $O(1)$ per insertion. |
| **`pop()`** | **$O(1)$** | Decrements the internal vector size by 1 without moving any other elements. |
| **`top()`** | **$O(1)$** | Directly reads `elements[size - 1]`. |
| **`empty()`** | **$O(1)$** | Checks whether `size == 0`. |
| **`size()`** | **$O(1)$** | Returns the vector's stored size counter. |

- **Space Complexity:** **$O(n)$**, where $n$ is the number of elements in the stack.

---

## 8. Advantages and Disadvantages

### Advantages
- **No Fixed Size Limit:** Unlike a fixed-size array, a vector grows automatically as long as RAM is available.
- **Automatic Memory Management:** You do not need to write `new` or `delete`—`std::vector` cleans up its own heap memory automatically when the `Stack` object goes out of scope (following [RAII principles](/posts/cpp-constructors-and-destructors/)).
- **Cache-Friendly Performance:** Because all elements sit next to each other in contiguous memory, the CPU cache reads them much faster than scattered linked-list nodes.

### Disadvantages
- **Occasional Reallocation Pause:** When the vector needs more space, allocating a larger block and copying elements causes a brief $O(n)$ pause.
- **Unused Capacity Overhead:** Reserved capacity may briefly exceed the exact number of elements currently stored.

---

## 9. Frequently Asked Questions (FAQ)

### What is the difference between `vector::back()` and `vector::pop_back()`?
`vector::back()` **returns** a reference to the last element without removing it (equivalent to `top()`). `vector::pop_back()` **removes** the last element from the vector and returns `void` (nothing).

### Does `elements.pop_back()` shrink the vector's allocated memory capacity?
No. Calling `pop_back()` reduces the vector's `size` by 1, but its `capacity` stays the same so future `push_back()` calls can reuse that memory without reallocating.

### Why is `push_back()` called "amortized" $O(1)$?
Suppose you push $1{,}000$ items. Almost all pushes take 1 step, while resizing happens only at powers of two ($1, 2, 4, 8, 16, \dots, 512$). The total work across $n$ pushes is roughly $2n$ operations, which averages out to a constant $O(1)$ cost per push.

---

## Summary

- A `std::vector` makes it easy to implement a dynamic Stack in C++.
- The **back of the vector** acts as the **Top of the stack**.
- Use `push_back(x)` for `push(x)`, `pop_back()` for `pop()`, and `back()` for `top()`.
- Remember that `pop_back()` does **not** return the removed element—use `back()` first if you need its value.
- All core stack operations run in $O(1)$ time (amortized for `push`).

---

## Continue Learning in the Stack Series

Now that you know how to build a Stack using `std::vector`, what if you are in a university exam or embedded environment where STL containers like `vector` are not allowed? Next, we will build a Stack from raw memory using a fixed-size C++ array!

- **Topic Hub:** [Stack in C++: Complete Beginner-to-Advanced Guide](/topics/stack/)
- **Previous Article (Step 1):** [Understanding Stack in C++: Complete Beginner's Guide](/posts/understanding-stack-in-cpp/)
- **Next Article (Step 3):** [Stack Using Array in C++: Fixed-Size Implementation & Dry Run](/posts/stack-using-array-in-cpp/)
- **Step 4:** [Stack Using Linked List in C++: Dynamic Node Implementation](/posts/stack-using-linked-list-in-cpp/)
- **Step 5:** [Top 5 Famous Stack Problems in Competitive Programming](/posts/top-5-stack-problems-in-cpp/)


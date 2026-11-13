---
title: "Queue Implementation Using Vector in C++: Operations & O(n) Erase Analysis"
author: "Shafin Chowdhury"
pubDatetime: 2026-11-13T12:00:00+06:00
featured: false
draft: false
tags:
  - cpp
  - data-structures
  - queue
  - vector
  - stl
description: "Learn how to implement a Queue using std::vector in C++. Build a custom Queue class with push_back(), erase(), and front(), understand why vector.erase(vector.begin()) takes O(n) time, and learn O(1) alternative strategies."
---

When we built a [Stack using `std::vector`](/posts/stack-using-vector-in-cpp/), `vector` was a perfect match because both `push_back()` and `pop_back()` operate at the **back** of the vector in $O(1)$ time.

What happens when we build a **Queue using `std::vector`**? While inserting at the back (`push_back()`) is still $O(1)$, removing from the front of a `std::vector` reveals one of the most important performance lessons in C++ data structures.

In this guide, we will build a complete custom `Queue` class using `std::vector`, trace `push_back()`, `erase()`, and `front()` step by step, understand why `vector.erase(vector.begin())` runs in $O(n)$ time, and explore high-performance $O(1)$ alternatives.

> **Part of the Queue Series:** This article is **Step 3** of our [Queue in C++: Complete Beginner-to-Advanced Guide](/topics/queue/).

---

## 1. Using `std::vector` to Model a Queue

A `std::vector` (from `<vector>`) is a dynamic contiguous array that resizes automatically on the heap. To model a **FIFO (First-In, First-Out)** Queue inside a `std::vector<int> elements`:

- **Front of the Queue** $\rightarrow$ **Index `0`** (`elements.front()` or `elements[0]`), where the oldest element sits.
- **Rear of the Queue** $\rightarrow$ **Index `size - 1`** (`elements.back()`), where new elements are appended.

```text
Vector Indices:      [0]     [1]     [2]     [3]
                   +-----+ +-----+ +-----+ +-----+
Vector Elements:   |  10 | |  20 | |  30 | |  40 |
                   +-----+ +-----+ +-----+ +-----+
                      ^                       ^
                    FRONT                   REAR
               (dequeue here)          (enqueue here)
               elements.front()       elements.push_back()
```

---

## 2. Mapping Queue Operations to `std::vector` Functions

In a direct `std::vector` Queue implementation, each Queue operation maps to a built-in `std::vector` member function:

| Queue Operation    | `std::vector` Function             | What It Does                                                         | Time Complexity  |
| :----------------- | :--------------------------------- | :------------------------------------------------------------------- | :--------------: |
| **`enqueue(val)`** | `elements.push_back(val)`          | Appends `val` to the rear (end) of the vector.                       | $O(1)$ Amortized |
| **`dequeue()`**    | `elements.erase(elements.begin())` | Removes the element at index `0` and shifts remaining elements left. |    **$O(n)$**    |
| **`front()`**      | `elements.front()`                 | Returns the element at index `0` without removing it.                |      $O(1)$      |
| **`rear()`**       | `elements.back()`                  | Returns the element at `size - 1` without removing it.               |      $O(1)$      |
| **`empty()`**      | `elements.empty()`                 | Returns `true` if the vector has 0 elements.                         |      $O(1)$      |
| **`size()`**       | `elements.size()`                  | Returns the total number of elements in the vector.                  |      $O(1)$      |

---

## 3. Understanding `push_back()`, `front()`, `back()`, and `erase()`

Let's examine how each operation works inside our custom `Queue` class:

### 1. Enqueue with `push_back(value)`

```cpp
void enqueue(int value) {
    elements.push_back(value);
    cout << value << " enqueued into the queue." << endl;
}
```

`elements.push_back(value)` places `value` at the back of the vector. Because a vector reserves extra capacity ahead of time, appending to the end runs in **$O(1)$ amortized time**.

### 2. Inspecting Ends with `front()` and `back()`

```cpp
int front() {
    if (elements.empty()) {
        cout << "Queue is empty! No front element." << endl;
        return -1;
    }
    return elements.front(); // Same as elements[0]
}

int rear() {
    if (elements.empty()) {
        cout << "Queue is empty! No rear element." << endl;
        return -1;
    }
    return elements.back();  // Same as elements[elements.size() - 1]
}
```

Both `elements.front()` and `elements.back()` perform a direct index lookup (`elements[0]` and `elements[size - 1]`), executing in **$O(1)$ constant time**.

### 3. Dequeue with `elements.erase(elements.begin())`

Unlike `std::deque` or `std::list`, **`std::vector` does NOT have a `pop_front()` member function!** To remove the front element at index `0`, we pass an iterator pointing to the first element (`elements.begin()`) into `elements.erase()`:

```cpp
void dequeue() {
    if (elements.empty()) {
        cout << "Queue Underflow! Cannot dequeue from an empty queue." << endl;
        return;
    }
    int removedValue = elements.front();
    elements.erase(elements.begin()); // Removes element at index 0
    cout << removedValue << " dequeued from the queue." << endl;
}
```

---

## 4. Complete Custom Queue Class Using `std::vector`

Here is the complete, compilable C++ program implementing a `Queue` class backed by `std::vector`:

```cpp
#include <iostream>
#include <vector>

using namespace std;

class Queue {
private:
    vector<int> elements;

public:
    // Insert an element at the rear of the queue
    void enqueue(int value) {
        elements.push_back(value);
        cout << value << " enqueued." << endl;
    }

    // Remove the front element from the queue
    void dequeue() {
        if (elements.empty()) {
            cout << "Queue Underflow! Cannot dequeue from an empty queue." << endl;
            return;
        }
        int removedValue = elements.front();
        elements.erase(elements.begin());
        cout << removedValue << " dequeued." << endl;
    }

    // Return the front element without removing it
    int front() {
        if (elements.empty()) {
            cout << "Queue is empty! No front element." << endl;
            return -1;
        }
        return elements.front();
    }

    // Return the rear element without removing it
    int rear() {
        if (elements.empty()) {
            cout << "Queue is empty! No rear element." << endl;
            return -1;
        }
        return elements.back();
    }

    // Check if the queue is empty
    bool empty() {
        return elements.empty();
    }

    // Return the number of elements in the queue
    int size() {
        return elements.size();
    }

    // Print all elements from Front to Rear
    void display() {
        if (elements.empty()) {
            cout << "Queue is empty." << endl;
            return;
        }
        cout << "Queue (Front to Rear): ";
        for (int i = 0; i < elements.size(); i++) {
            cout << elements[i] << " ";
        }
        cout << endl;
    }
};

int main() {
    Queue q;

    // 1. Enqueue elements
    q.enqueue(10);
    q.enqueue(20);
    q.enqueue(30);
    q.enqueue(40);

    cout << "---" << endl;
    q.display();
    cout << "Front element: " << q.front() << endl;
    cout << "Rear element: " << q.rear() << endl;
    cout << "Queue size: " << q.size() << endl;

    cout << "---" << endl;

    // 2. Dequeue two elements
    q.dequeue();
    q.dequeue();

    q.display();
    cout << "New Front element: " << q.front() << endl;
    cout << "Queue size: " << q.size() << endl;

    return 0;
}
```

### Output

```text
10 enqueued.
20 enqueued.
30 enqueued.
40 enqueued.
---
Queue (Front to Rear): 10 20 30 40
Front element: 10
Rear element: 40
Queue size: 4
---
10 dequeued.
20 dequeued.
Queue (Front to Rear): 30 40
New Front element: 30
Queue size: 2
```

---

## 5. Why `vector.erase(vector.begin())` Is $O(n)$ (And Why `std::vector` Has No `pop_front()`)

In a standard Queue, `dequeue()` is supposed to be a fast **$O(1)$** operation. Why does `elements.erase(elements.begin())` take **$O(n)$ linear time** instead?

Because `std::vector` guarantees that its elements are stored in **contiguous memory starting at `elements[0]`** without any gaps!

When you remove the element at `index 0`, `std::vector` cannot simply leave an empty hole at `elements[0]`. It must **shift every single remaining element one slot to the left** so that the old `elements[1]` becomes the new `elements[0]`, the old `elements[2]` becomes `elements[1]`, and so on:

```text
Before elements.erase(elements.begin()):
Index:      [0]     [1]     [2]     [3]     [4]
          +-----+ +-----+ +-----+ +-----+ +-----+
elements: |  10 | |  20 | |  30 | |  40 | |  50 |
          +-----+ +-----+ +-----+ +-----+ +-----+
             ^
         Deleted!

Step-by-Step Shifting Inside erase(begin()):
  1. Copy elements[1] (20) -> elements[0]
  2. Copy elements[2] (30) -> elements[1]
  3. Copy elements[3] (40) -> elements[2]
  4. Copy elements[4] (50) -> elements[3]
  (n - 1 elements must be copied in memory!)

After elements.erase(elements.begin()):
Index:      [0]     [1]     [2]     [3]
          +-----+ +-----+ +-----+ +-----+
elements: |  20 | |  30 | |  40 | |  50 |
          +-----+ +-----+ +-----+ +-----+
```

### The Performance Impact

- If your vector holds $n = 10$ elements, shifting $9$ integers is barely noticeable.
- If your vector holds $n = 100{,}000$ elements in a competitive programming contest, a single `erase(begin())` performs $99{,}999$ memory copies. Calling `dequeue()` in a loop $n$ times results in:
  $$(n - 1) + (n - 2) + \dots + 1 = \frac{n(n - 1)}{2} = O(n^2) \text{ total time!}$$
- That is the exact reason the C++ standard library designers refused to add `.pop_front()` to `std::vector`—and why `std::queue` uses `std::deque` instead of `std::vector`!

---

## 6. Alternative Strategy: $O(1)$ Vector Queue Using a `frontIndex` Offset

What if you still want the cache-friendly speed of `std::vector` **without** paying the $O(n)$ shifting cost of `erase(begin())`?

Instead of physically erasing `elements[0]` on every `dequeue()`, we can combine the idea from [Step 2 (Array Queue)](/posts/queue-using-array-in-cpp/) with `std::vector`:

1. Keep an integer member variable `int frontIndex = 0;` alongside `vector<int> elements;`.
2. **`enqueue(val)`:** Call `elements.push_back(val)` in $O(1)$ amortized time.
3. **`dequeue()`:** Simply increment `frontIndex++` in **$O(1)$ time**!
4. **Periodic Cleanup (Compaction):** When the queue becomes completely empty (`frontIndex == elements.size()`), call `elements.clear()` and reset `frontIndex = 0` to reclaim memory in $O(1)$ time!

```text
O(1) Vector Queue with frontIndex Offset:

After enqueue(10, 20, 30, 40) and two dequeue() calls:
   Index:       [0]     [1]     [2]     [3]
              +-----+ +-----+ +-----+ +-----+
   elements:  | (10)| | (20)| |  30 | |  40 |
              +-----+ +-----+ +-----+ +-----+
                                 ^       ^
                          frontIndex=2  back()
                         (Zero shifting!)
```

### Complete C++ Code: Optimized $O(1)$ Vector Queue

```cpp
#include <iostream>
#include <vector>

using namespace std;

class FastVectorQueue {
private:
    vector<int> elements;
    int frontIndex;

public:
    FastVectorQueue() {
        frontIndex = 0;
    }

    bool empty() {
        return frontIndex >= elements.size();
    }

    int size() {
        return elements.size() - frontIndex;
    }

    // O(1) amortized enqueue
    void enqueue(int value) {
        elements.push_back(value);
    }

    // O(1) dequeue without shifting elements!
    void dequeue() {
        if (empty()) {
            cout << "Queue Underflow!" << endl;
            return;
        }
        cout << elements[frontIndex] << " dequeued." << endl;
        frontIndex++;

        // Reset underlying vector when queue becomes completely empty
        if (empty()) {
            elements.clear();
            frontIndex = 0;
        }
    }

    int front() {
        if (empty()) return -1;
        return elements[frontIndex];
    }

    int rear() {
        if (empty()) return -1;
        return elements.back();
    }
};

int main() {
    FastVectorQueue fq;
    fq.enqueue(100);
    fq.enqueue(200);
    fq.enqueue(300);

    fq.dequeue(); // 100 dequeued in O(1) time
    cout << "Front: " << fq.front() << " | Rear: " << fq.rear() << " | Size: " << fq.size() << endl;

    return 0;
}
```

### Output

```text
100 dequeued.
Front: 200 | Rear: 300 | Size: 2
```

---

## 7. Time and Space Complexity Comparison

Let's compare the two `std::vector` Queue strategies side by side with `std::deque` / `std::queue`:

| Operation                | Naive Vector Queue (`erase(begin())`) |  Offset Vector Queue (`frontIndex++`)  | STL `std::queue` (`std::deque`) |
| :----------------------- | :-----------------------------------: | :------------------------------------: | :-----------------------------: |
| **`enqueue(val)`**       |           $O(1)$ Amortized            |            $O(1)$ Amortized            |             $O(1)$              |
| **`dequeue()`**          |        **$O(n)$ (Slow shift)**        |               **$O(1)$**               |           **$O(1)$**            |
| **`front()`**            |                $O(1)$                 |                 $O(1)$                 |             $O(1)$              |
| **`rear()`**             |                $O(1)$                 |                 $O(1)$                 |             $O(1)$              |
| **`empty()` / `size()`** |                $O(1)$                 |                 $O(1)$                 |             $O(1)$              |
| **Space Complexity**     |        $O(n)$ active elements         | $O(\text{total enqueued until empty})$ |     $O(n)$ active elements      |

---

## Summary

- You can build a dynamic Queue using `std::vector` by inserting at the back with **`push_back()`** and reading the ends with **`front()`** and **`back()`**.
- Removing the front element with **`elements.erase(elements.begin())` takes $O(n)$ time** because `std::vector` must shift all remaining elements one index to the left to preserve contiguous memory.
- You can eliminate the $O(n)$ shift by maintaining a **`frontIndex` offset** that increments on `dequeue()`, achieving $O(1)$ dequeue speed.
- When you want true $O(1)$ dynamic allocation and immediate memory deallocation on every single `dequeue()` without any wasted prefix slots, a **Linked List** is the ideal structure!

---

## Continue Learning in the Queue Series

In Step 4, we will build a Queue from scratch using a **Singly Linked List** with `front` and `rear` node pointers so that both `enqueue()` and `dequeue()` run in strict $O(1)$ worst-case time!

- **Topic Hub:** [Queue in C++: Complete Beginner-to-Advanced Guide](/topics/queue/)
- **Previous Article (Step 2):** [Queue Implementation Using Array in C++](/posts/queue-using-array-in-cpp/)
- **Next Article (Step 4):** [Queue Implementation Using Linked List in C++](/posts/queue-using-linked-list-in-cpp/)
- **Step 5:** [Most Famous Queue Problems in Competitive Programming](/posts/top-5-queue-problems-in-cpp/)
- **Step 6:** [Queue vs Stack in C++: Complete Comparison](/posts/queue-vs-stack-in-cpp/)

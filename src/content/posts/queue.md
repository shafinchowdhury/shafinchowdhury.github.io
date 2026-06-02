---
title: "Data-Stracture in C: Queue"
author: "Shafin Chowdhury"
pubDatetime: 2026-06-02T03:27:00Z
featured: true
draft: false
tags:
  - queue
description: "This article is a comprehensive, publication-ready educational guide designed to teach developers and computer science students the Queue data structure using the C programming language. It transitions smoothly from foundational conceptual definitions to concrete, production-grade source code."
---
### What is a Queue?
A queue is a linear data structure designed to store elements sequentially. Unlike a stack, which operates on a Last-In, First-Out (LIFO) framework, a queue enforces a **FIFO (First-In, First-Out)** protocol. Data insertion occurs at one designated end, and data extraction occurs at the opposite end.

* **Enqueue (Insertion):** The structural process of adding a new element to the back of the queue.
* **Dequeue (Deletion):** The structural process of removing an element from the front of the queue.

### Real-World Analogy
Imagine a line of people waiting at a train ticket counter. 
1. When a new passenger arrives, they must join the line at the very back (**Rear**).
2. The passenger at the very front of the line (**Front**) is served first and leaves the counter.

Because the person who arrives first gets served first, this perfectly mirrors the mechanics of a software queue.

![image](https://cdn.shafinchowdhury.dev/blogs/data-structures/queue/_732cdc24-6589-4d8c-9d5c-b618ff6709d5.jpeg)

### 1. The Dual-Pointer Mechanism
To efficiently track the entry and exit points without shifting every single data item when an operation occurs, a queue relies on two state-tracking variables:
* **Front:** Stores the memory address or array index of the first (oldest) element in the queue. Dequeue operations occur here.
* **Rear:** Stores the memory address or array index of the last (newest) element in the queue. Enqueue operations occur here.

Consider an array-based queue containing three numbers: `[10, 20, 30]`.
* `Index 0` holds `10` → **Front**
* `Index 1` holds `20`
* `Index 2` holds `30` → **Rear**

---

## 2. Structural Characteristics

Queues offer unique properties that make them indispensable for system level architectures:

* **Ordered Sequence Preservation:** Elements maintain their exact chronological entry order, making it perfect for asynchronous processing.
* **Dual-Point Accessibility:** Access is structurally limited to the absolute front and rear boundaries, preventing accidental manipulation of middle elements.
* **Execution Efficiency:** Standard queue operations execute in constant time, $O(1)$, ensuring high performance across large data flows.
* **Asynchronous Buffering:** Act as shock absorbers between fast producers and slow consumers (e.g., printer spooling, CPU task scheduling).

---

## 3. Classifications & Types of Queues

Depending on the operational constraints and structural layouts required, queues are categorized into five primary types:

### A. Linear Queue
The standard linear variation. Elements are inserted at the rear and deleted from the front. Its major limitation is memory wastage: once an index is vacated by a dequeue operation, linear arrays cannot easily reuse that space without expensive data shifting.

### B. Circular Queue (Ring Buffer)
In a circular queue, the last node or index connects back directly to the first node, forming a closed loop. This completely resolves the memory wastage issue of standard linear queues. When the `Rear` pointer reaches the end of the array space, it cycles back to index `0` if that space has been cleared by previous dequeues.

### C. Double-Ended Queue (Deque)
A flexible queue structure where both insertion (enqueue) and deletion (dequeue) operations can be performed from *either* the front or the rear end.

### D. Input-Restricted Deque
A specific subset of the Double-Ended Queue. 
* **Insertion (Enqueue):** Allowed at **one end only** (usually the Rear).
* **Deletion (Dequeue):** Allowed at **both ends** (Front and Rear).

### E. Output-Restricted Deque
Another subset of the Double-Ended Queue.
* **Insertion (Enqueue):** Allowed at **both ends** (Front and Rear).
* **Deletion (Dequeue):** Allowed at **one end only** (usually the Front).

### F. Priority Queue
A specialized queue structure where each element is explicitly assigned a priority value. Elements are not served strictly by arrival time; instead, elements with higher priorities are dequeued before lower-priority elements. If two items share identical priorities, they are processed according to their FIFO arrival order.

---

## 4. Fundamental Operations

To build an interactive and crash-proof queue, you must implement six core functions:

| Operation | Return Type | Description | Critical Structural Condition to Check |
| :--- | :--- | :--- | :--- |
| **`enqueue(data)`** | `void` | Inserts an item at the rear boundary. | **Overflow:** Check if the queue is already full. |
| **`dequeue()`** | `int` | Removes and returns the item at the front boundary. | **Underflow:** Check if the queue is empty. |
| **`peek()`** | `int` | Reads the value at the front boundary without removing it. | **Underflow:** Ensure an item exists to be read. |
| **`rearElement()`** | `int` | Reads the value at the rear boundary without removing it. | **Underflow:** Ensure an item exists to be read. |
| **`isFull()`** | `bool` | Evaluates if the queue has reached max capacity. | N/A |
| **`isEmpty()`** | `bool` | Evaluates if the queue contains zero elements. | N/A |

---

## 5. Step-by-Step Mathematical & Logic Algorithms

### Enqueue Operation Logic
To insert data into an array-based queue:
1. Check if the queue is full (`isFull()`). If true, terminate with an "Overflow Error".
2. If the queue is entirely empty (initial state where `Front == -1`), set `Front` to `0`.
3. Increment the `Rear` pointer index by 1.
4. Insert the data element into the array at the position now indexed by `Rear`.

### Dequeue Operation Logic
To remove data from an array-based queue:
1. Check if the queue is empty (`isEmpty()`). If true, terminate with an "Underflow Error".
2. Access and save the data located at the current `Front` index.
3. If this was the last remaining element in the queue (`Front == Rear`), reset both `Front` and `Rear` pointers to `-1` to mark the queue as completely empty.
4. Otherwise, increment the `Front` pointer index by 1 to point to the next chronological item.
5. Return the saved data value.

---

## 6. Implementation Strategies in C

Queues can be materialized using two memory models: Arrays or Linked Lists.

### Approach A: Array Implementation
* **Pros:** Easy to write; memory allocations are contiguous and ultra-fast; no memory overhead for pointers.
* **Cons:** Fixed sizing. You must declare a maximum capacity upfront; cannot dynamically grow or shrink.

### Approach B: Linked List Implementation
* **Pros:** Completely dynamic; handles variable amounts of data without wasting space or encountering overflow constraints.
* **Cons:** Every single data element requires extra memory allocation to store its structural link pointer; dynamic allocations (`malloc`) add minor overhead.

---

## 7. Fully Executable Array Implementation in C

Below is a complete, production-grade, and well-commented C implementation using fixed arrays. This code can be copied, compiled, and run directly.

```c
#include <stdio.h>
#include <stdbool.h>

#define MAX_SIZE 5 // Define the static allocation capacity

// Structure to encapsulate Queue properties
struct Queue {
    int items[MAX_SIZE];
    int front;
    int rear;
};

// Initialization function to set pointers to their default empty states
void initialize(struct Queue* q) {
    q->front = -1;
    q->rear = -1;
}

// Check if the queue container space is fully occupied
bool isFull(struct Queue* q) {
    return q->rear == MAX_SIZE - 1;
}

// Check if the queue container holds zero elements
bool isEmpty(struct Queue* q) {
    return q->front == -1;
}

// Insert an element into the rear of the queue
void enqueue(struct Queue* q, int value) {
    if (isFull(q)) {
        printf("Execution Alert: Enqueue failed. Queue is in an Overflow state.\\n");
        return;
    }
    
    // If the queue is empty, initialize front boundary to index 0
    if (q->front == -1) {
        q->front = 0;
    }
    
    q->rear++;
    q->items[q->rear] = value;
    printf("Successfully Enqueued: %d (New Rear Index: %d)\\n", value, q->rear);
}

// Remove and return the front element from the queue
int dequeue(struct Queue* q) {
    if (isEmpty(q)) {
        printf("Execution Alert: Dequeue failed. Queue is in an Underflow state.\\n");
        return -1; // Return an error marker
    }
    
    int extractedItem = q->items[q->front];
    printf("Successfully Dequeued: %d (Old Front Index: %d)\\n", extractedItem, q->front);
    
    // If front matches rear, the final remaining item has been cleared
    if (q->front == q->rear) {
        q->front = -1;
        q->rear = -1;
        printf("Queue notice: All data cleared. Resetting boundary pointers to empty.\\n");
    } else {
        q->front++;
    }
    
    return extractedItem;
}

// View the element currently at the front boundary
int peek(struct Queue* q) {
    if (isEmpty(q)) {
        printf("Peek Alert: Cannot read data. Queue is empty.\\n");
        return -1;
    }
    return q->items[q->front];
}

// View the element currently at the rear boundary
int rearElement(struct Queue* q) {
    if (isEmpty(q)) {
        printf("Rear Alert: Cannot read data. Queue is empty.\\n");
        return -1;
    }
    return q->items[q->rear];
}

// Helper utility to visually print the current line arrangement
void displayQueue(struct Queue* q) {
    if (isEmpty(q)) {
        printf("Queue Status: [ Empty ]\\n\\n");
        return;
    }
    
    printf("Current Queue Layout: ");
    for (int i = q->front; i <= q->rear; i++) {
        printf("[%d] ", q->items[i]);
    }
    printf("\\n(Front Index: %d | Rear Index: %d)\\n\\n", q->front, q->rear);
}

// Execution entry point
int main() {
    struct Queue myQueue;
    initialize(&myQueue);
    
    printf("=== Initializing Queue Framework Tests ===\\n\\n");
    
    // Test underflow triggers
    dequeue(&myQueue);
    
    // Fill up the queue container
    enqueue(&myQueue, 10);
    enqueue(&myQueue, 20);
    enqueue(&myQueue, 30);
    enqueue(&myQueue, 40);
    enqueue(&myQueue, 50);
    
    displayQueue(&myQueue);
    
    // Test overflow triggers
    enqueue(&myQueue, 60);
    
    // Check boundary elements via structural lookups
    printf("Active Front Element: %d\\n", peek(&myQueue));
    printf("Active Rear Element: %d\\n\\n", rearElement(&myQueue));
    
    // Perform data extraction passes
    dequeue(&myQueue);
    dequeue(&myQueue);
    
    displayQueue(&myQueue);
    
    return 0;
}
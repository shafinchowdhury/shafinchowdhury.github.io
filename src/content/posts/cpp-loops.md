---
title: "Loops in C++: for, while, do-while, and Range-Based Iteration"
author: "Shafin Chowdhury"
pubDatetime: 2026-08-05T10:00:00+06:00
featured: false
draft: false
tags:
  - cpp
  - fundamentals
  - programming
description: "Master iteration in C++. Learn for loops, while loops, do-while loops, range-based for loops, loop control with break and continue, and how to avoid infinite loops."
---

Computers excel at performing repetitive operations with blazing speed and absolute precision. Whether you are summing a million numbers, parsing rows of telemetry data, rendering frames in a game loop, or searching through a database, you need a mechanism to execute code repeatedly.

In C++, iteration is accomplished through **loops**.

---

## What You'll Learn

- Why iteration is essential for clean software architecture
- The four loop constructs in C++: `for`, `while`, `do-while`, and modern **range-based `for`**
- The precise three-part lifecycle of a traditional `for` loop
- When to choose a pre-test loop (`while`) vs. a post-test loop (`do-while`)
- Controlling execution flow with `break` and `continue`
- How to write intentional infinite loops safely
- Working with nested loops for multi-dimensional data
- Comprehensive loop comparison reference table
- Diagnosing classic pitfalls: off-by-one errors and floating-point counter drift

---

## 1. The Standard `for` Loop

The traditional `for` loop is ideal when you know in advance how many times an operation should repeat (such as iterating over a fixed count or an indexed sequence).

### Syntax

```cpp
for (initialization; condition; update) {
    // Loop body
}
```

### Execution Lifecycle

1. **Initialization**: Executes **exactly once** before the first iteration begins. Typically declares and initializes a loop counter.
2. **Condition**: Evaluated before **every** iteration. If `true`, the loop body executes. If `false`, the loop terminates.
3. **Loop Body**: The statements inside `{ ... }` run.
4. **Update**: Executes immediately **after** the loop body on every iteration. Usually increments or decrements the counter. Then flow returns to Step 2.

### Practical Example: Counting and Accumulation

```cpp
#include <iostream>

using namespace std;

int main() {
    int sum = 0;

    // Sum numbers from 1 to 10
    for (int i = 1; i <= 10; ++i) {
        sum += i;
    }

    cout << "Sum of integers 1 through 10 is: " << sum << '\n';
    return 0;
}
```

### Output

```text
Sum of integers 1 through 10 is: 55
```

---

## 2. The `while` Loop

The `while` loop is a **pre-test loop**. It checks its condition **before** entering the loop body. If the condition is `false` initially, the loop body never executes.

### Syntax

```cpp
while (condition) {
    // Loop body (must modify state so condition eventually becomes false!)
}
```

The `while` loop is best suited for scenarios where the number of iterations depends on runtime events, user actions, or external state rather than a predetermined index count.

### Practical Example: Interactive Number Guessing Game

```cpp
#include <iostream>

using namespace std;

int main() {
    const int secretCode = 7;
    int guess = 0;

    cout << "Guess the secret digit between 1 and 9:\n";

    while (guess != secretCode) {
        cout << "Enter your guess: ";
        cin >> guess;

        if (guess != secretCode) {
            cout << "Incorrect! Try again.\n";
        }
    }

    cout << "Congratulations! You found the secret code.\n";
    return 0;
}
```

---

## 3. The `do-while` Loop

The `do-while` loop is a **post-test loop**. Unlike `for` and `while`, its condition is checked **after** the loop body executes.

As a result, a `do-while` loop is **guaranteed to execute at least once**, regardless of the initial condition.

### Syntax

```cpp
do {
    // Loop body (runs at least once)
} while (condition); // Notice the required trailing semicolon!
```

`do-while` is especially valuable for menu selection and user validation where you must prompt the user at least once before checking if their response was valid.

### Practical Example: Input Validation Loop

```cpp
#include <iostream>

using namespace std;

int main() {
    int choice = 0;

    do {
        cout << "\n=== System Control Menu ===\n";
        cout << "1. Run Diagnostics\n";
        cout << "2. View Error Logs\n";
        cout << "3. Exit System\n";
        cout << "Select an option (1-3): ";
        cin >> choice;
    } while (choice < 1 || choice > 3);

    cout << "You selected valid option #" << choice << '\n';
    return 0;
}
```

---

## 4. Modern C++: Range-Based `for` Loops

Introduced in C++11 and refined in C++17/20, the **range-based `for` loop** provides a clean, safe, and expressive syntax for iterating through all elements of an array, vector, or standard container without manual index counters:

### Syntax

$$\mathbf{for\ (} \text{type variable} \mathbf{\ :\ } \text{collection} \mathbf{)}$$

### Practical Example

```cpp
#include <iostream>
#include <vector>

using namespace std;

int main() {
    int numbers[] = {12, 45, 68, 91, 33};

    cout << "Iterating over array elements:\n";

    // Read-only iteration using const reference (avoids copying elements)
    for (const auto& num : numbers) {
        cout << num << " ";
    }
    cout << '\n';

    return 0;
}
```

### Why Prefer Range-Based `for`?

1. **Eliminates Off-by-One Errors**: You cannot accidentally exceed array boundaries or access an out-of-bounds index.
2. **Cleaner Syntax**: No clutter with `int i = 0; i < size; ++i`.
3. **Safe by Default**: Pairing `const auto& item` prevents expensive accidental object copies during iteration.

---

## Controlling Loop Flow: `break` and `continue`

C++ provides two jump statements to alter loop flow dynamically.

### 1. The `break` Statement

Immediately terminates the enclosing loop, transferring control to the first statement following the loop:

```cpp
#include <iostream>

using namespace std;

int main() {
    // Searching for a target value
    int values[] = {10, 25, 42, 88, 99};
    int target = 42;
    bool found = false;

    for (int val : values) {
        if (val == target) {
            found = true;
            break; // Stop searching immediately! No need to inspect remaining items
        }
    }

    cout << "Target found: " << boolalpha << found << '\n';
    return 0;
}
```

### 2. The `continue` Statement

Skips the remainder of the _current_ iteration's body and jumps straight to the loop's update step:

```cpp
#include <iostream>

using namespace std;

int main() {
    // Print all odd numbers between 1 and 10
    for (int i = 1; i <= 10; ++i) {
        if (i % 2 == 0) {
            continue; // Skip even numbers!
        }
        cout << i << " ";
    }
    cout << '\n'; // Prints: 1 3 5 7 9
    return 0;
}
```

---

## Intentional Infinite Loops

An **infinite loop** runs indefinitely unless explicitly terminated via `break`, `return`, or program exit. In event-driven programming, server daemons, and video game mainloops, intentional infinite loops are standard:

```cpp
while (true) {
    auto event = pollUserEvent();
    if (event.isQuitRequest()) {
        break; // Graceful exit
    }
    renderFrame();
}
```

---

## Nested Loops

A loop placed inside the body of another loop is called a **nested loop**. For each single iteration of the outer loop, the inner loop executes its entire lifecycle from beginning to end:

### Practical Example: Multiplication Table Matrix

```cpp
#include <iostream>
#include <iomanip>

using namespace std;

int main() {
    cout << "--- 5x5 Multiplication Grid ---\n\n";

    for (int row = 1; row <= 5; ++row) {
        for (int col = 1; col <= 5; ++col) {
            cout << setw(4) << (row * col);
        }
        cout << '\n'; // End row
    }

    return 0;
}
```

### Output

```text
--- 5x5 Multiplication Grid ---

   1   2   3   4   5
   2   4   6   8  10
   3   6   9  12  15
   4   8  12  16  20
   5  10  15  20  25
```

---

## Loop Comparison Reference Table

| Loop Type             | Condition Evaluation   | Guaranteed Executions | Best Used For                                        |
| :-------------------- | :--------------------- | :-------------------- | :--------------------------------------------------- |
| **`for`**             | Pre-test (before body) | 0                     | Known number of iterations, index counters           |
| **`while`**           | Pre-test (before body) | 0                     | Unknown count, event-driven loops, streams           |
| **`do-while`**        | Post-test (after body) | **At least 1**        | User menus, input validation prompts                 |
| **Range-based `for`** | Managed internally     | 0                     | Iterating through entire arrays, vectors, containers |

---

## Common Beginner Mistakes

### 1. The Off-by-One Error

Using `<=` instead of `<` when indexing zero-based collections:

```cpp
int arr[5] = {10, 20, 30, 40, 50};
// BUG: i goes up to 5, but valid indices are 0 to 4!
for (int i = 0; i <= 5; ++i) {
    cout << arr[i]; // Memory corruption on i = 5!
}
```

### 2. Accidental Infinite Loops via Missing Updates

```cpp
int i = 0;
while (i < 10) {
    cout << i << '\n';
    // BUG: Forgot ++i! i remains 0 forever!
}
```

### 3. Using Floating-Point Loop Counters

```cpp
// BUG: Due to binary floating-point rounding inaccuracies, 0.1 cannot be represented exactly!
for (double d = 0.0; d != 1.0; d += 0.1) {
    // May never hit exactly 1.0, looping forever!
}
// Fix: Use integer counters or relational inequalities (d < 1.0)
```

---

## Best Practices

1. **Prefer range-based `for` loops**: When reading or modifying all elements of a collection, use `for (auto& x : col)` or `for (const auto& x : col)`.
2. **Keep loop bodies focused**: If a loop body exceeds 30–40 lines, extract the logic into a dedicated helper function.
3. **Declare loop counters in the initialization clause**: Write `for (int i = 0; ...)` so `i` is scoped strictly to the loop and destroyed afterward.
4. **Use prefix increment (`++i`)**: Prefix avoids unnecessary copy creation for complex iterators.

---

## Summary

- Iteration allows running a block of statements repeatedly without duplicating code.
- `for` is best for counting and index-driven iteration.
- `while` checks its condition upfront and is best for dynamic conditions.
- `do-while` guarantees at least one execution before testing the condition.
- Modern range-based `for` loops provide safe, elegant iteration over arrays and collections.
- `break` exits a loop entirely; `continue` skips to the next iteration.

---

## Continue Learning C++

- **Previous Article:** [Conditional Statements in C++: if, else if, else, and switch](/posts/cpp-conditional-statements/)
- **Next Article:** [Functions in C++: Declaration, Scope, Overloading, and Parameters](/posts/cpp-functions/)
- **Explore Topic Hub:** [C++ Programming & Systems Engineering](/topics/cpp/)

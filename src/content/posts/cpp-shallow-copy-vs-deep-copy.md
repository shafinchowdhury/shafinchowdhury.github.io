---
title: "C++ Shallow Copy vs Deep Copy Explained"
author: "Shafin Chowdhury"
pubDatetime: 2026-10-02T17:00:00+06:00
featured: false
draft: false
tags:
  - cpp
  - oop
  - memory
  - shallow-copy
  - deep-copy
description: "Understand the vital difference between shallow copy and deep copy in C++. Learn how pointer copying causes double deletion and how to implement custom deep copying."
---

In our previous article on the [C++ copy constructor](/posts/cpp-copy-constructor/), we discovered a major hazard in C++ memory management: when a class owns dynamically allocated memory through raw pointers, the compiler's default copying mechanism can lead to catastrophic application crashes.

This danger stems directly from the distinction between a **shallow copy** and a **deep copy**.

Understanding this distinction is a defining milestone for every C++ developer. It separates surface-level syntax knowledge from true mastery of how objects and memory operate under the hood.

---

## What You'll Learn

- What a **shallow copy** is and how the compiler performs it
- What a **deep copy** is and why resource ownership demands it
- The fatal risks of shallow copying pointers: **aliasing, data corruption, double deletion, and dangling pointers**
- A step-by-step breakdown of how shallow copying causes runtime crashes
- How to author a custom **deep-copying copy constructor**
- How to author a safe **copy assignment operator (`operator=`)** with self-assignment protection
- Why modern C++ favors standard RAII wrappers (`std::vector`, `std::unique_ptr`) over manual pointer management

---

## What Is a Shallow Copy?

A **shallow copy** duplicates the bitwise or memberwise values of an object directly into another object.

If the class contains only fundamental data types—such as `int`, `double`, or `char`—a shallow copy is completely safe. The values are copied directly into the new object's memory location on the stack:

```text
p1: x = 10, y = 20  ───(Shallow Copy)───►  p2: x = 10, y = 20
```

Both objects hold distinct, independent copies of those numbers.

### The Disaster with Pointer Members

When an object contains a **pointer** pointing to dynamically allocated heap memory, a shallow copy copies the **memory address stored inside the pointer**, **NOT** the heap memory it points to!

```text
SHALLOW COPY BEHAVIOR (DANGEROUS):

Stack Object (student1)              Heap Allocation
+--------------------+
| name: "Shafin"     |
| cgpa: 0x7ffd10 ----+-------------> [ 3.85 ]
+--------------------+                  ^
                                        |
Stack Object (student2)                 |
+--------------------+                  |
| name: "Shafin"     |                  |
| cgpa: 0x7ffd10 ----+------------------+
+--------------------+
```

Notice what just happened:

1. `student2.cgpa` points to the **exact same physical memory address** as `student1.cgpa`.
2. Both objects now claim ownership over the same single heap allocation.

This shared ownership creates three critical bugs:

- **Unintended Mutation**: Modifying `*student2.cgpa` silently mutates `*student1.cgpa`.
- **Double Free / Double Deletion Crash**: When both objects go out of scope, their destructors execute `delete cgpa;`. The first destructor frees the heap block successfully. The second destructor attempts to delete memory that is already freed, causing an immediate runtime crash (`free(): double free detected`).
- **Dangling Pointers**: If `student1` is destroyed before `student2`, `student2.cgpa` is left pointing to deallocated memory.

---

## Demonstrating the Problem: The Shallow Copy Trap

Let's write a small program that demonstrates the hazardous nature of a shallow copy:

```cpp
#include <iostream>
#include <string>

using namespace std;

class ShallowStudent {
public:
    string name;
    double* cgpa; // Dynamically allocated member

    ShallowStudent(string studentName, double gpaValue) {
        name = studentName;
        cgpa = new double; // Allocate heap memory
        *cgpa = gpaValue;
        cout << "[Constructor] Allocated cgpa for " << name
             << " at address: " << cgpa << endl;
    }

    // Destructor frees allocated memory
    ~ShallowStudent() {
        cout << "[Destructor] Deleting cgpa for " << name
             << " at address: " << cgpa << endl;
        delete cgpa;
    }

    // Note: No user-defined copy constructor is provided!
    // The compiler synthesizes a shallow-copying constructor automatically.
};

void demonstrateShallowCopy() {
    ShallowStudent s1("Shafin", 3.85);

    // Shallow copy: s2.cgpa receives the exact same pointer address as s1.cgpa!
    ShallowStudent s2 = s1;

    cout << "s1.cgpa address: " << s1.cgpa << " | Value: " << *s1.cgpa << endl;
    cout << "s2.cgpa address: " << s2.cgpa << " | Value: " << *s2.cgpa << endl;

    // Both s2 and s1 will be destructed upon exiting this function...
}

int main() {
    cout << "--- Calling demonstrateShallowCopy ---" << endl;
    // Calling this function will trigger a double-free crash!
    // demonstrateShallowCopy();
    cout << "(Double-free crash prevented for demonstration)" << endl;
    return 0;
}
```

```text
Expected Execution Flow if run:
[Constructor] Allocated cgpa for Shafin at address: 0x6000021b0010
s1.cgpa address: 0x6000021b0010 | Value: 3.85
s2.cgpa address: 0x6000021b0010 | Value: 3.85
[Destructor] Deleting cgpa for Shafin at address: 0x6000021b0010
[Destructor] Deleting cgpa for Shafin at address: 0x6000021b0010
CRASH: free(): double free detected in tcache 2
```

The operating system terminates the process because deleting the same heap address twice corrupts the heap manager's metadata.

---

## What Is a Deep Copy?

A **deep copy** duplicates both the object itself **AND the external dynamic resources** owned by that object.

Instead of copying the raw pointer address:

1. A **brand new block of heap memory** is allocated for the copy.
2. The **data value** stored at the source memory location is copied into the newly allocated block.
3. The new object's pointer is pointed to its own dedicated heap memory.

```text
DEEP COPY BEHAVIOR (SAFE & CORRECT):

Stack Object (student1)              Heap Allocation 1
+--------------------+
| name: "Shafin"     |
| cgpa: 0x7ffd10 ----+-------------> [ 3.85 ]
+--------------------+

Stack Object (student2)              Heap Allocation 2 (Distinct Address!)
+--------------------+
| name: "Shafin"     |
| cgpa: 0x7ffd90 ----+-------------> [ 3.85 ]
+--------------------+
```

Each object now possesses complete, independent ownership of its own heap resource. Modifying `student2` does not affect `student1`, and when both objects leave scope, each destructor frees its own distinct heap address without conflict.

---

## Implementing Deep Copy in C++

To implement a deep copy, you must define:

1. A **custom copy constructor**.
2. A **custom copy assignment operator (`operator=`)**.

Let's study the complete, robust implementation:

```cpp
#include <iostream>
#include <string>

using namespace std;

class DeepStudent {
private:
    string name;
    double* cgpa; // Dynamically allocated resource

public:
    // 1. Parameterized Constructor
    DeepStudent(string studentName, double gpaValue)
        : name(studentName) {
        cgpa = new double;
        *cgpa = gpaValue;
        cout << "[Constructor] Allocated cgpa at: " << cgpa
             << " with value: " << *cgpa << endl;
    }

    // 2. Custom Deep Copy Constructor
    DeepStudent(const DeepStudent& other)
        : name(other.name) {
        // Step A: Allocate a BRAND NEW heap block for this instance
        this->cgpa = new double;

        // Step B: Copy the VALUE stored at other.cgpa into our new memory
        *this->cgpa = *other.cgpa;

        cout << "[Deep Copy Constructor] Allocated NEW cgpa at: " << this->cgpa
             << " containing value: " << *this->cgpa << endl;
    }

    // 3. Custom Deep Copy Assignment Operator
    DeepStudent& operator=(const DeepStudent& other) {
        cout << "[Copy Assignment] Processing assignment for: " << other.name << endl;

        // Step A: Check for self-assignment (e.g., s1 = s1;)
        if (this == &other) {
            return *this;
        }

        // Step B: Deallocate existing owned resource to prevent memory leaks
        delete this->cgpa;

        // Step C: Copy non-pointer members
        this->name = other.name;

        // Step D: Allocate new memory and copy the value
        this->cgpa = new double;
        *this->cgpa = *other.cgpa;

        // Step E: Return *this to enable assignment chaining (a = b = c)
        return *this;
    }

    // 4. Destructor
    ~DeepStudent() {
        cout << "[Destructor] Deleting memory at: " << cgpa << " for " << name << endl;
        delete cgpa;
        cgpa = nullptr; // Safety practice
    }

    void setGpa(double newGpa) {
        *cgpa = newGpa;
    }

    void print() const {
        cout << name << " | Address: " << cgpa << " | GPA: " << *cgpa << endl;
    }
};

int main() {
    cout << "=== 1. Initial Creation ===" << endl;
    DeepStudent s1("Shafin", 3.85);

    cout << "\n=== 2. Testing Deep Copy Constructor ===" << endl;
    DeepStudent s2 = s1; // Deep copy constructor runs

    cout << "\n=== 3. Modifying s2's GPA ===" << endl;
    s2.setGpa(4.00);

    cout << "s1 details: ";
    s1.print();
    cout << "s2 details: ";
    s2.print();

    cout << "\n=== 4. Testing Copy Assignment Operator ===" << endl;
    DeepStudent s3("Ayman", 3.50);
    s3 = s1; // Copy assignment operator runs

    cout << "s3 details: ";
    s3.print();

    cout << "\n=== 5. Leaving Scope (Destructors Run) ===" << endl;
    return 0;
}
```

```text
Output:
=== 1. Initial Creation ===
[Constructor] Allocated cgpa at: 0x600000008030 with value: 3.85

=== 2. Testing Deep Copy Constructor ===
[Deep Copy Constructor] Allocated NEW cgpa at: 0x600000008040 containing value: 3.85

=== 3. Modifying s2's GPA ===
s1 details: Shafin | Address: 0x600000008030 | GPA: 3.85
s2 details: Shafin | Address: 0x600000008040 | GPA: 4

=== 4. Testing Copy Assignment Operator ===
[Constructor] Allocated cgpa at: 0x600000008050 with value: 3.5
[Copy Assignment] Processing assignment for: Shafin
[Destructor] Deleting memory at: 0x600000008050 for Ayman
s3 details: Shafin | Address: 0x600000008060 | GPA: 3.85

=== 5. Leaving Scope (Destructors Run) ===
[Destructor] Deleting memory at: 0x600000008060 for Shafin
[Destructor] Deleting memory at: 0x600000008040 for Shafin
[Destructor] Deleting memory at: 0x600000008030 for Shafin
```

### Critical Lines Explained

```cpp
this->cgpa = new double;   // Allocates a brand new heap address
*this->cgpa = *other.cgpa; // Dereferences both pointers, copying the actual floating-point number
```

1. **`this->cgpa = new double;`**: We do **not** assign `this->cgpa = other.cgpa`. We request an independent block of memory from the OS heap.
2. **`*this->cgpa = *other.cgpa;`**: We read the value stored in the source object's memory (`3.85`) and write it into our newly allocated memory slot.

Notice in the output:

- `s1` lives at heap address `0x600000008030`.
- `s2` lives at distinct heap address `0x600000008040`.
- Mutating `s2`'s GPA to `4.00` had zero effect on `s1`.
- When the program ends, all three unique addresses are deallocated safely without any double-free crash!

---

## Modern C++ Perspective: Avoiding Manual Memory Management

While implementing custom copy constructors and destructors with raw `new` and `delete` is vital for understanding memory mechanics, **manual dynamic memory management is generally discouraged in modern C++**.

Writing raw `new` and `delete` pairs is fraught with risk:

- It is easy to forget a `delete` in an early-return or exception path, causing memory leaks.
- Implementing copy constructors, copy assignment, and destructors requires substantial error-prone boilerplate.

### The Modern Alternative: Standard RAII Containers and Smart Pointers

In modern C++, standard-library containers (`string`, `vector`) and smart pointers manage heap memory automatically:

1. **`vector` and `string`**: Automatically implement deep copying for you! If your class uses `vector<int>` instead of `int*`, the compiler's default copy constructor performs a deep copy automatically.
2. **`unique_ptr`**: Explicitly represents exclusive ownership. A `unique_ptr` cannot be copied at all—it can only be moved, preventing shallow copy bugs by design at compile time.
3. **`shared_ptr`**: Implements managed, reference-counted shared ownership where memory is freed only when the last owner is destroyed.

This philosophy is captured in the **Rule of Zero**, which we explore next.

---

## Common Beginner Mistakes

### 1. Forgetting the Self-Assignment Check in `operator=`

If you write `s1 = s1;` without checking `if (this == &other)`:

```cpp
delete this->cgpa; // You just deleted other.cgpa as well, because this == &other!
this->cgpa = new double;
*this->cgpa = *other.cgpa; // READING FROM FREED MEMORY (DANGLING POINTER)!
```

Always verify that `this != &other` before deallocating existing resources.

### 2. Forgetting to Deallocate Old Memory in `operator=`

In copy assignment, the destination object already exists and may already own heap memory. If you allocate new memory without first calling `delete cgpa;`, the old memory is permanently leaked.

### 3. Copying the Pointer Address in the Copy Constructor

Writing `this->cgpa = other.cgpa;` inside a custom copy constructor is just a manual shallow copy! You must allocate new memory with `new`.

---

## Best Practices

1. **Perform deep copies whenever a class owns raw heap memory**: Allocate fresh memory and copy the data.
2. **Always guard against self-assignment in `operator=`**: Use `if (this == &other) return *this;`.
3. **Reset pointers to `nullptr` after deletion**: Setting `ptr = nullptr;` prevents accidental dangling pointer dereferences.
4. **Prefer standard library RAII types**: Use `string`, `vector`, or smart pointers to eliminate manual `new`/`delete` code entirely.

---

## Summary

- A **shallow copy** copies member values directly; for pointers, it copies only the memory address.
- Shallow copying pointer members causes **shared ownership, data corruption, and double-free crashes**.
- A **deep copy** allocates fresh heap memory for the destination object and duplicates the actual data.
- Deep copying requires a user-defined **copy constructor**, a **copy assignment operator**, and a **destructor**.
- Modern C++ prefers RAII types (`vector`, `string`, `unique_ptr`) to avoid manual dynamic memory management.

---

## What's Next in the Series?

Notice that in our `DeepStudent` class, because we had a destructor that freed raw memory, we had to implement both a custom copy constructor and a custom copy assignment operator.

This pattern is not a coincidence: it is a foundational C++ design law known as the **Rule of Three**.

In our final and most advanced guide of this series, we explore the **Rule of Three, Rule of Five, and Rule of Zero** in modern C++.

---

## Continue Learning C++ OOP

- **Previous Article:** [C++ Copy Constructor: How Object Copying Works](/posts/cpp-copy-constructor/)
- **Next Article:** [Rule of Three, Five and Zero in C++: Resource Management](/posts/cpp-rule-of-three-five-zero/)
- **Topic Hub:** Explore the full curriculum on the [C++ Object-Oriented Programming Topic Hub](/topics/cpp-oop/)
- **Related Fundamental:** [Dynamic Memory Allocation & Heap Mechanics in C++](/posts/dynamic-memory-allocation/)

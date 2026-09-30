---
title: "Arrays in C++: Memory Layout, Indexing, and Modern Alternatives"
author: "Shafin Chowdhury"
pubDatetime: 2026-08-07T10:00:00+06:00
featured: false
draft: false
tags:
  - cpp
  - fundamentals
  - programming
description: "A complete guide to arrays in C++. Understand contiguous memory layouts, zero-based indexing, multidimensional arrays, array decay in functions, and std::array."
---

Up to this point, each variable we have created stores a single piece of data: one integer, one floating-point number, or one boolean. But real-world applications frequently deal with groups of related items: 100 student exam scores, thousands of coordinates in a 3D mesh, or daily temperature logs across a year.

Declaring individual variables like `score1`, `score2`, ..., `score100` is impossible to maintain.

In C++, an **array** solves this by providing a fixed-size, sequential collection of elements of the **exact same data type** stored together in computer memory.

---

## What You'll Learn

- What a C-style array is and why it exists
- Array declaration, initialization styles, and zero-initialization
- Zero-based indexing and the underlying memory offset mathematics
- How arrays are laid out contiguously in memory
- Iterating through arrays using standard index loops and range-based `for`
- Calculating array capacity safely
- Multi-dimensional arrays (2D matrices and row-major layout)
- Passing arrays to functions and understanding **pointer decay**
- The hazards of out-of-bounds memory access and undefined behavior
- Why modern C++ recommends `std::array` and `std::vector`

---

## What Is an Array?

An array is a fixed-length container that holds multiple values of the same type.

### Key Characteristics of Raw C-style Arrays

1. **Homogeneous**: Every element in the array must be of the identical data type (e.g., all `int`, all `double`, or all `char`).
2. **Fixed Size**: The size is determined at compile time and cannot grow or shrink during program execution.
3. **Contiguous Memory**: Elements are placed back-to-back in memory with zero gaps between them.

---

## Declaring and Initializing Arrays

### 1. Declaration Without Initialization

```cpp
int scores[5]; // Allocates space for 5 integers containing random garbage values!
```

> [!WARNING]
> An uninitialized local array contains garbage memory. Reading elements before assigning values leads to undefined behavior.

### 2. Initialization List

```cpp
int primes[5] = {2, 3, 5, 7, 11}; // Explicit initialization
```

### 3. Inferred Array Size

If you provide an initializer list, you can omit the size inside `[]`; the compiler counts the elements automatically:

```cpp
int measurements[] = {10, 20, 30, 40}; // Inferred size: 4
```

### 4. Zero-Initialization

If you initialize fewer elements than the declared size, the remaining elements are automatically **zero-initialized**:

```cpp
int data[5] = {1, 2}; // Elements are: 1, 2, 0, 0, 0
int allZeros[100] = {}; // All 100 elements are initialized to 0
```

---

## Zero-Based Indexing and Memory Layout

In C++, array indices start at **0**, not 1. An array of size $N$ has valid indices ranging from $0$ up to $N - 1$.

```cpp
int temperatures[4] = {72, 75, 68, 80};

// Accessing elements:
int morningTemp = temperatures[0]; // 72 (First element)
int eveningTemp = temperatures[3]; // 80 (Last element)

// Modifying elements:
temperatures[2] = 70; // Replaces 68 with 70
```

### Why Zero-Based? The Memory Address Formula

The index is not merely an arbitrary number—it is a **memory offset**. Because array elements are laid out **contiguously** in memory, the memory address of any element $i$ can be calculated directly using arithmetic:

$$\text{Address of } arr[i] = \text{Base Address of } arr + \left( i \times \text{sizeof}(\text{element}) \right)$$

Consider an array `int arr[4]` where each `int` occupies 4 bytes:

```text
Index:           [0]          [1]          [2]          [3]
Value:            72           75           70           80
Memory Address:  0x1000       0x1004       0x1008       0x100C
                 |<--4 bytes->|<--4 bytes->|<--4 bytes->|<--4 bytes->|
```

- For `arr[0]`: $\text{Offset} = 0 \times 4 = 0$ bytes from base.
- For `arr[1]`: $\text{Offset} = 1 \times 4 = 4$ bytes from base.
- For `arr[3]`: $\text{Offset} = 3 \times 4 = 12$ bytes from base.

Because the CPU computes this address in a single multiplication and addition operation ($O(1)$ constant time), array indexing is instantaneous regardless of whether the array contains 5 elements or 5 million elements!

---

## Traversing Arrays

### 1. Traditional Index Loop

Use a standard `for` loop when you need to know the index number during iteration:

```cpp
#include <iostream>

int main() {
    int grades[] = {88, 92, 79, 95, 84};
    const int count = sizeof(grades) / sizeof(grades[0]);

    for (int i = 0; i < count; ++i) {
        std::cout << "Student #" << i + 1 << " Grade: " << grades[i] << '\n';
    }

    return 0;
}
```

### 2. Modern Range-Based `for` Loop

When you simply need to read or update every element, the range-based loop is cleaner and eliminates off-by-one errors:

```cpp
// Read-only traversal
for (int grade : grades) {
    std::cout << grade << " ";
}

// In-place modification using a reference (&):
for (int& grade : grades) {
    grade += 5; // Curve every grade up by 5 points!
}
```

---

## Calculating Array Size

In the scope where an array is declared, you can compute its number of elements in two ways:

```cpp
int items[8];

// Method 1: Traditional sizeof division
size_t length1 = sizeof(items) / sizeof(items[0]); // 32 bytes / 4 bytes = 8

// Method 2: Modern C++17 std::size (from <iterator>)
#include <iterator>
size_t length2 = std::size(items); // 8
```

---

## Multidimensional Arrays

A **multidimensional array** is an array of arrays. The most common form is a two-dimensional (2D) array, representing a grid, matrix, or spreadsheet table:

```cpp
// A 2D array with 3 rows and 4 columns
int matrix[3][4] = {
    {1,  2,  3,  4},  // Row 0
    {5,  6,  7,  8},  // Row 1
    {9, 10, 11, 12}   // Row 2
};
```

### Row-Major Storage in Memory

Although we visualize a 2D array as a rectangular grid, computer RAM is strictly linear. C++ stores 2D arrays in **row-major order**: Row 0 is stored first, followed immediately by Row 1, followed by Row 2:

```text
Linear Memory: [ 1 ][ 2 ][ 3 ][ 4 ] [ 5 ][ 6 ][ 7 ][ 8 ] [ 9 ][ 10 ][ 11 ][ 12 ]
               |------ Row 0 -----| |------ Row 1 -----| |------- Row 2 ------|
```

### Nested Traversal Example

```cpp
#include <iostream>
#include <iomanip>

int main() {
    const int ROWS = 3;
    const int COLS = 4;
    int grid[ROWS][COLS] = {
        {10, 20, 30, 40},
        {50, 60, 70, 80},
        {90, 95, 99, 100}
    };

    for (int r = 0; r < ROWS; ++r) {
        for (int c = 0; c < COLS; ++c) {
            std::cout << std::setw(5) << grid[r][c];
        }
        std::cout << '\n';
    }

    return 0;
}
```

---

## Passing Arrays to Functions: The "Array Decay" Phenomenon

In C++, you **cannot** pass a raw array by value to a function.

When an array is passed as an argument to a function, it automatically **decays into a pointer** to its first element (`int[]` becomes `int*`):

```cpp
#include <iostream>

// These two parameter declarations are completely identical to the compiler:
// void printArray(int arr[], int size)
// void printArray(int* arr, int size)
void printArray(const int arr[], int size) {
    // WARNING: Inside this function, sizeof(arr) returns the size of a POINTER (8 bytes),
    // NOT the size of the original array!
    for (int i = 0; i < size; ++i) {
        std::cout << arr[i] << " ";
    }
    std::cout << '\n';
}

int main() {
    int data[] = {5, 10, 15, 20, 25};
    int count = sizeof(data) / sizeof(data[0]);

    // We MUST pass the size explicitly because the function cannot know it!
    printArray(data, count);

    return 0;
}
```

> [!IMPORTANT]
> Because raw arrays decay into pointers when passed to functions, a function has no way of knowing how many elements the array contains. You must always pass the array length as a separate parameter.

---

## The Danger of Out-of-Bounds Access

C++ does **not** perform automatic bounds checking on raw array indexing for performance reasons:

```cpp
int numbers[3] = {10, 20, 30};

// Valid indices are 0, 1, 2.
// Reading or writing numbers[5] is an Out-Of-Bounds error!
std::cout << numbers[5]; // Reading unowned memory!
numbers[5] = 999;        // Memory corruption!
```

Accessing indices outside $[0, N-1]$ triggers **undefined behavior**. Your program might crash immediately with a segmentation fault, or worse, silently overwrite adjacent variables, leading to security vulnerabilities or corrupted data.

---

## Modern C++ Alternatives: `std::array` and `std::vector`

Because raw C-style arrays decay to pointers, lack bounds checking, and cannot be easily copied, modern C++ introduces standard container alternatives:

### 1. `std::array` (`#include <array>`)

A modern, type-safe wrapper over fixed-size stack arrays:

```cpp
#include <array>
#include <iostream>

int main() {
    std::array<int, 4> nums = {10, 20, 30, 40};

    // Knows its own size without decaying:
    std::cout << "Size: " << nums.size() << '\n';

    // Optional bounds checking using .at() (throws std::out_of_range on invalid index):
    std::cout << nums.at(2) << '\n';

    return 0;
}
```

### 2. `std::vector` (`#include <vector>`)

When you need an array that can grow or shrink dynamically at runtime, use `std::vector` (covered in our STL deep dives).

---

## Common Beginner Mistakes

1. **Off-by-One Indexing**: Forgetting that an array with 10 elements ends at index 9 (`arr[10]` is out of bounds).
2. **Calling `sizeof` on an Array Parameter Inside a Function**: Yields pointer size (typically 8 bytes), not the array length.
3. **Attempting to Reassign an Entire Array**:
   ```cpp
   int a[3] = {1, 2, 3};
   int b[3];
   b = a; // COMPILE ERROR: Array type 'int[3]' is not assignable!
   ```
4. **Using Non-Constant Variables for Raw Array Sizes**: In standard C++, raw array dimensions must be compile-time constants:
   ```cpp
   int n;
   std::cin >> n;
   int arr[n]; // Non-standard Variable Length Array (VLA)! Use std::vector instead.
   ```

---

## Best Practices

1. **Use Range-Based Loops**: They prevent out-of-bounds index errors completely.
2. **Prefer `std::array` over raw C-arrays**: For fixed-size collections, `std::array` provides size safety and copy semantics with zero performance cost.
3. **Always validate user indices**: Check `if (index >= 0 && index < size)` before indexing raw arrays with dynamic input.
4. **Pass arrays as `const` pointers when read-only**: Protect caller data by declaring `void process(const int arr[], int size)`.

---

## Summary

- An array stores a fixed-size sequence of elements of the same type in contiguous memory.
- Indexing starts at 0; accessing an element computes an address offset in $O(1)$ constant time.
- Passing an array to a function causes **array decay** into a pointer to its first element.
- C++ does not perform runtime bounds checking on raw arrays; out-of-bounds access causes undefined behavior.
- Modern C++ recommends `std::array` for fixed collections and `std::vector` for dynamic lists.

---

## Continue Learning C++

- **Previous Article:** [Functions in C++: Declaration, Scope, Overloading, and Parameters](/posts/cpp-functions/)
- **Next Article:** [Strings in C++: std::string vs C-Style Strings and Practical Operations](/posts/cpp-strings/)
- **Explore Topic Hub:** [C++ Programming & Systems Engineering](/topics/cpp/)
- **Related Advanced Container:** [Mastering std::list in Modern C++](/posts/list-in-cpp/)

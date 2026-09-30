---
title: "C++ Operators: Arithmetic, Logical, Bitwise, and Precedence Explained"
author: "Shafin Chowdhury"
pubDatetime: 2026-08-03T10:00:00+06:00
featured: false
draft: false
tags:
  - cpp
  - fundamentals
  - programming
description: "A comprehensive guide to C++ operators. Understand arithmetic, assignment, relational, logical, bitwise, and ternary operators, along with precedence and short-circuit evaluation."
---

Once you know how to declare variables and read input, you need to perform calculations, evaluate decisions, and manipulate data. In C++, these operations are performed using **operators**.

An operator is a special symbol that tells the compiler to perform a specific mathematical, relational, or logical computation on one, two, or three **operands**.

---

## What You'll Learn

- The 6 major operator categories in C++
- Arithmetic operators and the mechanics of integer division and modulo
- The critical difference between prefix (`++x`) and postfix (`x++`) increment
- Comparison and relational operators (and the `=` vs. `==` trap)
- Logical operators and how **short-circuit evaluation** prevents runtime crashes
- Bitwise operators: AND, OR, XOR, NOT, and bit shifts
- The ternary conditional operator (`?:`) as a concise expression
- How operator precedence and associativity govern complex expressions

---

## 1. Arithmetic Operators

Arithmetic operators perform standard mathematical operations on numeric data types:

| Operator | Name           | Syntax  | Description                   | Example ($a=14, b=4$)                 |
| :------- | :------------- | :------ | :---------------------------- | :------------------------------------ |
| `+`      | Addition       | `a + b` | Calculates the sum            | `14 + 4` $\rightarrow$ `18`           |
| `-`      | Subtraction    | `a - b` | Subtracts right from left     | `14 - 4` $\rightarrow$ `10`           |
| `*`      | Multiplication | `a * b` | Calculates the product        | `14 * 4` $\rightarrow$ `56`           |
| `/`      | Division       | `a / b` | Divides left by right         | `14 / 4` $\rightarrow$ `3` (Integer!) |
| `%`      | Modulo         | `a % b` | Returns the integer remainder | `14 % 4` $\rightarrow$ `2`            |

### Important Nuances: Division and Modulo

1. **Integer Division**: When both operands are integers, C++ performs integer division and drops (truncates) any fractional part toward zero. If you need fractional precision, cast at least one operand to a floating-point type:
   ```cpp
   int a = 7, b = 2;
   double div1 = a / b;                           // Evaluates to 3.0
   double div2 = static_cast<double>(a) / b;      // Evaluates to 3.5
   ```
2. **Modulo Operands**: The `%` operator requires integer operands. It cannot be used with `float` or `double` (for floating-point remainder, use `std::fmod` from `<cmath>`).
3. **Modulo with Negatives**: In C++11 and newer, `a % b` always has the same sign as the dividend `a` (`-7 % 3` is `-1`, whereas `7 % -3` is `1`).

---

## 2. Increment and Decrement Operators: Prefix vs. Postfix

C++ provides `++` and `--` to add or subtract `1` from an integer or pointer. However, the position of the operator determines _when_ the modification occurs:

### Prefix (`++x`, `--x`)

Modifies the value **first**, then returns the updated value:

```cpp
int x = 5;
int y = ++x; // x becomes 6, then y receives 6
```

### Postfix (`x++`, `x--`)

Creates a temporary copy of the original value, modifies `x`, and returns the **original unincremented value**:

```cpp
int a = 5;
int b = a++; // b receives 5, then a becomes 6
```

### Complete Example

```cpp
#include <iostream>

int main() {
    int counter = 10;

    std::cout << "Original: " << counter << '\n';
    std::cout << "Postfix (counter++): " << counter++ << '\n'; // Prints 10
    std::cout << "After postfix: " << counter << '\n';         // Prints 11
    std::cout << "Prefix (++counter): " << ++counter << '\n';   // Prints 12

    return 0;
}
```

> [!TIP]
> In modern C++, prefer **prefix** (`++i`) by default. For complex types like custom iterators or objects, prefix avoids creating an unnecessary temporary copy of the object before incrementing.

---

## 3. Assignment and Compound Operators

The simple assignment operator (`=`) stores the right-hand value into the left-hand variable. Compound assignment operators combine arithmetic with assignment:

```cpp
int score = 10;
score += 5; // Equivalent to: score = score + 5; (score is now 15)
score *= 2; // Equivalent to: score = score * 2; (score is now 30)
score %= 4; // Equivalent to: score = score % 4; (score is now 2)
```

Supported compound operators include: `+=`, `-=`, `*=`, `/=`, `%=`, `&=`, `|=`, `^=`, `<<=`, `>>=`.

---

## 4. Relational Operators

Relational operators compare two values and produce a boolean result (`true` or `false`):

| Operator | Meaning                  | Example (`x = 10, y = 20`) | Result  |
| :------- | :----------------------- | :------------------------- | :------ |
| `==`     | Equal to                 | `x == y`                   | `false` |
| `!=`     | Not equal to             | `x != y`                   | `true`  |
| `<`      | Less than                | `x < y`                    | `true`  |
| `>`      | Greater than             | `x > y`                    | `false` |
| `<=`     | Less than or equal to    | `x <= 10`                  | `true`  |
| `>=`     | Greater than or equal to | `y >= 25`                  | `false` |

> [!WARNING]
> Never confuse assignment (`=`) with equality comparison (`==`). Writing `if (x = 5)` assigns `5` to `x` and evaluates to `true`, rather than checking if `x` is five!

---

## 5. Logical Operators and Short-Circuit Evaluation

Logical operators combine or invert boolean expressions:

| Operator | Name        | Logic                                                           |
| :------- | :---------- | :-------------------------------------------------------------- |
| `&&`     | Logical AND | Returns `true` only if **both** operands are `true`             |
| `\|\|`   | Logical OR  | Returns `true` if **at least one** operand is `true`            |
| `!`      | Logical NOT | Inverts the boolean truth value (`!true` $\rightarrow$ `false`) |

### Short-Circuit Evaluation

In C++, logical expressions evaluate strictly from left to right, stopping as soon as the outcome is guaranteed:

1. For `A && B`: If `A` is `false`, `B` is **never evaluated** because the result must be `false`.
2. For `A || B`: If `A` is `true`, `B` is **never evaluated** because the result must be `true`.

Short-circuit evaluation is essential for writing safe code, such as checking pointer validity or array boundaries before accessing elements:

```cpp
int* ptr = nullptr;

// Safe! Because ptr != nullptr evaluates to false, *ptr == 10 is NEVER executed
if (ptr != nullptr && *ptr == 10) {
    std::cout << "Value matches!\n";
}
```

Without short-circuiting, dereferencing `*ptr` when `ptr` is `nullptr` would cause a fatal segmentation fault!

---

## 6. Bitwise Operators

Bitwise operators manipulate integers at the individual binary bit level. They are widely used in low-level systems programming, embedded firmware, cryptography, and game development flags.

| Operator | Name        | Operation                                                   | Example (8-bit)                                 |
| :------- | :---------- | :---------------------------------------------------------- | :---------------------------------------------- |
| `&`      | Bitwise AND | Bit is 1 if both corresponding bits are 1                   | `0101 & 0011` $\rightarrow$ `0001`              |
| `\|`     | Bitwise OR  | Bit is 1 if either corresponding bit is 1                   | `0101 \| 0011` $\rightarrow$ `0111`             |
| `^`      | Bitwise XOR | Bit is 1 if bits differ (exclusive OR)                      | `0101 ^ 0011` $\rightarrow$ `0110`              |
| `~`      | Bitwise NOT | Inverts all bits (one's complement)                         | `~00000101` $\rightarrow$ `11111010`            |
| `<<`     | Left Shift  | Shifts bits left, fills right with 0s (multiplies by $2^n$) | `00000101 << 1` $\rightarrow$ `00001010` (`10`) |
| `>>`     | Right Shift | Shifts bits right (divides by $2^n$ for non-negative)       | `00001010 >> 1` $\rightarrow$ `00000101` (`5`)  |

### Practical Bit Masking Example

```cpp
#include <iostream>

int main() {
    // Permission bit flags
    const unsigned char READ_PERMISSION    = 0b00000001; // 1
    const unsigned char WRITE_PERMISSION   = 0b00000010; // 2
    const unsigned char EXECUTE_PERMISSION = 0b00000100; // 4

    unsigned char userRole = 0;

    // Grant Read and Execute permissions using bitwise OR
    userRole |= (READ_PERMISSION | EXECUTE_PERMISSION);

    // Test for Write permission using bitwise AND
    bool canWrite = (userRole & WRITE_PERMISSION) != 0;
    bool canRead  = (userRole & READ_PERMISSION) != 0;

    std::cout << "Can Read:    " << std::boolalpha << canRead << '\n';
    std::cout << "Can Write:   " << canWrite << '\n';

    return 0;
}
```

### Output

```text
Can Read:    true
Can Write:   false
```

---

## 7. The Conditional (Ternary) Operator (`?:`)

The ternary operator is C++'s only three-operand operator. It evaluates a boolean condition and returns one of two expressions:

$$\text{condition } \mathbf{?} \text{ expression\_if\_true } \mathbf{:} \text{ expression\_if\_false}$$

```cpp
int a = 15, b = 25;
int maxVal = (a > b) ? a : b; // maxVal is assigned 25
```

The ternary operator is especially useful for initializing `const` variables that depend on a simple condition:

```cpp
const double taxRate = isExempt ? 0.0 : 0.0825;
```

---

## Operator Precedence and Associativity

When multiple operators appear in a single expression, **precedence** dictates which operator is evaluated first. **Associativity** determines the order of evaluation for operators with identical precedence (usually Left-to-Right or Right-to-Left).

### Precedence Hierarchy (Highest to Lowest)

| Precedence Group    | Operators                                                           | Associativity     |
| :------------------ | :------------------------------------------------------------------ | :---------------- |
| 1. Scope Resolution | `::`                                                                | Left-to-Right     |
| 2. Postfix / Calls  | `()`, `[]`, `->`, `.`, `x++`, `x--`                                 | Left-to-Right     |
| 3. Unary / Prefix   | `++x`, `--x`, `+`, `-`, `!`, `~`, `sizeof`, `*` (deref), `&` (addr) | **Right-to-Left** |
| 4. Multiplicative   | `*`, `/`, `%`                                                       | Left-to-Right     |
| 5. Additive         | `+`, `-`                                                            | Left-to-Right     |
| 6. Bitwise Shifts   | `<<`, `>>`                                                          | Left-to-Right     |
| 7. Relational       | `<`, `<=`, `>`, `>=`                                                | Left-to-Right     |
| 8. Equality         | `==`, `!=`                                                          | Left-to-Right     |
| 9. Bitwise AND      | `&`                                                                 | Left-to-Right     |
| 10. Bitwise XOR     | `^`                                                                 | Left-to-Right     |
| 11. Bitwise OR      | `\|`                                                                | Left-to-Right     |
| 12. Logical AND     | `&&`                                                                | Left-to-Right     |
| 13. Logical OR      | `\|\|`                                                              | Left-to-Right     |
| 14. Conditional     | `?:`                                                                | **Right-to-Left** |
| 15. Assignment      | `=`, `+=`, `-=`, `*=`, `/=`, etc.                                   | **Right-to-Left** |

### The Golden Rule of Precedence: Use Parentheses

Instead of attempting to memorize subtle precedence quirks (such as whether `&` binds tighter than `==`), **always use parentheses `()`** to make your intent crystal clear to the compiler and fellow programmers:

```cpp
// Ambiguous and error-prone:
if (flags & MASK == EXPECTED) // '==' binds tighter than '&'! Bug!

// Clear, unambiguous, and correct:
if ((flags & MASK) == EXPECTED)
```

---

## Common Beginner Mistakes

1. **Confusing `=` with `==`**: Writing `if (status = 1)` assigns `1` to `status` and always evaluates to `true`.
2. **Confusing Bitwise and Logical Operators**: Using single `&` or `|` when you intended boolean `&&` or `||`. Bitwise operators do not short-circuit.
3. **Modifying Variables Multiple Times in a Single Expression**: Writing expressions like `x = x++ + ++x;` produces unsequenced modifications, resulting in undefined behavior.
4. **Neglecting Operator Precedence**: Relying on unparenthesized complex expressions leads to silent logical calculation errors.

---

## Summary

- Arithmetic operators (`+`, `-`, `*`, `/`, `%`) handle standard numeric computation.
- Prefix (`++i`) updates before returning the value; postfix (`i++`) makes a temporary copy first.
- Logical operators (`&&`, `||`, `!`) feature short-circuit evaluation, enabling safe pointer and bounds checks.
- Bitwise operators (`&`, `|`, `^`, `~`, `<<`, `>>`) manipulate data at the individual bit level.
- Always use parentheses `()` to eliminate operator precedence ambiguity.

---

## Continue Learning C++

- **Previous Article:** [C++ Input and Output: cin, cout, getline, and Stream Formatting](/posts/cpp-input-and-output/)
- **Next Article:** [Conditional Statements in C++: if, else if, else, and switch](/posts/cpp-conditional-statements/)
- **Explore Topic Hub:** [C++ Programming & Systems Engineering](/topics/cpp/)

---
title: "How I Cut My Palindrome Algorithm’s Execution Time in Half"
author: "Shafin Chowdhury"
pubDatetime: 2026-06-10T10:11:00+06:00
featured: true
draft: false
tags:
  - memory
  - memory-allocation
  - c
  - memory-handaling
  - memory-with-no-limitation
description: "Proper view of memory allocation dynamicly."
---


# The Secret to Lightning-Fast Code: Overcoming the Palindrome Trap

We've all been there. It's late at night, your eyes are blurry, and you're staring at your screen. You're working on a coding problem, but your program keeps running too slowly because the numbers involved are enormous.

That was exactly the situation I faced a few days ago while solving a problem that required checking whether very large numbers were palindromes.

A **palindrome** is a number that reads the same forward and backward, such as:

- `12321`
- `11`
- `4554`

At first, the solution seemed straightforward. But as the numbers grew larger, performance became a serious issue. After experimenting with several approaches, I discovered a simple mathematical optimization that dramatically improved execution speed.

Let's walk through the evolution of the solution.

---

## The simplest Approach: Reverse the Entire Number

The most intuitive solution is to reverse the entire number and compare it with the original.

```cpp
bool isPalindromeBruteForce(long long int n) {
    long long int original = n;
    long long int reversed = 0;

    while (n > 0) {
        long long int digit = n % 10;
        reversed = reversed * 10 + digit;
        n /= 10;
    }

    return original == reversed;
}
```

### How It Works

1. Store the original number.
2. Extract digits one by one using `% 10`.
3. Build a reversed version of the number.
4. Compare the reversed number with the original.

### The Problem

Although this method is correct, it processes **every digit** of the number.

For a single number, that's fine. But when checking thousands or millions of large numbers, the repeated digit-by-digit reversal becomes unnecessarily expensive.

---

## The String Conversion Trap

A common idea is to convert the number into a string and compare characters from both ends.

This often feels cleaner and easier to understand.

```cpp
bool isPalindromeString(long long int n) {
    string numstring = to_string(n);

    if(numstring[0] != numstring[numstring.length() - 1]) {
        return false;
    }

    long long int original = n;
    long long int reversed = 0;

    while (n > 0) {
        long long int digit = n % 10;
        reversed = reversed * 10 + digit;
        n /= 10;
    }

    return original == reversed;
}
```

### Why This Is Problematic

#### It Adds Unnecessary Overhead

Calling `to_string()` creates a new string object in memory.

For a small number of checks, this overhead is negligible. However, inside performance-critical loops, repeated string allocations can significantly slow down execution.

In short:

> Converting numbers to strings may simplify the code, but it doesn't necessarily make the program faster.

---

## The Meet-in-the-Middle Optimization

Here's the key observation:

For a number to be a palindrome, its left half must mirror its right half.

So why reverse the entire number?

Instead, we can reverse **only half of the digits** and stop as soon as we've reached the middle.

This reduces the amount of work by roughly half.

### The Idea

1. Take the last digit using `% 10`.
2. Append it to a reversed-half variable.
3. Remove that digit from the original number using `/ 10`.
4. Continue until the reversed half becomes greater than or equal to the remaining original half.

At that point, we've reached the middle of the number.

---

## The Optimized Solution

```cpp
bool isPalindrome(long long int n) {
    // Negative numbers and numbers ending with 0
    // (except 0 itself) cannot be palindromes
    if (n < 0 || (n % 10 == 0 && n != 0)) {
        return false;
    }

    long long int reverse = 0;

    while (n > reverse) {
        reverse = reverse * 10 + (n % 10);
        n /= 10;
    }

    return (n == reverse) || (n == reverse / 10);
}
```

---

## Why It Works

### Even-Length Palindromes

Example:

```text
1221
```

After processing half the digits:

```text
n       = 12
reverse = 12
```

Since:

```cpp
n == reverse
```

the number is a palindrome.

### Odd-Length Palindromes

Example:

```text
12321
```

After processing:

```text
n       = 12
reverse = 123
```

The middle digit (`3`) doesn't matter.

Removing it:

```cpp
reverse / 10
```

gives:

```text
12
```

Now:

```cpp
n == reverse / 10
```

which confirms the palindrome.

---

## Complexity Analysis

| Approach | Time Complexity | Extra Memory |
|-----------|----------------|--------------|
| Full Reversal | O(d) | O(1) |
| String Conversion | O(d) | O(d) |
| Half Reversal | O(d/2) ≈ O(d) | O(1) |

Where **d** is the number of digits.

Although both mathematical approaches have linear time complexity, the half-reversal method performs substantially fewer operations in practice, making it noticeably faster.

---

## Key Takeaways

- Avoid converting numbers to strings when a mathematical solution exists.
- String operations introduce additional memory allocations and processing overhead.
- Look for opportunities to stop computations early instead of processing the entire input.
- For palindrome checking, reversing only half the digits is sufficient.
- Small algorithmic improvements can produce significant performance gains when executed repeatedly.

## Final Thoughts

Writing faster code is rarely about writing more code—it's about writing smarter code.

The next time you're solving a numerical problem, ask yourself:

> Do I really need to process the entire value?

Often, a clever observation can eliminate half the work, reduce memory usage, and make your solution significantly more efficient.

In the case of palindrome detection, the simple "meet-in-the-middle" strategy transforms a straightforward solution into a highly optimized one without sacrificing readability.



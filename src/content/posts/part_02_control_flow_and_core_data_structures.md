---
title: "Python: Control Flow and Core Data Structures"
author: "Shafin Chowdhury"
pubDatetime: 2026-09-30T21:00:00+06:00
featured: true
draft: true
tags:
  - python
  - programming
  - fundamentals
  - data-structures
description: "A comprehensive guide to Python control flow and core data structures covering branching conditionals, loops, lists, tuples, sets, dictionaries, comprehensions, and Big-O performance."
---

# Part 2 — Control Flow and Core Data Structures

In this chapter, we expand beyond linear, top-to-bottom execution to build dynamic, intelligent programs. You will learn how Python makes decisions through branching conditionals, repeats work through loops, and organizes complex data using Python's four foundational built-in data structures: **Lists**, **Tuples**, **Sets**, and **Dictionaries**, culminating in Pythonic **Comprehensions**.

---

## Topics Covered in This Guide

1. [**Conditional Statements & Truthiness**](#1-conditional-statements--truthiness) — Branching logic (`if`, `elif`, `else`), ternary operators, and Python's strict truthiness evaluation model.
2. [**Loops: `for`, `while`, and Loop Control**](#2-loops-for-while-and-loop-control) — Repetition paradigms, generator-backed `range()`, loop jumps (`break`, `continue`, `pass`), and the loop `else` clause.
3. [**Lists: Dynamic, Mutable Sequences**](#3-lists-dynamic-mutable-sequences) — In-depth indexing, slicing, mutability, in-place methods, aliasing vs shallow vs deep copying.
4. [**Tuples: Immutable Sequences**](#4-tuples-immutable-sequences) — Immutability, hashability, tuple packing, and advanced star unpacking (`*rest`).
5. [**Sets: Unique, Unordered Hash Collections**](#5-sets-unique-unordered-hash-collections) — Hash-table backed $O(1)$ membership testing, set theory operations (union, intersection, difference, symmetric difference).
6. [**Dictionaries: Key-Value Hash Maps**](#6-dictionaries-key-value-hash-maps) — Key-value mapping, hashable key constraints, safe retrieval with `.get()`, dict iteration, and nesting.
7. [**Comprehensions: The Pythonic Data Pipeline**](#7-comprehensions-the-pythonic-data-pipeline) — Transforming and filtering lists, sets, and dictionaries with concise, high-performance syntax.
8. [**Master Comparison Matrix**](#8-master-comparison-matrix) — Comprehensive cheat sheet comparing order, mutability, duplicate handling, and Big-O performance.
9. [**Common Mistakes & Misconceptions**](#9-common-mistakes--misconceptions) — Mutating lists during iteration, mutable default arguments, set literal gotchas, and `KeyError` avoidance.
10. [**Summary**](#summary) — Core takeaways, memory mechanics, and architectural mental models.
11. [**Quick Reference**](#quick-reference) — High-yield syntax summary table and operation cheat sheet.
12. [**Practice Problems (3 Levels)**](#practice-problems) — Hands-on problem sets from basic to challenge level with hints.
13. [**Mini-Project: Student Academic Performance Analyzer**](#mini-project-student-academic-performance-analyzer) — Full interactive end-to-end Python CLI application.

---

## 1. Conditional Statements & Truthiness

### 1. What is it?

Conditional statements control execution paths based on boolean evaluations (`True` or `False`).

### 2. Syntax

```python
if condition_1:
    # Executes when condition_1 is True
    ...
elif condition_2:
    # Executes when condition_1 is False AND condition_2 is True
    ...
else:
    # Executes when ALL preceding conditions are False
    ...
```

### 3. Truth Value Testing (Truthy vs Falsy)

In Python, every object has an inherent boolean truth value. You do not need to write `if len(items) > 0:` or `if flag == True:`.

#### Objects Considered Falsy in Python:

- Constants: `None`, `False`
- Numeric zeros: `0`, `0.0`, `0j`, `Decimal(0)`, `Fraction(0, 1)`
- Empty sequences and collections: `""`, `()`, `[]`, `{}`, `set()`, `range(0)`

Everything else is considered **Truthy**.

```python
# Idiomatic Truthiness Check
cart = []

if not cart:
    print("Your shopping cart is empty!")  # Executes because [] is falsy
```

### 4. Ternary Conditional Expression

Python provides a clean inline conditional expression:

```python
# syntax: value_if_true if condition else value_if_false
age = 19
status = "Adult" if age >= 18 else "Minor"
```

---

## 2. Loops: `for`, `while`, and Loop Control

### 1. The `for` Loop & `range()`

Python's `for` loop is actually a **for-each** iterator that traverses elements of any iterable.

```python
# range(start, stop[, step]) -> generates numbers from start to (stop - 1)
for i in range(1, 10, 2):
    print(i, end=" ")
# Output: 1 3 5 7 9
```

### 2. The `while` Loop

Repeats as long as a condition remains true. Always ensure an update step occurs to avoid infinite loops:

```python
countdown = 3
while countdown > 0:
    print(countdown)
    countdown -= 1
print("Blast off!")
```

### 3. Loop Control: `break`, `continue`, `pass`

- `break`: Terminates the innermost loop immediately.
- `continue`: Skips the rest of the current iteration and jumps to the next loop cycle.
- `pass`: A null statement used as a syntactic placeholder where code is required.

```python
for num in range(1, 10):
    if num % 2 == 0:
        continue  # Skip even numbers
    if num == 7:
        break     # Stop loop when 7 is reached
    print(num, end=" ")
# Output: 1 3 5
```

### 4. The Loop `else` Clause

Python provides a unique and powerful construct: an `else` block attached directly to a `for` or `while` loop.

> **Rule:** The loop `else` block executes **ONLY if the loop completed normally without encountering a `break`**.

```python
# Prime number search
target = 13

for divisor in range(2, target):
    if target % divisor == 0:
        print(f"{target} is divisible by {divisor}, not prime.")
        break
else:
    # This runs only if no 'break' was hit!
    print(f"{target} is a prime number!")
```

---

## 3. Lists: Dynamic, Mutable Sequences

### 1. What is a List?

A list is an ordered, mutable collection of arbitrary Python objects. Internally, CPython implements lists as dynamic arrays of pointers.

### 2. Creation, Indexing, and Slicing

```python
fruits = ["apple", "banana", "cherry", "date"]

# Indexing (0-based and negative)
print(fruits[0])    # 'apple'
print(fruits[-1])   # 'date'

# Slicing: [start:stop:step]
print(fruits[1:3])  # ['banana', 'cherry'] (stop index 3 is non-inclusive)
print(fruits[::-1]) # ['date', 'cherry', 'banana', 'apple'] (reversed copy)
```

### 3. List Mutation Methods

```python
items = [10, 20, 30]

# Adding items
items.append(40)        # [10, 20, 30, 40] (Appends single item to end)
items.extend([50, 60])  # [10, 20, 30, 40, 50, 60] (Appends all iterable items)
items.insert(1, 15)     # [10, 15, 20, 30, 40, 50, 60] (Inserts at index 1)

# Removing items
items.remove(15)        # Removes first matching value 15
popped_val = items.pop()# Removes and returns last element (60)
popped_at = items.pop(0)# Removes and returns element at index 0 (10)
del items[0]            # Deletes element at index 0

# Ordering
scores = [42, 12, 88, 55]
scores.sort()           # In-place sort: [12, 42, 55, 88]
scores.sort(reverse=True) # In-place descending sort
scores.reverse()        # In-place reversal
```

> **Warning (`append` vs `extend`):**
> `items.append([1, 2])` nests the list inside: `[..., [1, 2]]`.
> `items.extend([1, 2])` flattens the items: `[..., 1, 2]`.

### 4. Aliasing vs Shallow Copy vs Deep Copy

```python
# 1. Aliasing (Both variables point to the exact same list in memory)
original = [1, 2, [3, 4]]
alias = original
alias.append(99)
print(original)  # [1, 2, [3, 4], 99] -> Original was modified!

# 2. Shallow Copy (Copies top-level references, but nested objects remain shared)
shallow = original.copy()  # or original[:]
shallow[0] = 500           # Modifies only shallow
shallow[2].append(777)     # Modifies nested list in BOTH shallow and original!
print(original[2])         # [3, 4, 777]

# 3. Deep Copy (Recursively clones every nested container)
import copy
deep = copy.deepcopy(original)
deep[2].append(999)
print(original[2])         # [3, 4, 777] -> Original remains completely isolated!
```

---

## 4. Tuples: Immutable Sequences

### 1. What is a Tuple?

A tuple is an ordered, immutable collection. Once created, elements cannot be added, removed, or reassigned.

### 2. Creation and the Single-Element Gotcha

```python
# Standard creation
point = (10, 20)
empty_tuple = ()

# CRITICAL GOTCHA: Single-element tuple requires a trailing comma!
not_a_tuple = (42)    # Evaluates to int: 42
is_a_tuple = (42,)    # Correct tuple of length 1
```

### 3. Tuple Packing and Unpacking

```python
# Packing
user_data = "Shafin", 23, "Engineer"  # Parentheses are optional

# Unpacking
name, age, profession = user_data
print(name, age)  # Shafin 23

# Star Unpacking (Python 3+)
numbers = [1, 2, 3, 4, 5, 6]
first, *middle, last = numbers
print(first)   # 1
print(middle)  # [2, 3, 4, 5] (Captured as a list)
print(last)    # 6
```

### 4. Why Use Tuples Instead of Lists?

1. **Safety**: Guarantee data cannot be accidentally mutated by downstream code.
2. **Performance**: Tuples use less memory than lists and optimize small-tuple allocations.
3. **Hashability**: Because they are immutable, tuples can be used as dictionary keys and set elements (provided their contents are also immutable).

---

## 5. Sets: Unique, Unordered Hash Collections

### 1. What is a Set?

A set is an unordered collection of unique, hashable objects. Sets are backed by hash tables, giving them average-case $O(1)$ time complexity for additions, deletions, and membership checks (`val in my_set`).

### 2. Creation and Modification

```python
# Creating sets
numbers = {1, 2, 3, 3, 2, 1}
print(numbers)  # {1, 2, 3} (Duplicates automatically dropped)

# Empty set gotcha:
empty_dict = {}       # This is a dict!
empty_set = set()     # This is an empty set

# Adding and removing
colors = {"red", "green"}
colors.add("blue")
colors.discard("yellow")  # Safe: does nothing if item does not exist
# colors.remove("yellow") # Raises KeyError if item is not found
```

### 3. Mathematical Set Operations

```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

# Union: items in either a or b
print(a | b)              # {1, 2, 3, 4, 5, 6}
print(a.union(b))

# Intersection: items in both a and b
print(a & b)              # {3, 4}
print(a.intersection(b))

# Difference: items in a but not in b
print(a - b)              # {1, 2}
print(a.difference(b))

# Symmetric Difference: items in a or b, but not both
print(a ^ b)              # {1, 2, 5, 6}
print(a.symmetric_difference(b))

# Subsets and Supersets
c = {1, 2}
print(c.issubset(a))      # True (c <= a)
print(a.issuperset(c))    # True (a >= c)
```

---

## 6. Dictionaries: Key-Value Hash Maps

### 1. What is a Dictionary?

A dictionary (`dict`) is an associative container that maps unique, hashable keys to arbitrary values. In Python 3.7+, dictionaries are guaranteed to maintain their insertion order.

### 2. Key Requirements

Keys **must be hashable** (immutable types like `str`, `int`, `float`, `tuple` containing immutable items). Lists and dicts cannot be keys.

### 3. Accessing and Modifying

```python
student = {
    "name": "Shafin",
    "major": "Computer Science",
    "gpa": 3.92
}

# Accessing keys
print(student["name"])  # 'Shafin'
# print(student["id"])  # Raises KeyError if key is missing!

# Safe retrieval using .get(key, default)
student_id = student.get("id", "N/A")
print(student_id)  # 'N/A'

# Adding / Updating
student["gpa"] = 3.95           # Updates existing key
student["semester"] = "Fall"    # Adds new key
student.update({"id": "ST-101", "campus": "Main"})

# Deletion
removed_gpa = student.pop("gpa")# Removes key and returns value
del student["campus"]           # Deletes key
```

### 4. Iterating Over Dictionaries

```python
inventory = {"laptops": 12, "monitors": 25, "keyboards": 40}

# Iterating keys (default)
for item in inventory:
    print(item, end=" ")
# laptops monitors keyboards

# Iterating values
for count in inventory.values():
    print(count, end=" ")

# Iterating key-value pairs (idiomatic)
for item, count in inventory.items():
    print(f"{item} -> {count}")
```

---

## 7. Comprehensions: The Pythonic Data Pipeline

Comprehensions provide a concise syntax for transforming, filtering, and constructing collections in a single expressive line.

### 1. List Comprehensions

```python
# Traditional approach
squares = []
for x in range(1, 6):
    squares.append(x ** 2)

# Idiomatic List Comprehension
# Syntax: [expression for item in iterable if condition]
squares = [x ** 2 for x in range(1, 6)]
print(squares)  # [1, 4, 9, 16, 25]

# With Filtering: Even squares only
even_squares = [x ** 2 for x in range(1, 10) if x % 2 == 0]
print(even_squares)  # [4, 16, 36, 64]

# Conditional Expression inside Comprehension
# [val_if_true if cond else val_if_false for item in iterable]
labels = ["EVEN" if x % 2 == 0 else "ODD" for x in range(5)]
print(labels)  # ['EVEN', 'ODD', 'EVEN', 'ODD', 'EVEN']
```

### 2. Set & Dictionary Comprehensions

```python
# Set Comprehension (extract unique lengths of words)
words = ["python", "is", "awesome", "python", "code"]
unique_lengths = {len(w) for w in words}
print(unique_lengths)  # {2, 4, 6, 7}

# Dictionary Comprehension (swap keys and values)
original_dict = {"a": 1, "b": 2, "c": 3}
inverted_dict = {value: key for key, value in original_dict.items()}
print(inverted_dict)  # {1: 'a', 2: 'b', 3: 'c'}
```

---

## 8. Master Comparison Matrix

| Data Structure | Syntax       | Ordered?   | Mutable? | Allows Duplicates?    | Element Lookup Cost | Practical Best Use Case                          |
| :------------- | :----------- | :--------- | :------- | :-------------------- | :------------------ | :----------------------------------------------- |
| **List**       | `[1, 2, 3]`  | Yes        | Yes      | Yes                   | $O(N)$ linear scan  | Dynamic ordered collections, stacks, queues      |
| **Tuple**      | `(1, 2, 3)`  | Yes        | No       | Yes                   | $O(N)$ linear scan  | Fixed records, dict keys, function multi-returns |
| **Set**        | `{1, 2, 3}`  | No         | Yes      | No                    | **$O(1)$ constant** | De-duplication, fast membership checking         |
| **Dictionary** | `{"k": "v"}` | Yes (3.7+) | Yes      | Keys: No, Values: Yes | **$O(1)$ constant** | Keyed indexing, caches, entity representations   |

---

## 9. Common Mistakes & Misconceptions

1. **`=` vs `==`**:
   `=` is assignment; `==` is equality comparison.
2. **Modifying a collection while iterating over it**:

   ```python
   # BUG: Modifying list during iteration skips elements!
   numbers = [1, 2, 3, 4, 5]
   for n in numbers:
       if n % 2 == 0:
           numbers.remove(n)

   # FIX: Iterate over a copy or use a comprehension:
   numbers = [n for n in numbers if n % 2 != 0]
   ```

3. **Empty Collection Creation Bug**:
   Remember that `{}` creates an empty dictionary, not an empty set. Always use `set()`.
4. **Defaulting `dict[key]` instead of `.get()`**:
   Accessing missing keys directly throws `KeyError`. Always use `.get(key, default)` when the key is uncertain.

---

## Summary

- Truthiness governs conditional branching: empty containers and zero values evaluate to `False`.
- The loop `else` block runs only when a loop finishes naturally without triggering a `break`.
- Lists are mutable dynamic arrays; modifying copies requires `copy.deepcopy()` when nested structures are present.
- Tuples are immutable and hashable, making them ideal for fixed records and dictionary keys.
- Sets and dictionaries leverage hash tables to provide instantaneous $O(1)$ lookups.
- Comprehensions replace cumbersome multi-line `for` loops with expressive, high-speed data pipelines.

---

## Quick Reference

| Operation              | Code Snippet                   | Output / Behavior            |
| :--------------------- | :----------------------------- | :--------------------------- |
| Ternary operator       | `x = "yes" if flag else "no"`  | Conditional assignment       |
| Unpack with star       | `a, *rest, b = [1, 2, 3, 4]`   | `a=1`, `rest=[2, 3]`, `b=4`  |
| Safe Dict Retrieval    | `d.get("missing", 0)`          | Returns `0` without KeyError |
| Remove from Set safely | `s.discard("unknown")`         | Does not raise KeyError      |
| List Comprehension     | `[x*2 for x in nums if x > 0]` | Transforms and filters       |
| Dict Comprehension     | `{k: v for k, v in pairs}`     | Constructs dict from pairs   |

---

## Practice Problems

### Level 1 — Basic

1. Given a list of numbers `[12, 45, 2, 9, 88, 34]`, use a single `for` loop to find and print the minimum and maximum values without using `min()` or `max()`.
2. Take a string with duplicate characters (e.g. `"abracadabra"`) and print the unique characters in alphabetical order using a set and `sorted()`.

### Level 2 — Intermediate

3. Given a dictionary of student grades `scores = {"Alice": 85, "Bob": 62, "Charlie": 91, "Diana": 74}`, write a dictionary comprehension that creates a new dictionary containing only students with passing grades (`>= 70`), mapping their names to `"PASS"`.
4. Implement a palindrome checker that ignores spaces, punctuation, and letter casing (e.g., `"A man, a plan, a canal: Panama"` should return `True`) using list comprehension or string filtering.

### Level 3 — Challenge

5. Write a two-sum lookup algorithm: Given a list of integers `nums = [2, 7, 11, 15]` and a target `target = 9`, use a dictionary to find the indices of the two numbers that add up to `target` in a single $O(N)$ pass.

### Hints

- _Problem 3_: `{name: "PASS" for name, score in scores.items() if score >= 70}`.
- _Problem 4_: Use `clean = [c.lower() for c in text if c.isalnum()]`, then check `clean == clean[::-1]`.
- _Problem 5_: For each number, calculate `complement = target - num`. If `complement` exists in `seen_dict`, return `[seen_dict[complement], current_index]`. Otherwise, store `seen_dict[num] = current_index`.

---

## Mini-Project: Student Academic Performance Analyzer

Save and run this complete Python script as `grade_analyzer.py`:

```python
"""
Part 2 Mini-Project: Academic Performance & Grading CLI Engine
Demonstrates: conditionals, loops, dictionaries, lists, sets, and comprehensions.
"""

# Student records dataset
classroom_data = [
    {"id": "S101", "name": "Alice Johnson",  "scores": [88, 92, 79, 95]},
    {"id": "S102", "name": "Bob Smith",      "scores": [55, 60, 58, 62]},
    {"id": "S103", "name": "Charlie Davis",  "scores": [95, 98, 92, 100]},
    {"id": "S104", "name": "Diana Prince",   "scores": [72, 75, 80, 68]},
    {"id": "S105", "name": "Evan Wright",    "scores": [40, 52, 48, 45]},
]

def calculate_letter_grade(avg: float) -> str:
    """Computes academic letter grade based on standard scale."""
    if avg >= 90:
        return "A"
    elif avg >= 80:
        return "B"
    elif avg >= 70:
        return "C"
    elif avg >= 60:
        return "D"
    else:
        return "F"

print("=" * 65)
print("       ACADEMIC PERFORMANCE & GRADE BOOK REPORT        ")
print("=" * 65)

# Process students and collect analytics
processed_records = []
all_student_averages = []

for student in classroom_data:
    scores = student["scores"]
    average_score = sum(scores) / len(scores)
    letter_grade = calculate_letter_grade(average_score)
    is_honor_roll = average_score >= 90

    student_summary = {
        "id": student["id"],
        "name": student["name"],
        "average": round(average_score, 2),
        "grade": letter_grade,
        "honor": is_honor_roll
    }
    processed_records.append(student_summary)
    all_student_averages.append(average_score)

# Formatted Table Output
print(f"{'ID':<6} | {'Student Name':<16} | {'Average':<8} | {'Grade':<6} | {'Honor Roll':<10}")
print("-" * 65)

for record in processed_records:
    honor_flag = "★ YES" if record["honor"] else "  NO"
    print(f"{record['id']:<6} | {record['name']:<16} | {record['average']:<8.2f} | {record['grade']:<6} | {honor_flag:<10}")

# Class-level Analytics using Comprehensions
class_mean = sum(all_student_averages) / len(all_student_averages)
honor_students = [r["name"] for r in processed_records if r["honor"]]
at_risk_students = [r["name"] for r in processed_records if r["grade"] == "F"]
unique_grades = sorted({r["grade"] for r in processed_records})

print("=" * 65)
print(f"Class Average Performance : {class_mean:.2f}%")
print(f"Unique Grades Assigned    : {', '.join(unique_grades)}")
print(f"Honor Roll Recipients     : {', '.join(honor_students) if honor_students else 'None'}")
print(f"At-Risk Students (Need Help): {', '.join(at_risk_students) if at_risk_students else 'None'}")
print("=" * 65)
```

---

## What Comes Next?

In **Part 3 — Functions and Modular Programming**, we introduce code reuse, function signatures, `*args` and `**kwargs`, the LEGB scope rule, closures, first-class functions, recursion, and packaging reusable modules with `__init__.py`.

---

[← Part 1 — Python Fundamentals](part_01_python_fundamentals.md) | **Part 2 — Control Flow & Data Structures** | [Part 3 — Functions & Modular Programming →](part_03_functions_and_modular_programming.md)

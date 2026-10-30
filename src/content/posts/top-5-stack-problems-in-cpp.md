---
title: "Top 5 Famous Stack Problems in Competitive Programming (With C++ Solutions)"
author: "Shafin Chowdhury"
pubDatetime: 2026-10-30T14:00:00+06:00
featured: true
draft: false
tags:
  - cpp
  - data-structures
  - stack
  - competitive-programming
  - algorithms
  - leetcode
description: "Master the 5 most famous Stack problems in competitive programming and coding interviews: Valid Parentheses, Min Stack, Next Greater Element, Daily Temperatures, and Largest Rectangle in Histogram—complete with C++ code, dry runs, and monotonic stack diagrams."
---

Understanding how a [Stack works](/posts/understanding-stack-in-cpp/) and how to build one using a [Vector](/posts/stack-using-vector-in-cpp/), [Array](/posts/stack-using-array-in-cpp/), or [Linked List](/posts/stack-using-linked-list-in-cpp/) gives you the foundation. However, in competitive programming and technical interviews, the real challenge is **recognizing when a problem is secretly a Stack problem**—and knowing how to use techniques like **Monotonic Stacks** to turn a slow $O(n^2)$ brute-force loop into a fast $O(n)$ solution.

In this guide, we will solve **5 famous Stack problems** carefully selected so that each problem teaches you a **completely different Stack pattern**:

1. **Valid Parentheses** — *Nested Pair Matching*
2. **Min Stack** — *Auxiliary State Tracking in $O(1)$*
3. **Next Greater Element** — *The Monotonic Decreasing Stack Pattern*
4. **Daily Temperatures** — *Storing Array Indices in a Monotonic Stack*
5. **Largest Rectangle in Histogram** — *Two-Sided Boundary Expansion with a Monotonic Increasing Stack*

> **Part of the Stack Series:** This article is **Step 5** of our [Stack in C++: Complete Beginner-to-Advanced Guide](/topics/stack/).

---

## Problem 1: Valid Parentheses

- **Platform & Link:** [LeetCode #20 — Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)
- **Core Technique:** Nested Bracket Matching using LIFO

### 1. Problem Statement Summary
Given a string `s` containing only the bracket characters `'('`, `')'`, `'{'`, `'}'`, `'['`, and `']'`, determine whether the input string is **valid**.

A string is valid if:
1. Every opening bracket is closed by the **same type** of closing bracket.
2. Opening brackets are closed in the **correct nested order**.
3. Every closing bracket has a corresponding opening bracket before it.

### 2. Example Input and Output
- **Example 1:** `s = "{[()]}"` $\rightarrow$ **Output:** `Valid` (`true`)
- **Example 2:** `s = "([)]"` $\rightarrow$ **Output:** `Invalid` (`false` — `[` was opened inside `(`, so `]` must close before `)`)
- **Example 3:** `s = "((("` $\rightarrow$ **Output:** `Invalid` (`false` — unclosed opening brackets remain)

### 3. Why Is a Stack Useful Here?
When you read a nested expression from left to right, the **last** bracket you open must be the **first** bracket you close:

```text
String:   {   [   (   )   ]   }
          |   |   |   ^   ^   ^
          |   |   +---+   |   |  <-- Innermost '(' opened LAST, closed FIRST
          |   +-----------+   |  <-- Middle '[' closed SECOND
          +-------------------+  <-- Outermost '{' opened FIRST, closed LAST
```

"Last Opened, First Closed" is literally **Last In, First Out (LIFO)**!

### 4. Step-by-Step Approach
1. Create an empty stack of characters: `stack<char> st;`.
2. Loop through every character `ch` in the string `s`:
   - **If `ch` is an opening bracket** (`'('`, `'{'`, or `'['`), push it onto the stack.
   - **If `ch` is a closing bracket** (`')'`, `'}'`, or `']'`):
     - First check if the stack is empty. If it is empty, there is no matching opening bracket—return `false` immediately.
     - Otherwise, inspect `st.top()`. If `st.top()` is the matching opening bracket for `ch`, call `st.pop()`. If it does not match, return `false`.
3. After the loop finishes, check `st.empty()`. If the stack is completely empty, every opening bracket was matched and closed (`true`). If any brackets remain in the stack, return `false`.

### 5. Complete C++ Solution

```cpp
#include <iostream>
#include <stack>
#include <string>

using namespace std;

bool isValidParentheses(string s) {
    stack<char> st;

    for (int i = 0; i < s.length(); i++) {
        char ch = s[i];

        // 1. If it is an opening bracket, push onto stack
        if (ch == '(' || ch == '{' || ch == '[') {
            st.push(ch);
        } 
        // 2. Otherwise it is a closing bracket
        else {
            // If stack is empty, there is no opening bracket to match with
            if (st.empty()) {
                return false;
            }

            char topBracket = st.top();

            // Check if the closing bracket matches the most recent opening bracket
            if ((ch == ')' && topBracket == '(') ||
                (ch == '}' && topBracket == '{') ||
                (ch == ']' && topBracket == '[')) {
                st.pop();
            } else {
                return false; // Mismatched bracket types
            }
        }
    }

    // Valid only if no unclosed opening brackets remain
    if (st.empty()) {
        return true;
    } else {
        return false;
    }
}

int main() {
    string test1 = "{[()]}";
    string test2 = "([)]";

    if (isValidParentheses(test1)) {
        cout << test1 << " is Valid" << endl;
    } else {
        cout << test1 << " is Invalid" << endl;
    }

    if (isValidParentheses(test2)) {
        cout << test2 << " is Valid" << endl;
    } else {
        cout << test2 << " is Invalid" << endl;
    }

    return 0;
}
```

### 6. Output
```text
{[()]} is Valid
([)] is Invalid
```

### 7. Detailed Code Explanation
- **`stack<char> st;`**: Holds all opening brackets that are still waiting to be closed.
- **`if (st.empty()) return false;`**: Handles inputs like `")()"` where a closing bracket appears when nothing is open.
- **`char topBracket = st.top();`**: Reads the most recently opened bracket. If it matches the current closing bracket `ch`, `st.pop()` removes that opening bracket because its pair is now complete.
- **`if (st.empty()) return true;`**: Ensures inputs like `"((("` return `false` because unclosed brackets are still sitting inside `st`.

### 8. Dry Run (`s = "{[()]}"`)

| Step | Character `ch` | Action Taken | Stack State (Bottom $\rightarrow$ Top) |
| :---: | :---: | :--- | :--- |
| 1 | `'{'` | Opening bracket $\rightarrow$ `push('{')` | `['{']` |
| 2 | `'['` | Opening bracket $\rightarrow$ `push('[')` | `['{', '[']` |
| 3 | `'('` | Opening bracket $\rightarrow$ `push('(')` | `['{', '[', '(']` |
| 4 | `')'` | Matches `top()` `'('` $\rightarrow$ `pop()` | `['{', '[']` |
| 5 | `']'` | Matches `top()` `'['` $\rightarrow$ `pop()` | `['{']` |
| 6 | `'}'` | Matches `top()` `'{'` $\rightarrow$ `pop()` | `[ ]` (Empty $\rightarrow$ Returns `true`) |

### 9. Complexity, Edge Cases, and Takeaway
- **Time Complexity:** **$O(n)$**, where $n$ is the length of the string, because we visit each character once and perform $O(1)$ stack operations.
- **Space Complexity:** **$O(n)$** in the worst case (e.g., `"((((((("`), where all $n$ characters are pushed onto the stack.
- **Common Mistakes & Edge Cases:**
  1. Forgetting to check `if (st.empty())` *before* calling `st.top()` when a closing bracket arrives (causes a runtime crash on `"]"`).
  2. Returning `true` at the end of the loop without checking `st.empty()` (fails on `"((("`).
- **What You Learn:** Whenever a problem involves nested structures (parentheses, HTML/XML tags, nested folders) where the most recently opened item must be closed first, use a Stack.

---

## Problem 2: Min Stack

- **Platform & Link:** [LeetCode #155 — Min Stack](https://leetcode.com/problems/min-stack/)
- **Core Technique:** Maintaining Auxiliary State in $O(1)$ Time

### 1. Problem Statement Summary
Design a stack class `MinStack` that supports all standard stack operations (`push`, `pop`, `top`) **plus** a `getMin()` function that retrieves the minimum element currently in the stack—and **every single operation must run in $O(1)$ constant time**.

### 2. Example Input and Output
- `push(-2)`, `push(0)`, `push(-3)`
- `getMin()` $\rightarrow$ returns `-3`
- `pop()` (removes `-3`)
- `top()` $\rightarrow$ returns `0`
- `getMin()` $\rightarrow$ returns `-2`

### 3. Brute-Force vs. Why a Second Stack Is Useful
- **Brute-Force Idea:** Keep a single variable `int minVal`. That works when pushing, **but what happens when the minimum element is popped?** Finding the new minimum across the remaining elements would require scanning the entire stack in $O(n)$ time, violating the $O(1)$ rule!
- **Stack Insight:** The minimum of a stack only changes when elements are pushed or popped at the top. If we maintain a second stack (`minStack`) whose top always stores the **minimum value of the stack up to that depth**, we can restore the previous minimum in $O(1)$ time whenever we pop!

```text
Operations: push(5), push(2), push(4), push(1)

mainStack (Actual Values):     minStack (Minimum So Far at Each Level):
+---+                          +---+
| 1 | <-- TOP                  | 1 | <-- Current Min = min(1, 2) = 1
+---+                          +---+
| 4 |                          | 2 | <-- Min when 4 was pushed = min(4, 2) = 2
+---+                          +---+
| 2 |                          | 2 | <-- Min when 2 was pushed = min(2, 5) = 2
+---+                          +---+
| 5 |                          | 5 | <-- Min when 5 was pushed = 5
+---+                          +---+
```

If we `pop()` the top from **both** stacks, `1` is removed and `minStack.top()` immediately reveals that the minimum of the remaining elements is `2`!

### 4. Step-by-Step Approach
1. Maintain two stacks inside the `MinStack` class: `stack<int> mainStack;` and `stack<int> minStack;`.
2. **`push(int val)`**:
   - Push `val` onto `mainStack`.
   - If `minStack` is empty or `val < minStack.top()`, push `val` onto `minStack`. Otherwise, push `minStack.top()` again onto `minStack` so both stacks always have the exact same height.
3. **`pop()`**: Pop the top element from both `mainStack` and `minStack`.
4. **`top()`**: Return `mainStack.top()`.
5. **`getMin()`**: Return `minStack.top()`.

### 5. Complete C++ Solution

```cpp
#include <iostream>
#include <stack>

using namespace std;

class MinStack {
private:
    stack<int> mainStack;
    stack<int> minStack;

public:
    // Push value onto the stack and update the minimum history
    void push(int val) {
        mainStack.push(val);

        if (minStack.empty()) {
            minStack.push(val);
        } else {
            int currentMin = minStack.top();
            if (val < currentMin) {
                minStack.push(val);
            } else {
                minStack.push(currentMin);
            }
        }
    }

    // Remove the top element from both stacks
    void pop() {
        if (mainStack.empty()) {
            cout << "Stack is empty!" << endl;
            return;
        }
        mainStack.pop();
        minStack.pop();
    }

    // Get the top element
    int top() {
        return mainStack.top();
    }

    // Retrieve the minimum element in the stack in O(1) time
    int getMin() {
        return minStack.top();
    }
};

int main() {
    MinStack ms;

    ms.push(-2);
    ms.push(0);
    ms.push(-3);

    cout << "Current Minimum: " << ms.getMin() << endl; // -3

    ms.pop(); // Removes -3

    cout << "Top Element: " << ms.top() << endl;        // 0
    cout << "New Minimum: " << ms.getMin() << endl;     // -2

    return 0;
}
```

### 6. Output
```text
Current Minimum: -3
Top Element: 0
New Minimum: -2
```

### 7. Dry Run

| Step | Operation | `mainStack` (Bottom $\rightarrow$ Top) | `minStack` (Bottom $\rightarrow$ Top) | Output |
| :---: | :--- | :--- | :--- | :---: |
| 1 | `push(-2)` | `[-2]` | `[-2]` | — |
| 2 | `push(0)` | `[-2, 0]` | `[-2, -2]` (since `0 >= -2`) | — |
| 3 | `push(-3)` | `[-2, 0, -3]` | `[-2, -2, -3]` (since `-3 < -2`) | — |
| 4 | `getMin()` | `[-2, 0, -3]` | `[-2, -2, -3]` | `-3` |
| 5 | `pop()` | `[-2, 0]` | `[-2, -2]` | — |
| 6 | `getMin()` | `[-2, 0]` | `[-2, -2]` | `-2` |

### 8. Complexity, Edge Cases, and Takeaway
- **Time Complexity:** **$O(1)$** for `push()`, `pop()`, `top()`, and `getMin()`.
- **Space Complexity:** **$O(n)$** to store the $n$ elements in `mainStack` and `minStack`.
- **Common Mistakes & Edge Cases:** If you optimize `minStack` to only push when a new minimum appears, you **must** use `val <= minStack.top()` (including `=`) so duplicate minimums (like pushing `-2` twice and popping once) don't accidentally erase the minimum! Pushing a minimum at every level as shown above avoids that bug completely.
- **What You Learn:** You can augment a Stack to answer prefix/aggregate queries (`getMin()`, `getMax()`) in $O(1)$ time by storing the running answer alongside each stack level.

---

## Problem 3: Next Greater Element

- **Platform & Links:**
  - [LeetCode #496 — Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/)
  - Related Classic Version: [CSES Problem Set — Nearest Smaller Values](https://cses.fi/problemset/task/1645)
- **Core Technique:** The Monotonic Stack Pattern

### 1. Problem Statement Summary
Given an array `arr` of $n$ integers, for every element `arr[i]`, find the **Next Greater Element (NGE)**—the **first element to its right** that is strictly greater than `arr[i]`. If no larger element exists to its right, output `-1` for that position.

### 2. Example Input and Output
- **Input:** `arr = [4, 5, 2, 25]`
- **Output:** `[5, 25, 25, -1]`
  - Next greater to the right of `4` is `5`.
  - Next greater to the right of `5` is `25`.
  - Next greater to the right of `2` is `25`.
  - `25` has no greater element to its right $\rightarrow$ `-1`.

### 3. Brute-Force Approach vs. Why a Stack Is Useful
- **Brute-Force ($O(n^2)$):** Use two nested loops. For each index `i`, scan `j` from `i + 1` to `n - 1` until you find `arr[j] > arr[i]`. On an array of size $100{,}000$, $n^2 = 10^{10}$ operations, which fails with Time Limit Exceeded (TLE).
- **Why a Monotonic Stack Works in $O(n)$:**
  Suppose we scan the array **from right to left** and keep a stack of "candidate greater elements" we have seen so far.
  When we are at `arr[i]`, any element sitting on top of the stack that is **less than or equal to `arr[i]`** is useless! Why? Because `arr[i]` is both **larger** than those stack elements and **closer** to any future elements on the left. So we can permanently `pop()` all elements $\le \text{arr}[i]$!

```text
Scanning Right-to-Left on [4, 5, 2, 25]:
When at 5 (looking right):
Stack before: Top -> [2, 25]
1. Is top (2) <= 5? YES! Pop 2 (2 can never be the Next Greater for 5 or anything left of 5).
2. Is top (25) <= 5? NO! Stop popping. Top (25) is the Next Greater Element for 5!
3. Push 5 onto stack: Top -> [5, 25]
```

Because elements in the stack stay strictly sorted from top to bottom, this is called a **Monotonic Stack**.

### 4. Step-by-Step Approach
1. Create a result vector `nge(n, -1)` and an empty `stack<int> st`.
2. Loop `i` backwards from `n - 1` down to `0`:
   - **Step A:** While `!st.empty()` and `st.top() <= arr[i]`, call `st.pop()` to discard smaller or equal elements.
   - **Step B:** If `!st.empty()`, then `st.top()` is the first element to the right that is strictly greater than `arr[i]`, so set `nge[i] = st.top()`. (If the stack is empty, `nge[i]` stays `-1`.)
   - **Step C:** Push `arr[i]` onto `st` so it can serve as a candidate for elements further to the left.

### 5. Complete C++ Solution

```cpp
#include <iostream>
#include <stack>
#include <vector>

using namespace std;

vector<int> findNextGreaterElements(vector<int>& arr) {
    int n = arr.size();
    vector<int> nge(n, -1);
    stack<int> st;

    // Traverse from right to left
    for (int i = n - 1; i >= 0; i--) {
        // 1. Pop elements that are smaller than or equal to arr[i]
        while (!st.empty() && st.top() <= arr[i]) {
            st.pop();
        }

        // 2. If stack is not empty, the top element is the Next Greater Element
        if (!st.empty()) {
            nge[i] = st.top();
        }

        // 3. Push current element onto stack as a candidate for left elements
        st.push(arr[i]);
    }

    return nge;
}

int main() {
    vector<int> arr = {4, 5, 2, 25};
    vector<int> result = findNextGreaterElements(arr);

    cout << "Element -> Next Greater Element" << endl;
    for (int i = 0; i < arr.size(); i++) {
        cout << arr[i] << " -> " << result[i] << endl;
    }

    return 0;
}
```

### 6. Output
```text
Element -> Next Greater Element
4 -> 5
5 -> 25
2 -> 25
25 -> -1
```

### 7. Dry Run (`arr = [4, 5, 2, 25]`, Right to Left)

| Index `i` | `arr[i]` | Elements Popped (`<= arr[i]`) | Stack Top After Pops (`nge[i]`) | Push `arr[i]` $\rightarrow$ Stack (Bottom $\rightarrow$ Top) |
| :---: | :---: | :--- | :---: | :--- |
| `3` | `25` | None | Empty (`-1`) | `[25]` |
| `2` | `2` | None (`25 > 2`) | `25` | `[25, 2]` |
| `1` | `5` | Pops `2` (`2 <= 5`) | `25` | `[25, 5]` |
| `0` | `4` | None (`5 > 4`) | `5` | `[25, 5, 4]` |

### 8. Complexity, Edge Cases, and Takeaway
- **Time Complexity:** **$O(n)$**. Even though there is a `while` loop inside a `for` loop, **every element is pushed onto the stack once and popped at most once** across the entire algorithm ($2n$ total operations).
- **Space Complexity:** **$O(n)$** for the stack and output vector.
- **Common Mistakes & Edge Cases:** Using `<` instead of `<=` inside `while (!st.empty() && st.top() <= arr[i])` when duplicate numbers exist (e.g., `[4, 4, 5]`—the next *strictly* greater element for the first `4` is `5`, not `4`).
- **What You Learn:** The **Monotonic Stack** pattern finds the nearest greater or smaller neighbor to the left or right of every element in an array in linear $O(n)$ time.

---

## Problem 4: Daily Temperatures

- **Platform & Link:** [LeetCode #739 — Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)
- **Core Technique:** Monotonic Stack Storing **Array Indices** Instead of Values

### 1. Problem Statement Summary
Given an array of integers `temperatures` representing the daily temperature on each day, return an array `answer` such that `answer[i]` is the **number of days you have to wait** after day `i` to get a warmer temperature. If there is no future day with a warmer temperature, `answer[i]` should be `0`.

### 2. Example Input and Output
- **Input:** `temperatures = [73, 74, 75, 71, 69, 72, 76, 73]`
- **Output:** `[1, 1, 4, 2, 1, 1, 0, 0]`
  - From day 0 (`73`), day 1 (`74`) is warmer $\rightarrow$ `1 - 0 = 1` day wait.
  - From day 2 (`75`), day 6 (`76`) is the first warmer day $\rightarrow$ `6 - 2 = 4` days wait.

### 3. Why Storing Indices in a Stack Is Useful
Notice that this problem is just like **Next Greater Element**, with one twist: instead of asking *what* the next greater temperature is, it asks **how many indices away** that warmer day is (`nextWarmerIndex - currentIndex`)!

If we push **array indices (`0, 1, 2, ...`)** onto our stack instead of raw temperatures:
- We can still look up the temperature of the top index using `temperatures[st.top()]`.
- We can also compute the exact distance between days by subtracting indices: `i - st.top()`!

```text
Day Index:     0    1    2    3    4    5    6    7
Temperature: [73,  74,  75,  71,  69,  72,  76,  73]
                        |                   ^
                        +--- 6 - 2 = 4 days +
```

### 4. Step-by-Step Approach (Left-to-Right Monotonic Stack)
1. Create `vector<int> waitDays(n, 0)` and `stack<int> st` (which stores **day indices** waiting for a warmer day).
2. Loop `i` from `0` to `n - 1`:
   - While the stack is not empty and today's temperature `temperatures[i]` is strictly warmer than the temperature on day `st.top()` (`temperatures[i] > temperatures[st.top()]`):
     - Let `prevDay = st.top();` and `st.pop();`.
     - Today (`i`) is the first warmer day for `prevDay`! Set `waitDays[prevDay] = i - prevDay;`.
   - Push today's index `i` onto `st`.
3. Any index still left in `st` at the end never saw a warmer day, and its `waitDays` entry is already `0`.

### 5. Complete C++ Solution

```cpp
#include <iostream>
#include <stack>
#include <vector>

using namespace std;

vector<int> dailyTemperatures(vector<int>& temperatures) {
    int n = temperatures.size();
    vector<int> waitDays(n, 0);
    stack<int> st; // Stores indices of days waiting for a warmer temperature

    for (int i = 0; i < n; i++) {
        // Check if today's temperature resolves any cooler days waiting on the stack
        while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
            int prevDayIndex = st.top();
            st.pop();
            waitDays[prevDayIndex] = i - prevDayIndex;
        }

        // Push today's index onto the stack
        st.push(i);
    }

    return waitDays;
}

int main() {
    vector<int> temperatures = {73, 74, 75, 71, 69, 72, 76, 73};
    vector<int> result = dailyTemperatures(temperatures);

    cout << "Wait days for each day: ";
    for (int i = 0; i < result.size(); i++) {
        cout << result[i] << " ";
    }
    cout << endl;

    return 0;
}
```

### 6. Output
```text
Wait days for each day: 1 1 4 2 1 1 0 0 
```

### 7. Dry Run (`temperatures = [73, 74, 75, 71, 69, 72, 76, 73]`)

| Day `i` | `temp[i]` | Days Resolved & Popped (`temp[i] > temp[top]`) | Stack of Indices (`temp`) After Push |
| :---: | :---: | :--- | :--- |
| `0` | `73` | None | `[0 (73)]` |
| `1` | `74` | Pops `0`: `waitDays[0] = 1 - 0 = 1` | `[1 (74)]` |
| `2` | `75` | Pops `1`: `waitDays[1] = 2 - 1 = 1` | `[2 (75)]` |
| `3` | `71` | None (`71 <= 75`) | `[2 (75), 3 (71)]` |
| `4` | `69` | None (`69 <= 71`) | `[2 (75), 3 (71), 4 (69)]` |
| `5` | `72` | Pops `4` (`5-4=1`), Pops `3` (`5-3=2`) | `[2 (75), 5 (72)]` |
| `6` | `76` | Pops `5` (`6-5=1`), Pops `2` (`6-2=4`) | `[6 (76)]` |
| `7` | `73` | None (`73 <= 76`) | `[6 (76), 7 (73)]` |

### 8. Complexity, Edge Cases, and Takeaway
- **Time Complexity:** **$O(n)$** because each index `0 .. n-1` is pushed once and popped at most once.
- **Space Complexity:** **$O(n)$** for the stack of indices.
- **Common Mistakes & Edge Cases:** Pushing `temperatures[i]` instead of the index `i` onto the stack—if you only store the temperature value, you lose the position needed to compute `i - prevDayIndex`.
- **What You Learn:** Almost always **store indices in a Monotonic Stack** rather than raw values. If you have the index `idx`, you automatically have both the position (`idx`) and the value (`arr[idx]`)!

---

## Problem 5: Largest Rectangle in Histogram

- **Platform & Link:** [LeetCode #84 — Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)
- **Core Technique:** Monotonic Increasing Stack for Left & Right Span Boundaries

### 1. Problem Statement Summary
Given an array of integers `heights` representing the heights of bars in a histogram where the width of each bar is `1`, find the area of the **largest rectangle** that can be formed completely inside the histogram.

### 2. Example Input and Output
- **Input:** `heights = [2, 1, 5, 6, 2, 3]`
- **Output:** `10`

```text
   6 |           +---+
   5 |       +---|   |
   4 |       |   |   |
   3 |       |///|///|   +---+
   2 | +---+ |///|///|---|   |
   1 | |   |---|/|///|   |   |
     +---+---+---+---+---+---+
Bars:    2   1   5   6   2   3
Indices: 0   1   2   3   4   5

Largest rectangle uses bars at index 2 (height 5) and index 3 (height 6):
Height = 5, Width = 2 (indices 2 and 3) -> Area = 5 * 2 = 10
```

### 3. Brute-Force vs. Why a Stack Is Useful
- **Key Observation:** Every largest rectangle has a height equal to **at least one bar `heights[h]`** that acts as the shortest (limiting) bar in that rectangle.
- **Brute-Force ($O(n^2)$):** For every bar `i`, expand a pointer `left` to the left and `right` to the right as long as neighbouring bars have `height >= heights[i]`. Then compute `area = heights[i] * (right - left - 1)`.
- **Optimized Stack Insight ($O(n)$):**
  How far can bar `h` expand? It can expand left until it hits the **first bar strictly shorter than `h` on the left**, and it can expand right until it hits the **first bar strictly shorter than `h` on the right**!
  If we maintain a **Monotonic Increasing Stack of indices** as we scan left to right:
  - Whenever we encounter a new bar `i` that is **shorter** than the bar at `st.top()`, bar `i` blocks `st.top()` from expanding any further to the right!
  - So `i` is the **Right Boundary** for `st.top()`.
  - And what is the **Left Boundary** for `st.top()`? It is the index sitting **directly below `st.top()`** in our monotonic increasing stack!

```text
When bar[i] < bar[st.top()]:
  Popped bar index = h
  Right boundary (first shorter bar on right) = i
  Left boundary  (first shorter bar on left)  = new st.top() (or -1 if stack is empty)
  Width of rectangle with height heights[h]   = i - leftBoundary - 1
```

### 4. Step-by-Step Approach
1. Maintain an empty `stack<int> st` of bar indices and `int maxArea = 0`.
2. Loop `i` from `0` to `n` (where `i == n` acts as a virtual bar of height `0` at the end to flush all remaining bars out of the stack):
   - Set `currentHeight = 0` if `i == n`, otherwise `heights[i]`.
   - While `!st.empty()` and `currentHeight < heights[st.top()]`:
     - Pop the top index: `int hIndex = st.top(); st.pop();`
     - `int rectHeight = heights[hIndex];`
     - Determine the width:
       - If `st.empty()` is true, no bar to the left was shorter, so the rectangle spans all the way from `0` to `i - 1` (`width = i`).
       - Otherwise, the rectangle spans between `st.top()` and `i` (`width = i - st.top() - 1`).
     - Update `maxArea` if `rectHeight * width > maxArea`.
   - Push `i` onto `st`.

### 5. Complete C++ Solution

```cpp
#include <iostream>
#include <stack>
#include <vector>

using namespace std;

int largestRectangleArea(vector<int>& heights) {
    int n = heights.size();
    stack<int> st; // Monotonic increasing stack of bar indices
    int maxArea = 0;

    // Loop from 0 to n (i == n represents a virtual height-0 bar at the end)
    for (int i = 0; i <= n; i++) {
        int currentHeight = 0;
        if (i < n) {
            currentHeight = heights[i];
        }

        // When current bar is shorter than stack top, compute area for stack top
        while (!st.empty() && currentHeight < heights[st.top()]) {
            int topIndex = st.top();
            st.pop();

            int rectHeight = heights[topIndex];
            int rectWidth = 0;

            if (st.empty()) {
                rectWidth = i; // Extends all the way to index 0
            } else {
                rectWidth = i - st.top() - 1; // Between st.top() and i
            }

            int area = rectHeight * rectWidth;
            if (area > maxArea) {
                maxArea = area;
            }
        }

        st.push(i);
    }

    return maxArea;
}

int main() {
    vector<int> heights = {2, 1, 5, 6, 2, 3};
    int result = largestRectangleArea(heights);

    cout << "Largest Rectangle Area: " << result << endl;

    return 0;
}
```

### 6. Output
```text
Largest Rectangle Area: 10
```

### 7. Dry Run (`heights = [2, 1, 5, 6, 2, 3]`)

| Index `i` | `currentHeight` | Popped `topIndex` (`rectHeight`) | New `st.top()` (Left Bound) | `rectWidth` | `area` | `maxArea` | Stack After Push |
| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| `0` | `2` | None | — | — | — | `0` | `[0]` |
| `1` | `1` | Pops `0` (`h=2`) | Empty | `1` | `2 * 1 = 2` | `2` | `[1]` |
| `2` | `5` | None (`5 >= 1`) | — | — | — | `2` | `[1, 2]` |
| `3` | `6` | None (`6 >= 5`) | — | — | — | `2` | `[1, 2, 3]` |
| `4` | `2` | 1) Pops `3` (`h=6`)<br>2) Pops `2` (`h=5`) | `2`<br>`1` | `4 - 2 - 1 = 1`<br>`4 - 1 - 1 = 2` | `6 * 1 = 6`<br>`5 * 2 = 10` | `6`<br>**`10`** | `[1, 4]` |
| `5` | `3` | None (`3 >= 2`) | — | — | — | `10` | `[1, 4, 5]` |
| `6` (end) | `0` | 1) Pops `5` (`h=3`)<br>2) Pops `4` (`h=2`)<br>3) Pops `1` (`h=1`) | `4`<br>`1`<br>Empty | `6 - 4 - 1 = 1`<br>`6 - 1 - 1 = 4`<br>`6` | `3 * 1 = 3`<br>`2 * 4 = 8`<br>`1 * 6 = 6` | `10` | `[6]` |

### 8. Complexity, Edge Cases, and Takeaway
- **Time Complexity:** **$O(n)$**. Every bar index from `0` to `n` is pushed once and popped at most once.
- **Space Complexity:** **$O(n)$** for the stack.
- **Common Mistakes & Edge Cases:**
  1. Forgetting to process the bars remaining in the stack after the last index `n - 1` (the `i == n` virtual `0`-height bar trick handles this cleanly in a single loop).
  2. Using `i - topIndex` as the width instead of `i - st.top() - 1` (because a popped bar can also extend **leftward** across taller bars that were already popped before it!).
- **What You Learn:** A Monotonic Increasing Stack gives you **both** the nearest smaller element on the left (`st.top()` after popping) and the nearest smaller element on the right (`i`) for every element in a single $O(n)$ pass!

---

## Summary Table of the 5 Stack Patterns

| Problem | Stack Pattern Learned | Time | Space |
| :--- | :--- | :---: | :---: |
| **1. Valid Parentheses** | LIFO Nested Pair Matching | $O(n)$ | $O(n)$ |
| **2. Min Stack** | Auxiliary Stack for $O(1)$ Prefix Minimums | $O(1)$ | $O(n)$ |
| **3. Next Greater Element** | Monotonic Decreasing Stack (Values) | $O(n)$ | $O(n)$ |
| **4. Daily Temperatures** | Monotonic Decreasing Stack (Indices & Distances) | $O(n)$ | $O(n)$ |
| **5. Largest Rectangle in Histogram** | Monotonic Increasing Stack (Left & Right Span Boundaries) | $O(n)$ | $O(n)$ |

---

## Frequently Asked Questions (FAQ)

### How do I know whether to use a Monotonic Increasing or Decreasing Stack?
- To find the **Next Greater** element, keep a **Monotonic Decreasing** stack (from bottom to top), popping whenever a larger element arrives.
- To find the **Next Smaller** element (like in Largest Rectangle in Histogram), keep a **Monotonic Increasing** stack, popping whenever a smaller element arrives.

### Why is a Monotonic Stack $O(n)$ even though it has a `while` loop inside a `for` loop?
Because an element is **never pushed back** after it is popped. Across all $n$ iterations of the `for` loop, `st.push()` runs $n$ times and `st.pop()` can run at most $n$ times in total. $n + n = 2n = O(n)$.

---

## Review the Complete Stack Curriculum

Congratulations on completing the entire **Stack in C++** series! You can revisit any article in the learning path below:

- **Topic Hub:** [Stack in C++: Complete Beginner-to-Advanced Guide](/topics/stack/)
- **Step 1:** [Understanding Stack in C++: Complete Beginner's Guide](/posts/understanding-stack-in-cpp/)
- **Step 2:** [Stack Using Vector in C++: Step-by-Step Implementation](/posts/stack-using-vector-in-cpp/)
- **Step 3:** [Stack Using Array in C++: Fixed-Size Implementation & Dry Run](/posts/stack-using-array-in-cpp/)
- **Step 4:** [Stack Using Linked List in C++: Dynamic Node Implementation](/posts/stack-using-linked-list-in-cpp/)
- **Related Data Structure:** [The Queue Data Structure in C](/posts/queue/)
- **Explore All Algorithms:** [Data Structures & Algorithmic Engineering Hub](/topics/dsa/)


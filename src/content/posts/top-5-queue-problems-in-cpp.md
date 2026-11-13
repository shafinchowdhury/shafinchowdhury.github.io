---
title: "Top 5 Famous Queue Problems in Competitive Programming (With C++ Solutions)"
author: "Shafin Chowdhury"
pubDatetime: 2026-11-13T14:00:00+06:00
featured: true
draft: false
tags:
  - cpp
  - data-structures
  - queue
  - competitive-programming
  - algorithms
  - bfs
  - leetcode
description: "Master the 5 most famous Queue and Deque problems in competitive programming and coding interviews: Implement Queue Using Stacks, Number of Recent Calls, Binary Tree Level Order Traversal, Rotten Oranges (BFS), and Sliding Window Maximum (Monotonic Deque)—complete with C++ code and dry runs."
---

Understanding [how a Queue works](/posts/understanding-queue-in-cpp/) and how to implement one using an [Array](/posts/queue-using-array-in-cpp/), [Vector](/posts/queue-using-vector-in-cpp/), or [Linked List](/posts/queue-using-linked-list-in-cpp/) gives you the structural foundation. In competitive programming and technical interviews, however, the real skill is recognizing **which algorithmic pattern a Queue unlocks**.

In this guide, we will solve **5 famous Queue and Deque problems**, carefully chosen so each problem teaches a distinct, high-yield competitive programming pattern:

1. **Implement Queue Using Stacks** — _Amortized $O(1)$ Two-Stack Reversal_
2. **Number of Recent Calls** — _Sliding Time-Window Filtering_
3. **Binary Tree Level Order Traversal** — _Breadth-First Search (BFS) by Depth Level_
4. **Rotten Oranges** — _Multi-Source Grid BFS & Shortest Time Propagation_
5. **Sliding Window Maximum** — _Monotonic Double-Ended Queue (`std::deque`) in $O(n)$_

> **Part of the Queue Series:** This article is **Step 5** of our [Queue in C++: Complete Beginner-to-Advanced Guide](/topics/queue/).

---

## Problem 1: Implement Queue Using Stacks

- **Platform & Link:** [LeetCode #232 — Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/)
- **Core Pattern:** Reversing LIFO Twice to Produce FIFO in Amortized $O(1)$ Time

### 1. Problem Explanation

Implement a First-In, First-Out (FIFO) queue (`MyQueue`) using **only two [Stacks](/posts/understanding-stack-in-cpp/)** (`inputStack` and `outputStack`). Your implementation must support all standard queue operations (`push`, `pop`, `peek`, and `empty`).

### 2. Why Two Stacks Are Useful Here

A single Stack follows **LIFO (Last-In, First-Out)**—it reverses the arrival order of elements. What happens if you pour elements from one Stack into a **second Stack**? Their order is reversed a **second time**, restoring the original **FIFO (First-In, First-Out)** order!

```text
1. Push 10, 20, 30 into inputStack:
   inputStack (Top -> Bottom):  [30, 20, 10]   (30 is on top, 10 is buried at the bottom)

2. Transfer all elements from inputStack to outputStack:
   Pop 30 -> Push 30
   Pop 20 -> Push 20
   Pop 10 -> Push 10
   outputStack (Top -> Bottom): [10, 20, 30]   (Now 10 sits on top—ready for FIFO pop!)
```

### 3. Core Algorithm (Lazy Transfer for Amortized $O(1)$)

If we transferred all elements back and forth on every single operation, each `pop()` would cost $O(n)$. Instead, we use **lazy transfer**:

1. **`push(x)`:** Always push new elements onto `inputStack` in $O(1)$ time.
2. **`pop()` / `peek()`:** Look at `outputStack`:
   - If `outputStack` is **not empty**, its top element is already the oldest element in the queue! Read or pop `outputStack.top()` in $O(1)$ time.
   - **Only when `outputStack` is completely empty**, move all elements from `inputStack` into `outputStack`, and then read/pop `outputStack.top()`.
3. **`empty()`:** The queue is empty if and only if both `inputStack.empty()` and `outputStack.empty()` are `true`.

### 4. Step-by-Step Dry Run

| Step | Operation  | `inputStack` (Bottom $\rightarrow$ Top) | `outputStack` (Bottom $\rightarrow$ Top) | Action & Return                                                            |
| :--: | :--------- | :-------------------------------------- | :--------------------------------------- | :------------------------------------------------------------------------- |
|  1   | `push(10)` | `[10]`                                  | `[ ]`                                    | Push `10` to `inputStack`                                                  |
|  2   | `push(20)` | `[10, 20]`                              | `[ ]`                                    | Push `20` to `inputStack`                                                  |
|  3   | `peek()`   | `[ ]`                                   | `[20, 10]`                               | `outputStack` was empty $\rightarrow$ transfer `20`, `10`; top is **`10`** |
|  4   | `push(30)` | `[30]`                                  | `[20, 10]`                               | Push `30` to `inputStack`                                                  |
|  5   | `pop()`    | `[30]`                                  | `[20]`                                   | `outputStack` not empty $\rightarrow$ pop top **`10`** in $O(1)$!          |
|  6   | `pop()`    | `[30]`                                  | `[ ]`                                    | `outputStack` not empty $\rightarrow$ pop top **`20`** in $O(1)$!          |
|  7   | `peek()`   | `[ ]`                                   | `[30]`                                   | `outputStack` empty $\rightarrow$ transfer `30`; top is **`30`**           |

### 5. Complete C++ Solution

```cpp
#include <iostream>
#include <stack>

using namespace std;

class MyQueue {
private:
    stack<int> inputStack;
    stack<int> outputStack;

    // Helper: move elements from inputStack to outputStack only when outputStack is empty
    void transferIfNeeded() {
        if (outputStack.empty()) {
            while (!inputStack.empty()) {
                outputStack.push(inputStack.top());
                inputStack.pop();
            }
        }
    }

public:
    // Enqueue element at the back of the queue
    void push(int x) {
        inputStack.push(x);
    }

    // Dequeue and return the front element
    int pop() {
        transferIfNeeded();
        int frontVal = outputStack.top();
        outputStack.pop();
        return frontVal;
    }

    // Return the front element without removing it
    int peek() {
        transferIfNeeded();
        return outputStack.top();
    }

    // Return true if the queue is completely empty
    bool empty() {
        return inputStack.empty() && outputStack.empty();
    }
};

int main() {
    MyQueue q;
    q.push(10);
    q.push(20);
    cout << "Front (peek): " << q.peek() << endl; // 10
    q.push(30);
    cout << "Dequeued (pop): " << q.pop() << endl; // 10
    cout << "Dequeued (pop): " << q.pop() << endl; // 20
    cout << "Front (peek): " << q.peek() << endl; // 30

    return 0;
}
```

### Output

```text
Front (peek): 10
Dequeued (pop): 10
Dequeued (pop): 20
Front (peek): 30
```

### 6. Time and Space Complexity & Pattern Takeaway

- **Time Complexity:** **`push()` is strict $O(1)$; `pop()` and `peek()` are Amortized $O(1)$.** Why? Because each element is pushed into `inputStack` once, transferred to `outputStack` once, and popped from `outputStack` once—at most $3$ stack operations per element across its entire lifetime!
- **Space Complexity:** **$O(n)$** to store the $n$ queue elements across the two stacks.
- **Pattern Learned:** Pouring a LIFO stack into a second LIFO stack reverses the order into FIFO. Doing so lazily only when the output stack is empty guarantees $O(1)$ amortized performance.

---

## Problem 2: Number of Recent Calls

- **Platform & Link:** [LeetCode #933 — Number of Recent Calls](https://leetcode.com/problems/number-of-recent-calls/)
- **Core Pattern:** Sliding Time-Window Queue

### 1. Problem Explanation

Write a `RecentCounter` class that counts the number of requests received within a **3000-millisecond sliding window**.

- `int ping(int t)` adds a new request at timestamp `t` (in milliseconds, where `t` is strictly increasing on each call) and returns the number of requests that have happened in the inclusive time range `[t - 3000, t]`.

### 2. Why a Queue Is Useful Here

Because timestamps `t` arrive in strictly increasing chronological order:

- The **newest** request timestamp is always added at the **Rear**.
- The **oldest** request timestamps—the ones that might expire by falling earlier than `t - 3000`—are always sitting at the **Front**!
- Once a timestamp at the front is older than `t - 3000`, it will _also_ be too old for all future (even larger) timestamps, so we can permanently `pop()` it from the queue!

```text
When ping(3002) arrives -> Valid Window is [2, 3002]:

Queue before cleanup:
  Front                                Rear
  +------+------+------+------+------+
  |  1   | 100  | 3001 | 3002 |      |
  +------+------+------+------+------+
     ^
  1 < 2 (Expired! Dequeue 1)

Queue after cleanup: [100, 3001, 3002] -> Size = 3 recent calls!
```

### 3. Core Algorithm

1. Maintain a `queue<int> timestamps;`.
2. Inside `ping(int t)`:
   - Push the new timestamp `t` into `timestamps`.
   - While `!timestamps.empty()` and `timestamps.front() < t - 3000`, call `timestamps.pop()` to evict expired requests.
   - Return `timestamps.size()`.

### 4. Step-by-Step Dry Run

| Call | Timestamp `t` | Valid Window `[t - 3000, t]` | Evicted from Front (`< t - 3000`) | Active Queue (`Front .. Rear`) | Returned Size |
| :--: | :-----------: | :--------------------------: | :-------------------------------: | :----------------------------- | :-----------: |
|  1   |   `ping(1)`   |         `[-2999, 1]`         |               None                | `[1]`                          |    **`1`**    |
|  2   |  `ping(100)`  |        `[-2900, 100]`        |               None                | `[1, 100]`                     |    **`2`**    |
|  3   | `ping(3001)`  |         `[1, 3001]`          |          None (`1 >= 1`)          | `[1, 100, 3001]`               |    **`3`**    |
|  4   | `ping(3002)`  |         `[2, 3002]`          |        Pops `1` (`1 < 2`)         | `[100, 3001, 3002]`            |    **`3`**    |

### 5. Complete C++ Solution

```cpp
#include <iostream>
#include <queue>

using namespace std;

class RecentCounter {
private:
    queue<int> timestamps;

public:
    int ping(int t) {
        // 1. Add the new request timestamp at the rear
        timestamps.push(t);

        // 2. Evict all expired timestamps older than (t - 3000) from the front
        while (!timestamps.empty() && timestamps.front() < t - 3000) {
            timestamps.pop();
        }

        // 3. The remaining queue size is the exact count of valid recent calls
        return timestamps.size();
    }
};

int main() {
    RecentCounter counter;
    cout << "ping(1):    " << counter.ping(1) << endl;    // 1
    cout << "ping(100):  " << counter.ping(100) << endl;  // 2
    cout << "ping(3001): " << counter.ping(3001) << endl; // 3
    cout << "ping(3002): " << counter.ping(3002) << endl; // 3

    return 0;
}
```

### Output

```text
ping(1):    1
ping(100):  2
ping(3001): 3
ping(3002): 3
```

### 6. Time and Space Complexity & Pattern Takeaway

- **Time Complexity:** **Amortized $O(1)$ per `ping()` call** ($O(n)$ total across $n$ calls), because each timestamp is pushed once and popped at most once.
- **Space Complexity:** **$O(W)$**, where $W \le 3001$ is the maximum number of requests inside a 3000 ms window.
- **Pattern Learned:** Whenever events arrive in chronological order and you need to maintain a **moving time window** (rate limiters, network packet counters, live analytics), use a Queue to push new events at the back and evict expired events from the front.

---

## Problem 3: Binary Tree Level Order Traversal

- **Platform & Link:** [LeetCode #102 — Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)
- **Core Pattern:** Breadth-First Search (BFS) Level-by-Level Snapshot

### 1. Problem Explanation

Given the `root` of a binary tree, return the **level-order traversal** of its nodes' values—that is, from left to right, grouped level by level (`vector<vector<int>>`).

```text
Example Tree:
        3          <-- Level 0: [3]
       / \
      9  20        <-- Level 1: [9, 20]
        /  \
       15   7      <-- Level 2: [15, 7]

Output: [[3], [9, 20], [15, 7]]
```

### 2. Why a Queue Is Useful Here

While Depth-First Search (DFS) plunges down one branch using a Stack or recursion, **Breadth-First Search (BFS)** visits nodes in strict order of their distance (depth) from the root.

When we visit a node at Level $d$ and push its left and right children (Level $d + 1$) into a **FIFO Queue**, all nodes at Level $d$ were enqueued earlier than any node at Level $d + 1$—so the Queue automatically processes the entire Level $d$ before touching Level $d + 1$!

### 3. Core Algorithm

1. If `root == nullptr`, return an empty result.
2. Create `queue<TreeNode*> q;` and push `root`.
3. While `!q.empty()`:
   - Record `int levelSize = q.size();` — **this is the exact number of nodes on the current level!**
   - Create `vector<int> currentLevel;`.
   - Loop `i` from `0` to `levelSize - 1`:
     - Pop the front node `curr`, append `curr->val` to `currentLevel`.
     - If `curr->left != nullptr`, push `curr->left` into `q`.
     - If `curr->right != nullptr`, push `curr->right` into `q`.
   - Append `currentLevel` to `result`.

### 4. Step-by-Step Dry Run

|  Iteration  | Queue at Start of Level | `levelSize` | Nodes Popped & Added to `currentLevel` | Children Enqueued for Next Level |
| :---------: | :---------------------- | :---------: | :------------------------------------- | :------------------------------- |
| **Level 0** | `[3]`                   |     `1`     | `3` $\rightarrow$ `[3]`                | `9`, `20`                        |
| **Level 1** | `[9, 20]`               |     `2`     | `9`, `20` $\rightarrow$ `[9, 20]`      | `15`, `7` (from `20`)            |
| **Level 2** | `[15, 7]`               |     `2`     | `15`, `7` $\rightarrow$ `[15, 7]`      | None (Queue becomes empty)       |

### 5. Complete C++ Solution

```cpp
#include <iostream>
#include <queue>
#include <vector>

using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (root == nullptr) {
        return result;
    }

    queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        // Snapshot the number of nodes belonging to the current level
        int levelSize = q.size();
        vector<int> currentLevel;

        for (int i = 0; i < levelSize; i++) {
            TreeNode* curr = q.front();
            q.pop();

            currentLevel.push_back(curr->val);

            // Enqueue non-null children for the next level
            if (curr->left != nullptr) {
                q.push(curr->left);
            }
            if (curr->right != nullptr) {
                q.push(curr->right);
            }
        }

        result.push_back(currentLevel);
    }

    return result;
}

int main() {
    // Construct tree: 3 -> (9, 20 -> (15, 7))
    TreeNode* root = new TreeNode(3);
    root->left = new TreeNode(9);
    root->right = new TreeNode(20);
    root->right->left = new TreeNode(15);
    root->right->right = new TreeNode(7);

    vector<vector<int>> levels = levelOrder(root);

    for (int d = 0; d < levels.size(); d++) {
        cout << "Level " << d << ": ";
        for (int val : levels[d]) {
            cout << val << " ";
        }
        cout << endl;
    }

    return 0;
}
```

### Output

```text
Level 0: 3
Level 1: 9 20
Level 2: 15 7
```

### 6. Time and Space Complexity & Pattern Takeaway

- **Time Complexity:** **$O(n)$**, where $n$ is the number of nodes in the binary tree, as every node is enqueued and dequeued once.
- **Space Complexity:** **$O(n)$** because the widest level of a binary tree can hold up to $\lceil n / 2 \rceil$ nodes in the queue at once.
- **Pattern Learned:** Taking a snapshot of `int levelSize = q.size()` at the top of the `while (!q.empty())` loop lets you separate a standard BFS traversal into discrete depth levels (or time steps!).

---

## Problem 4: Rotten Oranges (Multi-Source BFS)

- **Platform & Link:** [LeetCode #994 — Rotting Oranges](https://leetcode.com/problems/rotting-oranges/)
- **Core Pattern:** Multi-Source Breadth-First Search on a 2D Grid

### 1. Problem Explanation

You are given an $m \times n$ grid where each cell has one of three values:

- `0` representing an empty cell,
- `1` representing a **fresh** orange,
- `2` representing a **rotten** orange.

Every minute, any fresh orange that is **4-directionally adjacent** (up, down, left, right) to a rotten orange becomes rotten. Return the **minimum number of minutes** that must elapse until no cell has a fresh orange. If it is impossible to rot all fresh oranges, return `-1`.

### 2. Why a Queue (Multi-Source BFS) Is Useful Here

Rotting spreads outward in parallel waves from **all initially rotten oranges at the same time**:

- Minute 0: All initial rotten oranges (distance 0).
- Minute 1: All fresh oranges adjacent to Minute-0 oranges (distance 1).
- Minute 2: All fresh oranges adjacent to Minute-1 oranges (distance 2).

By pushing **all initial rotten oranges (`grid[r][c] == 2`) into the Queue before starting the BFS loop**, each level of the Queue represents **1 minute of simultaneous spreading** across the grid!

```text
Minute 0 (Initial):      Minute 1:                Minute 2:
  [2] [1] [1]              [2] [2] [1]              [2] [2] [2]
  [1] [1] [0]     --->     [2] [1] [0]     --->     [2] [2] [0]
  [0] [1] [1]              [0] [1] [1]              [0] [1] [1]

Minute 3:                Minute 4 (All Fresh Rotted!):
  [2] [2] [2]              [2] [2] [2]
  [2] [2] [0]     --->     [2] [2] [0]
  [0] [2] [1]              [0] [2] [2]
```

### 3. Core Algorithm

1. Scan the grid once:
   - Push the coordinates `{r, c}` of every initially rotten orange (`2`) into `queue<pair<int, int>> q`.
   - Count the total number of fresh oranges (`freshCount`).
2. If `freshCount == 0`, return `0` immediately.
3. Run level-by-level BFS while `!q.empty() && freshCount > 0`:
   - Increment `minutes++`.
   - Process all `levelSize = q.size()` rotten oranges from the current minute:
     - For each of the 4 neighbors `(nr, nc)`, if it is inside the grid and has a fresh orange (`grid[nr][nc] == 1`), mark it rotten (`grid[nr][nc] = 2`), decrement `freshCount--`, and push `{nr, nc}` into `q`.
4. After the loop, if `freshCount == 0`, return `minutes`; otherwise return `-1`.

### 4. Step-by-Step Dry Run (`grid = [[2,1,1],[1,1,0],[0,1,1]]`)

|  Minute   | Queue at Start of Minute | Newly Rotted Cells `(r, c)` |   Remaining `freshCount`   |
| :-------: | :----------------------- | :-------------------------- | :------------------------: |
| **Start** | `[(0,0)]`                | —                           |            `6`             |
| **Min 1** | `[(0,0)]`                | `(0,1)`, `(1,0)`            |            `4`             |
| **Min 2** | `[(0,1), (1,0)]`         | `(0,2)`, `(1,1)`            |            `2`             |
| **Min 3** | `[(0,2), (1,1)]`         | `(2,1)`                     |            `1`             |
| **Min 4** | `[(2,1)]`                | `(2,2)`                     | **`0` (Done! Return `4`)** |

### 5. Complete C++ Solution

```cpp
#include <iostream>
#include <queue>
#include <vector>

using namespace std;

int orangesRotting(vector<vector<int>>& grid) {
    int rows = grid.size();
    int cols = grid[0].size();
    queue<pair<int, int>> q;
    int freshCount = 0;

    // 1. Enqueue all initial rotten oranges and count fresh oranges
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 2) {
                q.push({r, c});
            } else if (grid[r][c] == 1) {
                freshCount++;
            }
        }
    }

    if (freshCount == 0) {
        return 0;
    }

    int minutes = 0;
    int dr[4] = {-1, 1, 0, 0};
    int dc[4] = {0, 0, -1, 1};

    // 2. Multi-Source BFS level by level
    while (!q.empty() && freshCount > 0) {
        int levelSize = q.size();
        minutes++;

        for (int i = 0; i < levelSize; i++) {
            pair<int, int> curr = q.front();
            q.pop();
            int r = curr.first;
            int c = curr.second;

            // Explore 4 adjacent neighbors
            for (int d = 0; d < 4; d++) {
                int nr = r + dr[d];
                int nc = c + dc[d];

                // If neighbor is in bounds and is a fresh orange, rot it!
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                    grid[nr][nc] = 2; // Mark rotten immediately so it isn't pushed twice
                    freshCount--;
                    q.push({nr, nc});
                }
            }
        }
    }

    return (freshCount == 0) ? minutes : -1;
}

int main() {
    vector<vector<int>> grid = {
        {2, 1, 1},
        {1, 1, 0},
        {0, 1, 1}
    };

    cout << "Minimum minutes to rot all oranges: " << orangesRotting(grid) << endl;

    return 0;
}
```

### Output

```text
Minimum minutes to rot all oranges: 4
```

### 6. Time and Space Complexity & Pattern Takeaway

- **Time Complexity:** **$O(m \times n)$**, because each cell is visited and enqueued at most once.
- **Space Complexity:** **$O(m \times n)$** in the worst case if the queue holds most of the grid cells.
- **Pattern Learned:** Whenever a problem asks for the **minimum time or shortest distance from multiple starting points simultaneously** (rotting oranges, fire spreading, nearest `0` in a matrix), push all starting sources into a Queue at $t = 0$ and run **Multi-Source BFS**.

---

## Problem 5: Sliding Window Maximum (Standard Queue vs. Deque)

- **Platform & Link:** [LeetCode #239 — Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)
- **Core Pattern:** Monotonic Decreasing Deque (`std::deque`) in $O(n)$ Time

### 1. Problem Explanation

You are given an array of integers `nums` and a sliding window of size `k` moving from the very left of the array to the very right. You can only see the `k` numbers inside the window at each step. Return a vector containing the **maximum element in each window**.

- **Input:** `nums = [1, 3, -1, -3, 5, 3, 6, 7]`, `k = 3`
- **Output:** `[3, 3, 5, 5, 6, 7]`

### 2. Standard Queue vs. Deque (`std::deque`) — Why a Standard Queue Is Not Enough!

Understanding the difference between a **Standard Queue (`std::queue`)** and a **Double-Ended Queue (`std::deque`)** is crucial here:

| Feature                  | Standard Queue (`std::queue`) | Double-Ended Queue (`std::deque`)                   |
| :----------------------- | :---------------------------- | :-------------------------------------------------- |
| **Insertion Allowed At** | **Rear only** (`push`)        | **Both Front and Rear** (`push_front`, `push_back`) |
| **Removal Allowed At**   | **Front only** (`pop`)        | **Both Front and Rear** (`pop_front`, `pop_back`)   |
| **Inspect Ends**         | `front()`, `back()`           | `front()`, `back()`                                 |

Why do we need to remove from **both** ends in Sliding Window Maximum?

1. **Removing from the Front (`pop_front`):** As the window slides right, the oldest index at the **Front** falls outside the window (`dq.front() <= i - k`), just like a normal FIFO queue.
2. **Removing from the Back (`pop_back`):** When a new element `nums[i]` enters at the right of the window, any smaller elements sitting in the current window (`nums[dq.back()] <= nums[i]`) can **never** be the maximum again—because `nums[i]` is both **larger** and **will stay in the window longer**! To discard those useless smaller elements, we must pop them from the **Back (`pop_back`)**!

Because we remove expired indices from the **Front** and smaller dominated indices from the **Back**, our container stays sorted from largest (at `front()`) to smallest (at `back()`)—a **Monotonic Decreasing Deque**!

```text
Monotonic Decreasing Deque Architecture:

   pop_front() when index                pop_back() while nums[back] <= nums[i]
   leaves window (<= i - k)              then push_back(i)
            ^                                         ^
            |                                         |
         +-----+-----+-----+
         | idx | idx | idx |   (Values strictly decreasing: Front = MAX!)
         +-----+-----+-----+
            ^           ^
          FRONT        BACK
      (Window Max!)
```

### 3. Core Algorithm

1. Create `deque<int> dq;` (storing **array indices**) and `vector<int> result;`.
2. Loop `i` from `0` to `n - 1`:
   - **Step A (Evict out-of-window index from Front):** If `!dq.empty() && dq.front() <= i - k`, call `dq.pop_front()`.
   - **Step B (Maintain monotonic decreasing order from Back):** While `!dq.empty() && nums[dq.back()] <= nums[i]`, call `dq.pop_back()`.
   - **Step C (Insert current index at Back):** Call `dq.push_back(i)`.
   - **Step D (Record window maximum):** Once the first full window is formed (`i >= k - 1`), the maximum of the current window is sitting right at `nums[dq.front()]`!

### 4. Step-by-Step Dry Run (`nums = [1, 3, -1, -3, 5, 3, 6, 7]`, `k = 3`)

| Index `i` | `nums[i]` | Window `[i-k+1 .. i]` |  Popped from Front  | Popped from Back (`<= nums[i]`) | Deque `idx (val)` (`Front .. Back`) | Window Max (`nums[front]`) |
| :-------: | :-------: | :-------------------- | :-----------------: | :------------------------------ | :---------------------------------- | :------------------------: |
|    `0`    |    `1`    | `[1]`                 |          —          | —                               | `[0(1)]`                            |             —              |
|    `1`    |    `3`    | `[1, 3]`              |          —          | `0(1)`                          | `[1(3)]`                            |             —              |
|    `2`    |   `-1`    | `[1, 3, -1]`          |          —          | —                               | `[1(3), 2(-1)]`                     |          **`3`**           |
|    `3`    |   `-3`    | `[3, -1, -3]`         |          —          | —                               | `[1(3), 2(-1), 3(-3)]`              |          **`3`**           |
|    `4`    |    `5`    | `[-1, -3, 5]`         | `1(3)` (`1 <= 4-3`) | `3(-3)`, `2(-1)`                | `[4(5)]`                            |          **`5`**           |
|    `5`    |    `3`    | `[-3, 5, 3]`          |          —          | —                               | `[4(5), 5(3)]`                      |          **`5`**           |
|    `6`    |    `6`    | `[5, 3, 6]`           |          —          | `5(3)`, `4(5)`                  | `[6(6)]`                            |          **`6`**           |
|    `7`    |    `7`    | `[3, 6, 7]`           |          —          | `6(6)`                          | `[7(7)]`                            |          **`7`**           |

### 5. Complete C++ Solution

```cpp
#include <iostream>
#include <deque>
#include <vector>

using namespace std;

vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq; // Stores indices in monotonic decreasing order of values
    vector<int> result;

    for (int i = 0; i < nums.size(); i++) {
        // 1. Remove index from the front if it has fallen outside the current window [i - k + 1 .. i]
        if (!dq.empty() && dq.front() <= i - k) {
            dq.pop_front();
        }

        // 2. Remove indices from the back whose values are smaller than or equal to nums[i]
        while (!dq.empty() && nums[dq.back()] <= nums[i]) {
            dq.pop_back();
        }

        // 3. Push current index to the back of the deque
        dq.push_back(i);

        // 4. Once the first window of size k is reached, front of deque holds the maximum
        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }

    return result;
}

int main() {
    vector<int> nums = {1, 3, -1, -3, 5, 3, 6, 7};
    int k = 3;

    vector<int> maxValues = maxSlidingWindow(nums, k);

    cout << "Sliding Window Maximums (k = 3): ";
    for (int val : maxValues) {
        cout << val << " ";
    }
    cout << endl;

    return 0;
}
```

### Output

```text
Sliding Window Maximums (k = 3): 3 3 5 5 6 7
```

### 6. Time and Space Complexity & Pattern Takeaway

- **Time Complexity:** **$O(n)$**. Even with a `while` loop inside the `for` loop, every index `0 .. n-1` is pushed into `dq` once and popped at most once—reducing an $O(n \cdot k)$ brute-force scan to linear $O(n)$ time!
- **Space Complexity:** **$O(k)$**, because the deque holds at most $k$ indices at any moment.
- **Pattern Learned:** Whenever you need the **minimum or maximum inside a sliding window**, use a **Monotonic Deque (`std::deque`)**: `pop_front()` expires old elements leaving the window, while `pop_back()` maintains monotonicity when new elements enter.

---

## Summary Table of Queue & Deque Problem-Solving Patterns

| Problem                                  | Core Queue / Deque Pattern                  |       Time       |      Space      |
| :--------------------------------------- | :------------------------------------------ | :--------------: | :-------------: |
| **1. Implement Queue Using Stacks**      | Lazy Two-Stack LIFO-to-FIFO Reversal        | $O(1)$ Amortized |     $O(n)$      |
| **2. Number of Recent Calls**            | Sliding Time-Window Queue Eviction          | $O(1)$ Amortized |     $O(W)$      |
| **3. Binary Tree Level Order Traversal** | Level-by-Level BFS (`levelSize = q.size()`) |      $O(n)$      |     $O(n)$      |
| **4. Rotten Oranges**                    | Multi-Source Grid BFS Shortest Propagation  | $O(m \times n)$  | $O(m \times n)$ |
| **5. Sliding Window Maximum**            | Monotonic Decreasing Deque (`std::deque`)   |      $O(n)$      |     $O(k)$      |

---

## Continue Learning in the Queue Series

You have now solved five classic competitive programming problems using Queues, BFS, and Deques! In the final step of our curriculum (**Step 6**), we will put **Queue and Stack** head to head with visual diagrams, STL comparisons, and a clear decision guide on when to use each.

- **Topic Hub:** [Queue in C++: Complete Beginner-to-Advanced Guide](/topics/queue/)
- **Previous Article (Step 4):** [Queue Implementation Using Linked List in C++](/posts/queue-using-linked-list-in-cpp/)
- **Next Article (Step 6):** [Queue vs Stack in C++: Complete Comparison](/posts/queue-vs-stack-in-cpp/)
- **Compare with Stack Problems:** [Top 5 Famous Stack Problems in Competitive Programming](/posts/top-5-stack-problems-in-cpp/)

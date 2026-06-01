---
title: "Data Structures - Tree"
author: "Shafin Chowdhury"
pubDatetime: 2026-06-01T09:08:00Z
featured: true
draft: false
tags:
  - data-structures
  - c
  - tree
description: "Proper note about tree."
---

Unlike an array, linked list, stack, or queue, a tree is a nonlinear data structure. It represents a parent-child relationship between elements. It consists of nodes connected by edges, forming a tree-like structure. The picture below will help us understand trees deeply.

![Basic Tree](https://cdn.shafinchowdhury.dev/blogs/data-structures/tree/tree3.png)

### ***Some basic key terms used in Tree data structure:***

1. **Root:** The topmost node of the tree. In other words, the root node is the one that doesn't have any parent (In the picture above the root is 1.) 
2. **Parent Node:** A node that has child nodes. (1,2,3,5 are the parent node.)
3. **Child Node:** A node that is directly connected by another node. (suppose in picture 2 is the        parent then 4,5,6 are the children of node 2.)
4. **Leaf Node:** A node without any child nodes. (4,6,7,8,9,10 are the leaf nodes)
5. **Sibling Nodes:** Nodes that share the same parent node. (2 and 3 or 7 and 8)
6. **Internal nodes:** A node has at least one child node known as an internal node
7.  **Ancestor node:-** An ancestor of a node is any predecessor node on a path from the root to that node. The root node doesn't have any ancestors. (In the tree shown in the above image, nodes 1, 2, and 5 are the ancestors of node 10.)
8. **Descendant:** The immediate ancestor of the given node is known as a descendant of a node. (In the above figure, 10 is the descendant of node 5.)
9. **Dregree:** How many nodes a parent have. ( degree of 2 is 3 and degree of 3 is 2)

![Introduction-to-Binary-Tree](https://cdn.shafinchowdhury.dev/blogs/data-structures/tree/Introduction-to-Binary-Tree.webp)

### ***Properties of Tree data structure:***

1. **Number of edges:** If there are n nodes, there would be (n-1) edges. Each arrow in the structure represents the link or path or edge. Each node, except the root node, will have at least one incoming link known as an edge. There would be one link for the parent-child relationship.

![image](https://cdn.shafinchowdhury.dev/blogs/data-structures/tree/image.png)

1. **Depth of node x:** The depth of node x can be defined as the length of the path from the root to the node x. The depth of node x can also be defined as the number of edges between the root node and the node x. The root node has 0 depth.
2.  **Height of node x:** The height of node x can be defined as the longest path from the node x to the leaf node.

![tree_anatomy](https://cdn.shafinchowdhury.dev/blogs/data-structures/tree/tree_anatomy.png)

### ***Types of Tree:***

1. **Binary Tree.**
2. **Binary search tree.**
3. **AVL tree.**
4. **B-tree.**
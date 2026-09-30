export interface LearningPathStep {
  step: number;
  title: string;
  description: string;
  postSlug: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

export interface ArticleGroup {
  name: string;
  description: string;
  postSlugs: string[];
}

export interface TopicHub {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  learningPath: LearningPathStep[];
  groups: ArticleGroup[];
  relatedTopicSlugs: string[];
}

export const TOPIC_HUBS: Record<string, TopicHub> = {
  cpp: {
    slug: "cpp",
    name: "C++",
    title: "C++ Programming & Systems Engineering",
    description:
      "Modern C++, dynamic memory allocation, Standard Template Library (STL) internals, and algorithmic optimization.",
    intro:
      "C++ gives software engineers direct control over memory, hardware resources, and performance. This pillar covers modern C++ design, pointer mechanics, STL container internals like std::list, and techniques for writing high-throughput, low-overhead code.",
    learningPath: [
      {
        step: 1,
        title: "Dynamic Memory Allocation & Heap Mechanics",
        description:
          "Master pointers, heap vs stack memory, memory leaks, and dynamic allocation fundamentals.",
        postSlug: "dynamic-memory-allocation",
        level: "Beginner",
      },
      {
        step: 2,
        title: "Mastering std::list & Linked Containers",
        description:
          "Analyze doubly-linked node architecture, iterator invalidation rules, and cache-locality trade-offs.",
        postSlug: "list-in-cpp",
        level: "Intermediate",
      },
      {
        step: 3,
        title: "Algorithmic Optimization & Raw Arithmetic",
        description:
          "Optimize runtime by avoiding heap allocations and replacing string conversions with arithmetic digit operations.",
        postSlug: "efficient-palindrome-code",
        level: "Intermediate",
      },
    ],
    groups: [
      {
        name: "Memory & Pointers",
        description:
          "Foundational heap allocation and pointer lifecycle in C/C++.",
        postSlugs: ["dynamic-memory-allocation"],
      },
      {
        name: "STL Containers",
        description:
          "In-depth architecture and usage of Standard Template Library collections.",
        postSlugs: ["list-in-cpp"],
      },
      {
        name: "Algorithmic Optimization",
        description:
          "Performance tuning and low-overhead algorithmic implementations in C++.",
        postSlugs: ["efficient-palindrome-code"],
      },
    ],
    relatedTopicSlugs: ["dsa", "mathematics"],
  },

  python: {
    slug: "python",
    name: "Python",
    title: "Python Architecture & Core Mechanics",
    description:
      "Deep dives into CPython execution mechanics, internal memory models, control flow, and core data structures.",
    intro:
      "Python pairs expressive syntax with powerful runtime mechanics. This hub breaks down how CPython executes code under the hood, how objects live in memory, and how to write Pythonic, performant software with built-in data structures.",
    learningPath: [
      {
        step: 1,
        title: "Python Fundamentals & CPython Architecture",
        description:
          "Explore bytecode compilation, PVM execution, dynamic typing, variable references, and memory mechanics.",
        postSlug: "part_01_python_fundamentals",
        level: "Beginner",
      },
      {
        step: 2,
        title: "Control Flow & Core Data Structures",
        description:
          "Dive into branching conditionals, loop controls, lists, tuples, sets, dictionaries, and Big-O efficiency.",
        postSlug: "part_02_control_flow_and_core_data_structures",
        level: "Intermediate",
      },
    ],
    groups: [
      {
        name: "Language Fundamentals & Architecture",
        description:
          "CPython execution, memory references, and core typing rules.",
        postSlugs: ["part_01_python_fundamentals"],
      },
      {
        name: "Control Flow & Built-in Collections",
        description:
          "Branching logic, loop mechanics, dynamic sequences, hash maps, and comprehensions.",
        postSlugs: ["part_02_control_flow_and_core_data_structures"],
      },
    ],
    relatedTopicSlugs: ["dsa"],
  },

  java: {
    slug: "java",
    name: "Java",
    title: "Java & Object-Oriented Software Design",
    description:
      "A complete guide to Object-Oriented Programming (OOP) in Java, from conceptual foundations to robust encapsulation.",
    intro:
      "Object-Oriented Programming is the backbone of modern enterprise software and system design. This series guides you through Java's OOP model step by step—from the overarching philosophy of objects to class blueprints and strict encapsulation.",
    learningPath: [
      {
        step: 1,
        title: "OOP in Java: The Complete Conceptual Story",
        description:
          "Understand why procedural code breaks down at scale and how OOP models the real world.",
        postSlug: "oop",
        level: "Beginner",
      },
      {
        step: 2,
        title: "Classes and Objects: Building Your First Class",
        description:
          "Translate concepts into Java code: instantiating objects, understanding constructors, and state.",
        postSlug: "class-object",
        level: "Beginner",
      },
      {
        step: 3,
        title: "Encapsulation: Protecting Internal State",
        description:
          "Enforce class invariants with private fields, validation getters/setters, and immutable design patterns.",
        postSlug: "elcapsulation",
        level: "Intermediate",
      },
    ],
    groups: [
      {
        name: "OOP Mental Model",
        description:
          "Core paradigm shifts and conceptual foundations for students.",
        postSlugs: ["oop"],
      },
      {
        name: "Class Blueprints & Instantiation",
        description:
          "Writing classes, initializing objects, and managing instance state.",
        postSlugs: ["class-object"],
      },
      {
        name: "Encapsulation & Data Protection",
        description:
          "Access modifiers, defensive copying, and data integrity safeguards.",
        postSlugs: ["elcapsulation"],
      },
    ],
    relatedTopicSlugs: ["dsa"],
  },

  dsa: {
    slug: "dsa",
    name: "Algorithms & DSA",
    title: "Data Structures & Algorithmic Engineering",
    description:
      "Essential data structures, memory layouts, algorithmic problem solving, and computational complexity.",
    intro:
      "Data structures and algorithms form the core problem-solving toolset for software developers. Here you will find rigorous examinations of linear data structures, pointer-based collections, digit-level algorithmic optimizations, and radix conversions.",
    learningPath: [
      {
        step: 1,
        title: "Dynamic Memory & Pointer Allocation",
        description:
          "The prerequisite memory model behind dynamically sized data structures and heap allocations.",
        postSlug: "dynamic-memory-allocation",
        level: "Beginner",
      },
      {
        step: 2,
        title: "The Queue Data Structure in C",
        description:
          "FIFO principles, array-based circular buffers, dynamic queues, and production C implementations.",
        postSlug: "queue",
        level: "Beginner",
      },
      {
        step: 3,
        title: "Linked Lists: std::list in Modern C++",
        description:
          "Non-contiguous node chains, O(1) insertions/deletions, iterator validity, and pointer linkage.",
        postSlug: "list-in-cpp",
        level: "Intermediate",
      },
      {
        step: 4,
        title: "Algorithmic Number Manipulation & Optimization",
        description:
          "High-performance numerical algorithms, reducing time complexity and eliminating allocation bottlenecks.",
        postSlug: "efficient-palindrome-code",
        level: "Intermediate",
      },
      {
        step: 5,
        title: "Radix Number Systems & Binary Conversions",
        description:
          "Positional notation, bit-level foundations, and algorithmic conversions between bases.",
        postSlug: "binary-number-conversions",
        level: "Beginner",
      },
    ],
    groups: [
      {
        name: "Linear Data Structures",
        description:
          "Queues, lists, and node-based sequential representations.",
        postSlugs: ["queue", "list-in-cpp"],
      },
      {
        name: "Memory & Pointers",
        description: "Dynamic heap management and pointer architectures.",
        postSlugs: ["dynamic-memory-allocation"],
      },
      {
        name: "Algorithmic Problem Solving",
        description:
          "Techniques for runtime reduction, digit manipulation, and radix arithmetic.",
        postSlugs: ["efficient-palindrome-code", "binary-number-conversions"],
      },
    ],
    relatedTopicSlugs: ["cpp", "mathematics"],
  },

  mathematics: {
    slug: "mathematics",
    name: "Mathematics",
    title: "Mathematics for Computer Science",
    description:
      "Comprehensive mathematical formulas, numeral systems, discrete structures, and problem-solving references.",
    intro:
      "Mathematics is the foundation upon which computing stands. This pillar brings together comprehensive formula cheat sheets, radix numeral systems, and discrete mathematics designed for quick reference and deep study.",
    learningPath: [
      {
        step: 1,
        title: "Positional Numeral Systems & Radix Conversions",
        description:
          "Step-by-step algorithms for converting between binary, octal, decimal, and hexadecimal bases.",
        postSlug: "binary-number-conversions",
        level: "Beginner",
      },
      {
        step: 2,
        title: "Comprehensive Mathematics Formula Cheat Sheet",
        description:
          "Master reference covering algebra, calculus, geometry, trigonometry, matrices, probability, and discrete math.",
        postSlug: "mathematics-formula-cheat-sheet",
        level: "Intermediate",
      },
    ],
    groups: [
      {
        name: "Comprehensive Formula Cheat Sheet",
        description:
          "Complete reference for algebra, calculus, matrices, probability, and discrete mathematics.",
        postSlugs: ["mathematics-formula-cheat-sheet"],
      },
      {
        name: "Number Systems & Radix Arithmetic",
        description: "Positional notation and base conversion algorithms.",
        postSlugs: ["binary-number-conversions"],
      },
    ],
    relatedTopicSlugs: ["dsa", "cpp"],
  },
};

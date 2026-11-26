// Data for the C++ roadmap page (/cpp-roadmap/).
//
// To add a topic: add an entry to TOPICS with a new stable `id` and its `stage`.
// To link an article: add its post slug (the file name in src/content/posts) to `posts`.
// The page build fails if a slug, prerequisite id or stage id doesn't exist,
// so links can never point at missing pages.

export type Level = "beginner" | "intermediate" | "advanced";

export interface Stage {
  id: string;
  title: string;
  summary: string;
  /** Optional topic hub for the whole stage. */
  hub?: { label: string; href: string };
}

export interface Topic {
  id: string;
  title: string;
  stage: string;
  level: Level;
  /** One or two sentences: what it is and why it matters. */
  summary: string;
  /** What the learner can do afterwards. */
  outcome: string;
  /** Topic ids to learn first. "Next topics" are worked out from these. */
  prereqs: string[];
  /** Post slugs on this site, most relevant first. */
  posts?: string[];
  /** Outside references, only where they genuinely help. */
  links?: { label: string; href: string }[];
}

export const LEVEL_LABEL: Record<Level, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const STAGES: Stage[] = [
  {
    id: "start",
    title: "Getting Started",
    summary: "Install the tools and run your first program.",
  },
  {
    id: "basics",
    title: "Programming Fundamentals",
    summary: "The building blocks every C++ program is made of.",
    hub: { label: "C++ topic hub", href: "/topics/cpp/" },
  },
  {
    id: "core",
    title: "Core C++ Concepts",
    summary: "How C++ works with memory: pointers, references and the heap.",
    hub: { label: "C++ topic hub", href: "/topics/cpp/" },
  },
  {
    id: "oop",
    title: "Object-Oriented Programming",
    summary: "Model programs as objects with classes.",
    hub: { label: "C++ OOP topic hub", href: "/topics/cpp-oop/" },
  },
  {
    id: "stl",
    title: "Standard Template Library",
    summary:
      "Ready-made containers and algorithms you will use every day. Learn it alongside OOP.",
  },
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    summary: "Solve problems efficiently and reason about performance.",
  },
  {
    id: "modern",
    title: "Modern & Advanced C++",
    summary: "Write safe, efficient, idiomatic modern C++.",
  },
  {
    id: "cp",
    title: "Competitive Programming",
    summary:
      "Problem-solving techniques that turn slow brute force into fast solutions, for contests and coding interviews.",
  },
  {
    id: "practice",
    title: "Practical Development",
    summary:
      "Tools and habits for real projects. You can start these any time after the fundamentals.",
  },
];

/**
 * Visual tree, top (start) to bottom. Stages in the same tier are parallel
 * branches: each one only needs the tier above it, not its neighbours.
 * The first entry is a sequence instead: side by side, but left leads to right.
 */
export const SEQUENCE: string[] = ["start", "basics"];

export const TIERS: string[][] = [
  SEQUENCE,
  ["core"],
  ["oop", "stl"],
  ["dsa", "modern"],
  ["cp", "practice"],
];

const cppref = (path: string, label = "cppreference") => ({
  label,
  href: `https://en.cppreference.com/w/cpp/${path}`,
});

export const TOPICS: Topic[] = [
  // Stage 1: Getting Started
  {
    id: "what-is-cpp",
    title: "What Is C++?",
    stage: "start",
    level: "beginner",
    summary:
      "A compiled, general-purpose language that gives you direct control over memory and performance. It powers game engines, browsers, databases and embedded devices.",
    outcome:
      "Explain what C++ is used for and how it differs from Python or Java.",
    prereqs: [],
    links: [{ label: "learncpp.com", href: "https://www.learncpp.com/" }],
  },
  {
    id: "compiler",
    title: "Installing a Compiler",
    stage: "start",
    level: "beginner",
    summary:
      "A compiler (GCC, Clang or MSVC) turns your C++ source code into a program your computer can run.",
    outcome: "Install a compiler and check its version from the terminal.",
    prereqs: ["what-is-cpp"],
  },
  {
    id: "editor",
    title: "Setting Up an Editor or IDE",
    stage: "start",
    level: "beginner",
    summary:
      "An editor such as VS Code, or an IDE such as Visual Studio or CLion, gives you highlighting, error hints and one-click builds.",
    outcome: "Write, build and run a file from your editor.",
    prereqs: ["compiler"],
    links: [
      {
        label: "VS Code C++ setup",
        href: "https://code.visualstudio.com/docs/languages/cpp",
      },
    ],
  },
  {
    id: "first-program",
    title: "Your First C++ Program",
    stage: "start",
    level: "beginner",
    summary:
      "The classic Hello, World! program: include <iostream>, write main() and print a line.",
    outcome: "Write and run a program that prints text.",
    prereqs: ["editor"],
    posts: ["cpp-input-and-output"],
  },
  {
    id: "program-structure",
    title: "Basic Program Structure",
    stage: "start",
    level: "beginner",
    summary:
      "Every program has #include lines, a main() function, statements ending in semicolons and comments.",
    outcome: "Read a short program and name each of its parts.",
    prereqs: ["first-program"],
    posts: ["cpp-input-and-output", "cpp-namespaces"],
  },
  {
    id: "compilation",
    title: "Compilation and Execution",
    stage: "start",
    level: "beginner",
    summary:
      "Source code goes through preprocessing, compiling and linking before it becomes an executable you can run.",
    outcome:
      "Compile from the command line and understand compiler error messages.",
    prereqs: ["program-structure"],
  },

  // Stage 2: Programming Fundamentals
  {
    id: "variables",
    title: "Variables and Data Types",
    stage: "basics",
    level: "beginner",
    summary:
      "Variables name a piece of memory; types like int, double, char and bool decide what it can hold and how big it is.",
    outcome:
      "Choose the right type for a value and declare variables correctly.",
    prereqs: ["compilation"],
    posts: ["cpp-variables-and-data-types"],
  },
  {
    id: "io",
    title: "Input and Output",
    stage: "basics",
    level: "beginner",
    summary:
      "cin reads input and cout prints output; getline reads a whole line including spaces.",
    outcome: "Write interactive programs that read and print values.",
    prereqs: ["variables"],
    posts: ["cpp-input-and-output"],
  },
  {
    id: "operators",
    title: "Operators",
    stage: "basics",
    level: "beginner",
    summary:
      "Arithmetic, comparison, logical and bitwise operators, and the precedence rules that decide which runs first.",
    outcome:
      "Write and correctly read expressions such as a + b * c > d && ok.",
    prereqs: ["variables"],
    posts: ["cpp-operators"],
  },
  {
    id: "type-conversion",
    title: "Type Conversion",
    stage: "basics",
    level: "beginner",
    summary:
      "C++ converts some types automatically (implicit conversion); static_cast converts explicitly and makes your intent clear.",
    outcome:
      "Avoid surprises like integer division and use static_cast when needed.",
    prereqs: ["operators"],
    posts: ["cpp-variables-and-data-types"],
  },
  {
    id: "conditionals",
    title: "Conditional Statements",
    stage: "basics",
    level: "beginner",
    summary: "if, else if, else and switch let your program make decisions.",
    outcome: "Branch your program's behaviour based on conditions.",
    prereqs: ["operators"],
    posts: ["cpp-conditional-statements"],
  },
  {
    id: "loops",
    title: "Loops",
    stage: "basics",
    level: "beginner",
    summary:
      "for, while, do-while and range-based for repeat code; break and continue control the flow.",
    outcome:
      "Repeat work with the right kind of loop and avoid off-by-one errors.",
    prereqs: ["conditionals"],
    posts: ["cpp-loops"],
  },
  {
    id: "functions",
    title: "Functions",
    stage: "basics",
    level: "beginner",
    summary:
      "Functions package reusable logic with parameters and a return value; declarations and definitions can live apart.",
    outcome: "Split a program into small, testable functions.",
    prereqs: ["loops"],
    posts: ["cpp-functions", "cpp-pass-by-value-vs-pass-by-reference"],
  },
  {
    id: "scope",
    title: "Scope",
    stage: "basics",
    level: "beginner",
    summary:
      "Scope decides where a name is visible and how long a variable lives: block, function and global scope.",
    outcome:
      "Predict which variable a name refers to and avoid accidental shadowing.",
    prereqs: ["functions"],
    posts: ["cpp-functions"],
  },
  {
    id: "namespaces",
    title: "Namespaces",
    stage: "basics",
    level: "beginner",
    summary:
      "Namespaces group names to prevent collisions; std:: is the standard library's namespace.",
    outcome:
      "Use std:: and your own namespaces, and know why using namespace std is risky in headers.",
    prereqs: ["scope"],
    posts: ["cpp-namespaces"],
  },
  {
    id: "arrays",
    title: "Arrays",
    stage: "basics",
    level: "beginner",
    summary:
      "A fixed-size block of same-type elements stored next to each other in memory, accessed by index from 0.",
    outcome:
      "Store and loop over collections, and stay within the array bounds.",
    prereqs: ["loops"],
    posts: ["cpp-arrays"],
  },
  {
    id: "strings",
    title: "Strings",
    stage: "basics",
    level: "beginner",
    summary:
      "std::string handles text safely; C-style strings are char arrays ending in '\\0'.",
    outcome: "Read, join, search and compare text with std::string.",
    prereqs: ["arrays", "io"],
    posts: ["cpp-strings"],
  },

  // Stage 3: Core C++ Concepts
  {
    id: "pointers",
    title: "Pointers",
    stage: "core",
    level: "intermediate",
    summary:
      "A pointer stores a memory address. Dereferencing it reaches the value at that address.",
    outcome: "Use &, * and pointer arithmetic, and pass data by address.",
    prereqs: ["variables", "functions", "arrays"],
    posts: ["cpp-pointers"],
  },
  {
    id: "references",
    title: "References",
    stage: "core",
    level: "intermediate",
    summary:
      "A reference is another name for an existing variable. It lets functions change their arguments without copying them.",
    outcome: "Choose between pass-by-value, pass-by-reference and pointers.",
    prereqs: ["pointers"],
    posts: ["cpp-references", "cpp-pass-by-value-vs-pass-by-reference"],
  },
  {
    id: "const",
    title: "const",
    stage: "core",
    level: "intermediate",
    summary:
      "const marks values that must not change, including const references and pointers to const.",
    outcome:
      "Make function parameters const& and read const pointer declarations.",
    prereqs: ["references"],
    posts: ["cpp-const"],
  },
  {
    id: "nullptr",
    title: "nullptr",
    stage: "core",
    level: "intermediate",
    summary:
      "nullptr is the type-safe way to say a pointer points at nothing. It replaces NULL and 0.",
    outcome: "Initialise pointers safely and check them before dereferencing.",
    prereqs: ["pointers"],
    posts: ["cpp-pointers"],
  },
  {
    id: "structs",
    title: "Structures",
    stage: "core",
    level: "beginner",
    summary:
      "A struct groups related values, such as a name and an age, into one custom type.",
    outcome: "Define your own types and pass them to functions.",
    prereqs: ["variables", "functions"],
  },
  {
    id: "stack-heap",
    title: "Stack and Heap Memory",
    stage: "core",
    level: "intermediate",
    summary:
      "Local variables live on the stack and disappear automatically. Heap memory lives until you free it.",
    outcome: "Explain where each variable lives and how long it lasts.",
    prereqs: ["pointers", "scope"],
    posts: ["cpp-pointers"],
  },
  {
    id: "dynamic-memory",
    title: "Dynamic Memory Allocation",
    stage: "core",
    level: "intermediate",
    summary:
      "new and delete (and C's malloc and free) request memory at run time, for sizes you don't know in advance.",
    outcome: "Allocate and free memory correctly and spot memory leaks.",
    prereqs: ["stack-heap", "nullptr"],
    posts: ["malloc-in-cpp", "cpp-pointers"],
  },
  {
    id: "recursion",
    title: "Recursion",
    stage: "core",
    level: "intermediate",
    summary:
      "A function that calls itself on a smaller version of the problem, with a base case that stops it.",
    outcome: "Write recursive functions and trace how the call stack grows.",
    prereqs: ["functions", "conditionals"],
    posts: ["cpp-functions"],
  },

  {
    id: "enums",
    title: "Enumerations",
    stage: "core",
    level: "beginner",
    summary:
      "enum gives names to a fixed set of values; enum class keeps those names scoped and stops accidental conversion to int.",
    outcome:
      "Replace magic numbers with named constants the compiler can check.",
    prereqs: ["variables", "conditionals"],
    links: [cppref("language/enum", "cppreference: enumerations")],
  },
  {
    id: "type-aliases",
    title: "Type Aliases (typedef and using)",
    stage: "core",
    level: "beginner",
    summary:
      "typedef and the modern using syntax give an existing type a shorter or clearer name.",
    outcome: "Read and write aliases such as using Score = long long;.",
    prereqs: ["variables"],
    links: [cppref("language/type_alias", "cppreference: type alias")],
  },
  {
    id: "function-pointers",
    title: "Function Pointers",
    stage: "core",
    level: "intermediate",
    summary:
      "A function pointer stores the address of a function, so you can pass behaviour around, for example as a callback.",
    outcome:
      "Pass a function to another function, such as a custom comparison.",
    prereqs: ["pointers", "functions"],
    links: [
      cppref(
        "language/pointer#Pointers_to_functions",
        "cppreference: pointers to functions"
      ),
    ],
  },

  // Stage 4: Object-Oriented Programming
  {
    id: "classes",
    title: "Classes and Objects",
    stage: "oop",
    level: "intermediate",
    summary:
      "A class is a blueprint that bundles data and functions; an object is one instance of it.",
    outcome: "Design a class with member variables and member functions.",
    prereqs: ["structs", "functions"],
    posts: ["cpp-classes-and-objects"],
  },
  {
    id: "access",
    title: "Access Modifiers",
    stage: "oop",
    level: "intermediate",
    summary:
      "public, private and protected control which code may touch a class's members.",
    outcome: "Hide internal details and expose a small public interface.",
    prereqs: ["classes"],
    posts: ["cpp-classes-and-objects", "cpp-encapsulation"],
  },
  {
    id: "constructors",
    title: "Constructors",
    stage: "oop",
    level: "intermediate",
    summary:
      "Special functions that set up a new object, including default, parameterised and initializer-list constructors.",
    outcome: "Guarantee every object starts in a valid state.",
    prereqs: ["classes"],
    posts: ["cpp-constructors-and-destructors"],
  },
  {
    id: "destructors",
    title: "Destructors",
    stage: "oop",
    level: "intermediate",
    summary:
      "Run automatically when an object is destroyed, the natural place to release resources.",
    outcome: "Clean up memory and other resources an object owns.",
    prereqs: ["constructors", "dynamic-memory"],
    posts: ["cpp-constructors-and-destructors"],
  },
  {
    id: "encapsulation",
    title: "Encapsulation",
    stage: "oop",
    level: "intermediate",
    summary:
      "Keep data private and change it only through methods that protect the object's rules (its invariants).",
    outcome: "Write classes that can't be put into an invalid state.",
    prereqs: ["access", "constructors"],
    posts: ["cpp-encapsulation"],
  },
  {
    id: "inheritance",
    title: "Inheritance",
    stage: "oop",
    level: "intermediate",
    summary:
      "A derived class reuses and extends a base class. Use it for real is-a relationships.",
    outcome:
      "Build class hierarchies and decide when composition is the better choice.",
    prereqs: ["encapsulation"],
    posts: ["cpp-inheritance", "cpp-composition-vs-inheritance"],
  },
  {
    id: "polymorphism",
    title: "Polymorphism",
    stage: "oop",
    level: "intermediate",
    summary:
      "One interface, many behaviours: compile-time through overloading and run-time through virtual functions.",
    outcome:
      "Call the right derived-class function through a base-class pointer.",
    prereqs: ["inheritance", "pointers"],
    posts: ["cpp-polymorphism"],
  },
  {
    id: "abstraction",
    title: "Abstraction",
    stage: "oop",
    level: "intermediate",
    summary:
      "Abstract classes with pure virtual functions define what an object does without saying how.",
    outcome: "Design interfaces that different classes can implement.",
    prereqs: ["polymorphism"],
    posts: ["cpp-abstraction"],
  },
  {
    id: "function-overloading",
    title: "Function Overloading",
    stage: "oop",
    level: "intermediate",
    summary:
      "Several functions can share a name if their parameters differ. Don't confuse this with overriding.",
    outcome: "Overload functions and tell overloading and overriding apart.",
    prereqs: ["functions", "classes"],
    posts: ["cpp-function-overloading-vs-overriding", "cpp-functions"],
  },
  {
    id: "operator-overloading",
    title: "Operator Overloading",
    stage: "oop",
    level: "intermediate",
    summary:
      "Give operators like +, == and << meaning for your own types, so they read like built-in ones.",
    outcome: "Overload common operators while following their usual meaning.",
    prereqs: ["function-overloading", "references"],
    links: [cppref("language/operators")],
  },

  {
    id: "struct-vs-class",
    title: "Struct vs Class",
    stage: "oop",
    level: "intermediate",
    summary:
      "The only language difference is default access: struct members are public, class members are private. By convention, struct is for plain data and class for types with rules to protect.",
    outcome: "Choose between struct and class on purpose.",
    prereqs: ["classes", "access", "structs"],
  },
  {
    id: "composition",
    title: "Composition",
    stage: "oop",
    level: "intermediate",
    summary:
      "Build a class out of other objects (has-a) instead of inheriting from them (is-a). It is usually the more flexible choice.",
    outcome: "Decide between composition and inheritance for a design.",
    prereqs: ["classes", "inheritance"],
    posts: ["cpp-composition-vs-inheritance"],
  },
  {
    id: "virtual-destructors",
    title: "Virtual Destructors",
    stage: "oop",
    level: "intermediate",
    summary:
      "Deleting a derived object through a base-class pointer only runs the derived destructor if the base destructor is virtual.",
    outcome: "Write base classes that clean up derived objects correctly.",
    prereqs: ["polymorphism", "destructors"],
    posts: ["cpp-polymorphism", "cpp-abstraction"],
    links: [cppref("language/destructor", "cppreference: destructors")],
  },
  {
    id: "abstract-classes",
    title: "Abstract Classes and Interfaces",
    stage: "oop",
    level: "intermediate",
    summary:
      "A class with a pure virtual function can't be instantiated. A class made only of pure virtual functions works as an interface in C++.",
    outcome: "Define an interface and write several classes that implement it.",
    prereqs: ["abstraction", "virtual-destructors"],
    posts: ["cpp-abstraction"],
    links: [
      cppref("language/abstract_class", "cppreference: abstract classes"),
    ],
  },

  // Stage 5: Standard Template Library
  {
    id: "stl-intro",
    title: "Introduction to the STL",
    stage: "stl",
    level: "intermediate",
    summary:
      "The STL is three pieces that work together: containers store data, iterators walk through it, algorithms process it.",
    outcome:
      "Know which part of the library to reach for and where to look it up.",
    // Using containers doesn't need OOP, so the STL can be learned alongside it.
    prereqs: ["functions", "arrays"],
    links: [cppref("container", "cppreference: containers")],
  },
  {
    id: "vector",
    title: "std::vector",
    stage: "stl",
    level: "beginner",
    summary:
      "A dynamic array that grows as you add elements. It's the default container to reach for.",
    outcome:
      "Use push_back, size, indexing and range-based loops with vectors.",
    prereqs: ["stl-intro"],
    links: [cppref("container/vector")],
  },
  {
    id: "stl-string",
    title: "std::string",
    stage: "stl",
    level: "beginner",
    summary:
      "std::string as a container: find, substr, insert, erase and conversions to and from numbers.",
    outcome: "Process and transform text with standard string operations.",
    prereqs: ["stl-intro", "strings"],
    posts: ["cpp-strings"],
    links: [cppref("string/basic_string")],
  },
  {
    id: "pair",
    title: "std::pair",
    stage: "stl",
    level: "beginner",
    summary:
      "Holds two values together (.first and .second). It's often returned from functions and stored in maps.",
    outcome: "Group two related values without writing a struct.",
    prereqs: ["stl-intro"],
    links: [cppref("utility/pair")],
  },
  {
    id: "list",
    title: "std::list",
    stage: "stl",
    level: "intermediate",
    summary:
      "A doubly linked list: fast insertion and removal anywhere, but no indexing and poor cache locality.",
    outcome:
      "Know when std::list is the right choice and when vector is better.",
    prereqs: ["vector", "pointers"],
    posts: ["list-in-cpp"],
  },
  {
    id: "map",
    title: "std::map",
    stage: "stl",
    level: "intermediate",
    summary:
      "Sorted key-value pairs with O(log n) lookup, insertion and removal.",
    outcome: "Count, group and look up data by key in sorted order.",
    prereqs: ["pair", "vector"],
    links: [cppref("container/map")],
  },
  {
    id: "unordered-map",
    title: "std::unordered_map",
    stage: "stl",
    level: "intermediate",
    summary: "A hash table: average O(1) lookup, with no ordering of keys.",
    outcome: "Choose between map and unordered_map for a task.",
    prereqs: ["map"],
    links: [cppref("container/unordered_map")],
  },
  {
    id: "set",
    title: "std::set",
    stage: "stl",
    level: "intermediate",
    summary: "Stores unique values in sorted order.",
    outcome: "Remove duplicates and check membership quickly.",
    prereqs: ["vector"],
    links: [cppref("container/set")],
  },
  {
    id: "unordered-set",
    title: "std::unordered_set",
    stage: "stl",
    level: "intermediate",
    summary:
      "Unique values in a hash table: average O(1) membership checks, no order.",
    outcome: "Pick the right set for the job.",
    prereqs: ["set"],
    links: [cppref("container/unordered_set")],
  },
  {
    id: "stl-stack",
    title: "std::stack",
    stage: "stl",
    level: "beginner",
    summary:
      "std::stack: last in, first out (LIFO) with push, pop and top. Built on top of another container.",
    outcome: "Use a stack for undo, bracket matching and depth-first work.",
    prereqs: ["stl-intro"],
    posts: ["understanding-stack-in-cpp"],
    links: [cppref("container/stack")],
  },
  {
    id: "stl-queue",
    title: "std::queue",
    stage: "stl",
    level: "beginner",
    summary: "std::queue: first in, first out (FIFO) with push, pop and front.",
    outcome: "Use a queue for scheduling and breadth-first work.",
    prereqs: ["stl-intro"],
    posts: ["understanding-queue-in-cpp", "queue-vs-stack-in-cpp"],
    links: [cppref("container/queue")],
  },
  {
    id: "deque",
    title: "std::deque",
    stage: "stl",
    level: "intermediate",
    summary:
      "A double-ended queue: fast insertion and removal at both ends. std::stack and std::queue use it by default.",
    outcome:
      "Use a deque when you need both ends, such as for sliding windows.",
    prereqs: ["stl-queue"],
    links: [cppref("container/deque")],
  },
  {
    id: "iterators",
    title: "Iterators",
    stage: "stl",
    level: "intermediate",
    summary:
      "Objects that point into a container. begin() and end() connect containers to algorithms.",
    outcome:
      "Loop with iterators and understand why some operations make them invalid.",
    prereqs: ["vector", "pointers"],
    links: [cppref("iterator")],
  },
  {
    id: "algorithms",
    title: "STL Algorithms",
    stage: "stl",
    level: "intermediate",
    summary:
      "sort, find, count, binary_search, accumulate and more, ready-made and well tested.",
    outcome: "Replace hand-written loops with standard algorithms.",
    prereqs: ["iterators"],
    links: [cppref("algorithm")],
  },
  {
    id: "lambdas",
    title: "Lambdas",
    stage: "stl",
    level: "intermediate",
    summary:
      "Small anonymous functions written inline. They're ideal for custom sort orders and predicates.",
    outcome: "Write lambdas with captures and pass them to algorithms.",
    prereqs: ["algorithms", "functions"],
    links: [cppref("language/lambda")],
  },

  {
    id: "priority-queue",
    title: "std::priority_queue",
    stage: "stl",
    level: "intermediate",
    summary:
      "A container adaptor that always hands you the largest element first, or the smallest with std::greater. It is a heap underneath.",
    outcome:
      "Repeatedly take the best item, as in Dijkstra's algorithm or task scheduling.",
    prereqs: ["vector"],
    links: [
      cppref("container/priority_queue", "cppreference: std::priority_queue"),
    ],
  },
  {
    id: "tuple",
    title: "std::tuple",
    stage: "stl",
    level: "intermediate",
    summary:
      "Groups any number of values of different types. Structured bindings unpack it: auto [a, b, c] = t;",
    outcome: "Return several values from a function cleanly.",
    prereqs: ["pair"],
    links: [cppref("utility/tuple", "cppreference: std::tuple")],
  },
  {
    id: "bitset",
    title: "std::bitset",
    stage: "stl",
    level: "intermediate",
    summary:
      "A fixed-size sequence of bits with fast bitwise operations, counting and printing.",
    outcome: "Store and manipulate flags or small sets compactly.",
    prereqs: ["stl-intro", "operators"],
    links: [cppref("utility/bitset", "cppreference: std::bitset")],
  },
  {
    id: "optional",
    title: "std::optional",
    stage: "stl",
    level: "intermediate",
    summary:
      'Holds either a value or nothing, so a function can report "no result" without magic values like -1 (C++17).',
    outcome: "Return a value that might be missing, safely.",
    prereqs: ["stl-intro"],
    links: [cppref("utility/optional", "cppreference: std::optional")],
  },
  {
    id: "variant",
    title: "std::variant",
    stage: "stl",
    level: "advanced",
    summary:
      "A type-safe union: it holds exactly one of several types, checked with std::visit or std::holds_alternative (C++17).",
    outcome: "Model a value that can be one of a few different types.",
    prereqs: ["optional"],
    links: [cppref("utility/variant", "cppreference: std::variant")],
  },
  {
    id: "numeric",
    title: "Numeric Algorithms",
    stage: "stl",
    level: "intermediate",
    summary:
      "The <numeric> header provides std::accumulate, std::iota, std::partial_sum, std::gcd and more for working with sequences of numbers.",
    outcome:
      "Sum, fill and combine ranges of numbers without hand-written loops.",
    prereqs: ["algorithms"],
    links: [cppref("header/numeric", "cppreference: <numeric>")],
  },

  // Stage 6: Data Structures & Algorithms
  {
    id: "complexity",
    title: "Time and Space Complexity",
    stage: "dsa",
    level: "intermediate",
    summary:
      "Big-O notation describes how running time and memory grow with input size.",
    outcome: "Estimate the complexity of your code and compare approaches.",
    prereqs: ["loops", "recursion"],
  },
  {
    id: "searching",
    title: "Searching",
    stage: "dsa",
    level: "beginner",
    summary:
      "Linear search checks every element; binary search halves a sorted range each step.",
    outcome: "Implement binary search without off-by-one bugs.",
    prereqs: ["complexity", "arrays"],
  },
  {
    id: "sorting",
    title: "Sorting",
    stage: "dsa",
    level: "intermediate",
    summary:
      "Bubble, insertion, merge and quick sort, and why std::sort is what you use in practice.",
    outcome: "Explain the trade-offs between sorting algorithms.",
    prereqs: ["complexity", "recursion"],
  },
  {
    id: "linked-lists",
    title: "Linked Lists",
    stage: "dsa",
    level: "intermediate",
    summary:
      "Nodes connected by pointers. Insertion is cheap, but there's no random access.",
    outcome: "Build, traverse and modify a linked list by hand.",
    prereqs: ["pointers", "dynamic-memory", "structs"],
    posts: ["list-in-cpp"],
  },
  {
    id: "stacks",
    title: "Stacks",
    stage: "dsa",
    level: "intermediate",
    summary:
      "Implement a LIFO stack yourself with an array, a vector and a linked list, then solve classic stack problems.",
    outcome: "Build a stack from scratch and recognise stack-shaped problems.",
    prereqs: ["stl-stack", "linked-lists"],
    posts: [
      "stack-using-array-in-cpp",
      "stack-using-vector-in-cpp",
      "stack-using-linked-list-in-cpp",
      "top-5-stack-problems-in-cpp",
    ],
  },
  {
    id: "queues",
    title: "Queues",
    stage: "dsa",
    level: "intermediate",
    summary:
      "Implement FIFO queues, including the circular queue, and use them in BFS-style problems.",
    outcome:
      "Build linear and circular queues and solve classic queue problems.",
    prereqs: ["stl-queue", "linked-lists"],
    posts: [
      "queue-using-array-in-cpp",
      "queue-using-vector-in-cpp",
      "queue-using-linked-list-in-cpp",
      "top-5-queue-problems-in-cpp",
    ],
  },
  {
    id: "trees",
    title: "Trees",
    stage: "dsa",
    level: "intermediate",
    summary:
      "Hierarchical nodes with children. Learn the preorder, inorder and postorder traversals.",
    outcome: "Traverse a binary tree recursively and iteratively.",
    prereqs: ["recursion", "linked-lists"],
  },
  {
    id: "bst",
    title: "Binary Search Trees",
    stage: "dsa",
    level: "intermediate",
    summary:
      "A tree that keeps smaller keys on the left and larger on the right, which is how std::map stays sorted.",
    outcome: "Insert, search and delete in a BST.",
    prereqs: ["trees", "searching"],
  },
  {
    id: "heaps",
    title: "Heaps",
    stage: "dsa",
    level: "advanced",
    summary:
      "A tree stored in an array that always gives you the smallest or largest element. It's what std::priority_queue uses.",
    outcome: "Use priority_queue and explain heap insertion and removal.",
    prereqs: ["trees", "vector"],
  },
  {
    id: "graphs",
    title: "Graphs",
    stage: "dsa",
    level: "advanced",
    summary:
      "Nodes and edges that model networks, maps and dependencies, stored as adjacency lists or matrices.",
    outcome: "Represent a graph in code.",
    prereqs: ["trees", "vector"],
  },
  {
    id: "bfs",
    title: "Breadth-First Search (BFS)",
    stage: "dsa",
    level: "advanced",
    summary:
      "Explores a graph level by level with a queue. It finds shortest paths when every edge has the same cost.",
    outcome: "Find shortest paths in unweighted graphs and grids.",
    prereqs: ["graphs", "queues"],
    links: [
      {
        label: "CP-Algorithms: BFS",
        href: "https://cp-algorithms.com/graph/breadth-first-search.html",
      },
    ],
  },
  {
    id: "dfs",
    title: "Depth-First Search (DFS)",
    stage: "dsa",
    level: "advanced",
    summary:
      "Explores as deep as possible before backtracking, using recursion or a stack.",
    outcome:
      "Detect cycles and connected components, and do topological sorts.",
    prereqs: ["graphs", "stacks"],
    links: [
      {
        label: "CP-Algorithms: DFS",
        href: "https://cp-algorithms.com/graph/depth-first-search.html",
      },
    ],
  },
  {
    id: "greedy",
    title: "Greedy Algorithms",
    stage: "dsa",
    level: "advanced",
    summary:
      "Make the best local choice at each step. It's fast, but only correct when the problem allows it.",
    outcome: "Recognise when greedy works and prove it on simple problems.",
    prereqs: ["sorting"],
  },
  {
    id: "dp",
    title: "Dynamic Programming",
    stage: "dsa",
    level: "advanced",
    summary:
      "Break a problem into overlapping subproblems and reuse their answers (memoization or tabulation).",
    outcome: "Turn a slow recursive solution into an efficient DP one.",
    prereqs: ["recursion", "complexity"],
  },

  {
    id: "hash-tables",
    title: "Hash Tables",
    stage: "dsa",
    level: "intermediate",
    summary:
      "A hash function maps keys to buckets for average O(1) lookup; collisions are handled by chaining or probing.",
    outcome: "Explain how unordered_map works and when it slows down.",
    prereqs: ["complexity", "unordered-map"],
  },
  {
    id: "dsu",
    title: "Disjoint Set Union (DSU)",
    stage: "dsa",
    level: "advanced",
    summary:
      "Tracks which elements belong to the same group, with near-constant-time union and find using path compression and union by size.",
    outcome: "Detect cycles and connected components quickly.",
    prereqs: ["graphs"],
    links: [
      {
        label: "CP-Algorithms: DSU",
        href: "https://cp-algorithms.com/data_structures/disjoint_set_union.html",
      },
    ],
  },
  {
    id: "topo-sort",
    title: "Topological Sorting",
    stage: "dsa",
    level: "advanced",
    summary:
      "Orders the nodes of a directed acyclic graph so every edge points forward, such as a build order or course prerequisites.",
    outcome: "Schedule tasks that depend on each other.",
    prereqs: ["dfs", "bfs"],
    links: [
      {
        label: "CP-Algorithms: topological sort",
        href: "https://cp-algorithms.com/graph/topological-sort.html",
      },
    ],
  },
  {
    id: "shortest-paths",
    title: "Shortest Paths",
    stage: "dsa",
    level: "advanced",
    summary:
      "Dijkstra's algorithm for non-negative weights, Bellman-Ford when edges can be negative, Floyd-Warshall for all pairs.",
    outcome: "Find the cheapest route in a weighted graph.",
    prereqs: ["bfs", "priority-queue"],
    links: [
      {
        label: "CP-Algorithms: Dijkstra",
        href: "https://cp-algorithms.com/graph/dijkstra.html",
      },
    ],
  },
  {
    id: "mst",
    title: "Minimum Spanning Trees",
    stage: "dsa",
    level: "advanced",
    summary:
      "Connect every node with the least total edge weight using Kruskal's algorithm (sorted edges plus DSU) or Prim's algorithm.",
    outcome: "Build the cheapest network that connects every point.",
    prereqs: ["dsu", "greedy", "sorting"],
    links: [
      {
        label: "CP-Algorithms: Kruskal",
        href: "https://cp-algorithms.com/graph/mst_kruskal.html",
      },
    ],
  },
  {
    id: "segment-tree",
    title: "Segment Trees",
    stage: "dsa",
    level: "advanced",
    summary:
      "A tree over an array that answers range queries (sum, min, max) and handles updates, each in O(log n).",
    outcome: "Answer many range queries on data that keeps changing.",
    prereqs: ["trees", "recursion"],
    links: [
      {
        label: "CP-Algorithms: segment tree",
        href: "https://cp-algorithms.com/data_structures/segment_tree.html",
      },
    ],
  },
  {
    id: "fenwick",
    title: "Fenwick Trees",
    stage: "dsa",
    level: "advanced",
    summary:
      "A compact array-based structure (binary indexed tree) for prefix sums with point updates, both in O(log n).",
    outcome: "Maintain running totals while values change.",
    prereqs: ["trees", "complexity"],
    links: [
      {
        label: "CP-Algorithms: Fenwick tree",
        href: "https://cp-algorithms.com/data_structures/fenwick.html",
      },
    ],
  },

  // Stage 7: Modern & Advanced C++
  {
    id: "templates",
    title: "Templates",
    stage: "modern",
    level: "advanced",
    summary:
      "Write a function or class once and use it with any type. This is how the STL itself is built.",
    outcome: "Write simple function and class templates.",
    prereqs: ["classes", "function-overloading"],
    links: [cppref("language/templates")],
  },
  {
    id: "exceptions",
    title: "Exception Handling",
    stage: "modern",
    level: "intermediate",
    summary:
      "throw, try and catch report errors that can't be handled where they happen.",
    outcome: "Throw and catch exceptions and know when error codes are better.",
    prereqs: ["classes", "functions"],
    links: [cppref("language/exceptions")],
  },
  {
    id: "copy-constructors",
    title: "Copy Constructors",
    stage: "modern",
    level: "intermediate",
    summary:
      "Decide how an object is copied. Shallow copies of owned pointers lead to double frees.",
    outcome: "Write a correct deep copy for a class that owns memory.",
    prereqs: ["constructors", "dynamic-memory"],
    posts: ["cpp-copy-constructor", "cpp-shallow-copy-vs-deep-copy"],
  },
  {
    id: "raii",
    title: "RAII",
    stage: "modern",
    level: "advanced",
    summary:
      "Resource Acquisition Is Initialization: tie every resource to an object's lifetime so the destructor always releases it.",
    outcome: "Design classes that can't leak memory, files or locks.",
    prereqs: ["destructors", "exceptions"],
    posts: ["cpp-constructors-and-destructors", "cpp-rule-of-three-five-zero"],
    links: [cppref("language/raii")],
  },
  {
    id: "smart-pointers",
    title: "Smart Pointers",
    stage: "modern",
    level: "advanced",
    summary:
      "unique_ptr and shared_ptr own heap memory and free it automatically, replacing most raw new and delete.",
    outcome:
      "Choose unique_ptr or shared_ptr, and stop writing delete by hand.",
    prereqs: ["raii", "dynamic-memory"],
    posts: ["malloc-in-cpp", "cpp-rule-of-three-five-zero"],
    links: [cppref("memory", "cppreference: memory")],
  },
  {
    id: "move-semantics",
    title: "Move Semantics",
    stage: "modern",
    level: "advanced",
    summary:
      "Rvalue references and std::move transfer resources instead of copying them.",
    outcome: "Explain lvalues and rvalues, and when moving saves work.",
    prereqs: ["copy-constructors", "references"],
    posts: ["cpp-rule-of-three-five-zero"],
  },
  {
    id: "move-constructors",
    title: "Move Constructors",
    stage: "modern",
    level: "advanced",
    summary:
      "Constructors and assignment operators that take over another object's resources: the Rule of Five.",
    outcome: "Apply the Rule of Three, Five and Zero to your classes.",
    prereqs: ["move-semantics"],
    posts: ["cpp-rule-of-three-five-zero"],
  },
  {
    id: "files",
    title: "File Handling",
    stage: "modern",
    level: "intermediate",
    summary:
      "ifstream and ofstream read and write files with the same << and >> you use for cin and cout.",
    outcome: "Read input from a file and write results to one.",
    prereqs: ["io", "strings"],
    links: [cppref("io", "cppreference: input/output")],
  },
  {
    id: "threads",
    title: "Multithreading",
    stage: "modern",
    level: "advanced",
    summary:
      "std::thread runs work in parallel; mutexes and atomics stop threads from corrupting shared data.",
    outcome: "Start threads safely and avoid data races.",
    prereqs: ["raii", "lambdas"],
    links: [cppref("thread", "cppreference: threads")],
  },
  {
    id: "memory-management",
    title: "Memory Management",
    stage: "modern",
    level: "advanced",
    summary:
      "Ownership, lifetimes and common bugs such as leaks, dangling pointers and double frees, plus the tools that find them.",
    outcome: "Reason about who owns each piece of memory in a program.",
    prereqs: ["smart-pointers", "move-constructors"],
    posts: ["malloc-in-cpp", "cpp-shallow-copy-vs-deep-copy"],
  },
  {
    id: "advanced-stl",
    title: "Advanced STL",
    stage: "modern",
    level: "advanced",
    summary:
      "priority_queue, custom comparators, emplace, iterator invalidation rules and choosing containers for performance.",
    outcome: "Use the STL confidently in larger programs.",
    prereqs: ["algorithms", "lambdas", "templates"],
  },
  {
    id: "modern-features",
    title: "Modern C++ Features",
    stage: "modern",
    level: "advanced",
    summary:
      "auto, structured bindings, std::optional, constexpr and other C++11–C++20 features that make code shorter and safer.",
    outcome: "Read and write modern, idiomatic C++.",
    prereqs: ["templates", "smart-pointers"],
    posts: ["cpp-const"],
    links: [
      {
        label: "C++ Core Guidelines",
        href: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines",
      },
    ],
  },

  {
    id: "constexpr",
    title: "constexpr",
    stage: "modern",
    level: "intermediate",
    summary:
      "Marks values and functions that can be computed at compile time, so the work happens before the program runs.",
    outcome: "Move fixed calculations and lookup tables to compile time.",
    prereqs: ["const", "functions"],
    links: [cppref("language/constexpr", "cppreference: constexpr")],
  },
  {
    id: "auto",
    title: "auto",
    stage: "modern",
    level: "intermediate",
    summary:
      "Lets the compiler deduce a variable's type from its initializer, which keeps long iterator and lambda types readable.",
    outcome:
      "Use auto where it helps and spell out types where it hides intent.",
    prereqs: ["variables", "iterators"],
    links: [cppref("language/auto", "cppreference: auto")],
  },
  {
    id: "decltype",
    title: "decltype",
    stage: "modern",
    level: "advanced",
    summary:
      "Gives the declared type of an expression, useful in templates and in return types that depend on the arguments.",
    outcome: "Write a function whose return type depends on its parameters.",
    prereqs: ["auto"],
    links: [cppref("language/decltype", "cppreference: decltype")],
  },
  {
    id: "type-deduction",
    title: "Type Deduction",
    stage: "modern",
    level: "advanced",
    summary:
      "The rules the compiler uses to infer template arguments and auto types, including when references and const are kept or dropped.",
    outcome: "Predict what type auto or a template parameter will become.",
    prereqs: ["templates", "decltype"],
    links: [
      cppref(
        "language/template_argument_deduction",
        "cppreference: template argument deduction"
      ),
    ],
  },
  {
    id: "concepts",
    title: "Concepts",
    stage: "modern",
    level: "advanced",
    summary:
      "Named requirements on template parameters (C++20) that give clear error messages and replace most enable_if tricks.",
    outcome: "Constrain a template so it only accepts suitable types.",
    prereqs: ["type-deduction"],
    links: [
      cppref("language/constraints", "cppreference: constraints and concepts"),
    ],
  },
  {
    id: "ranges",
    title: "Ranges",
    stage: "modern",
    level: "advanced",
    summary:
      "C++20 algorithms that take whole containers, plus composable views like filter and transform joined with |.",
    outcome: "Write data pipelines without manual iterator pairs.",
    prereqs: ["algorithms", "lambdas", "concepts"],
    links: [cppref("ranges", "cppreference: ranges library")],
  },
  {
    id: "object-lifetime",
    title: "Object Lifetime",
    stage: "modern",
    level: "advanced",
    summary:
      "When an object's life begins and ends, and why using it outside that window, through a dangling pointer or reference, is a bug.",
    outcome: "Spot dangling references and use-after-free before they ship.",
    prereqs: ["constructors", "destructors", "stack-heap"],
    links: [cppref("language/lifetime", "cppreference: object lifetime")],
  },
  {
    id: "ub",
    title: "Undefined Behavior",
    stage: "modern",
    level: "advanced",
    summary:
      "Operations the standard gives no meaning to, such as out-of-bounds access or signed overflow. The program may seem to work, then fail anywhere.",
    outcome:
      "Recognise common undefined behavior and catch it with sanitizers.",
    prereqs: ["object-lifetime", "arrays", "pointers"],
    links: [cppref("language/ub", "cppreference: undefined behavior")],
  },
  {
    id: "alignment",
    title: "Alignment",
    stage: "modern",
    level: "advanced",
    summary:
      "Each type must sit at an address that is a multiple of its alignment, so the compiler adds padding inside structs.",
    outcome: "Predict sizeof for a struct and reorder members to save memory.",
    prereqs: ["structs", "stack-heap"],
    links: [cppref("language/object#Alignment", "cppreference: alignment")],
  },

  // Stage 8: Competitive Programming
  {
    id: "prefix-sums",
    title: "Prefix Sums",
    stage: "cp",
    level: "intermediate",
    summary:
      "Precompute running totals once, then answer any range-sum query in O(1).",
    outcome: "Answer range-sum queries in constant time.",
    prereqs: ["arrays", "complexity"],
    links: [
      {
        label: "USACO Guide: prefix sums",
        href: "https://usaco.guide/silver/prefix-sums",
      },
    ],
  },
  {
    id: "two-pointers",
    title: "Two Pointers",
    stage: "cp",
    level: "intermediate",
    summary:
      "Move two indices through an array, often a sorted one, to find pairs or ranges in linear time.",
    outcome: "Solve pair-sum and merge-style problems in O(n).",
    prereqs: ["arrays", "sorting"],
    links: [
      {
        label: "USACO Guide: two pointers",
        href: "https://usaco.guide/silver/two-pointers",
      },
    ],
  },
  {
    id: "sliding-window",
    title: "Sliding Window",
    stage: "cp",
    level: "intermediate",
    summary:
      "Keep a window of elements and update its answer as it slides, instead of recomputing every window from scratch.",
    outcome: "Find the best subarray of a given size or property in O(n).",
    prereqs: ["two-pointers", "deque"],
    posts: ["top-5-queue-problems-in-cpp"],
  },
  {
    id: "binary-search-answer",
    title: "Binary Search on the Answer",
    stage: "cp",
    level: "advanced",
    summary:
      "When you can check whether a candidate answer works, and the check is monotonic, binary search over the possible answers.",
    outcome: "Turn optimisation problems into yes/no checks.",
    prereqs: ["searching"],
    links: [
      {
        label: "USACO Guide: binary search",
        href: "https://usaco.guide/silver/binary-search",
      },
    ],
  },
  {
    id: "bitmasking",
    title: "Bitmasking",
    stage: "cp",
    level: "advanced",
    summary:
      "Represent subsets as the bits of an integer to loop over every subset or run dynamic programming over them.",
    outcome: "Enumerate subsets and write bitmask DP for small inputs.",
    prereqs: ["bitset", "dp"],
    links: [
      {
        label: "CP-Algorithms: submasks",
        href: "https://cp-algorithms.com/algebra/all-submasks.html",
      },
    ],
  },
  {
    id: "number-theory",
    title: "Number Theory",
    stage: "cp",
    level: "advanced",
    summary:
      "Primes, the sieve of Eratosthenes, GCD, modular arithmetic and fast exponentiation: the maths behind many contest problems.",
    outcome:
      "Solve problems about divisibility, primes and large numbers modulo m.",
    prereqs: ["numeric", "complexity"],
    posts: ["mathematics-formula-cheat-sheet"],
    links: [
      {
        label: "CP-Algorithms: sieve",
        href: "https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html",
      },
    ],
  },

  // Stage 9: Practical Development
  {
    id: "git",
    title: "Git and GitHub",
    stage: "practice",
    level: "beginner",
    summary:
      "Version control: commit, branch and merge your work, and share it on GitHub.",
    outcome: "Keep every project in Git and push it to GitHub.",
    prereqs: ["compilation"],
    links: [{ label: "Pro Git book", href: "https://git-scm.com/book/en/v2" }],
  },
  {
    id: "debugging",
    title: "Debugging",
    stage: "practice",
    level: "intermediate",
    summary:
      "Use breakpoints, step through code and inspect variables with a debugger (gdb, lldb or your IDE) instead of guessing.",
    outcome: "Find a bug by stepping through code rather than adding prints.",
    prereqs: ["functions"],
  },
  {
    id: "testing",
    title: "Testing",
    stage: "practice",
    level: "intermediate",
    summary:
      "Small automated tests check that functions keep working as you change code.",
    outcome: "Write unit tests for your own functions.",
    prereqs: ["functions", "debugging"],
  },
  {
    id: "build-systems",
    title: "Build Systems",
    stage: "practice",
    level: "intermediate",
    summary:
      "How multi-file projects are compiled: headers, source files, object files, linking and libraries.",
    outcome: "Split a project into .h and .cpp files and build it.",
    prereqs: ["compilation", "functions"],
  },
  {
    id: "cmake",
    title: "CMake",
    stage: "practice",
    level: "intermediate",
    summary:
      "The most common way to describe a C++ project's build so it works with any compiler and IDE.",
    outcome: "Write a CMakeLists.txt for a small project.",
    prereqs: ["build-systems"],
    links: [
      {
        label: "CMake tutorial",
        href: "https://cmake.org/cmake/help/latest/guide/tutorial/index.html",
      },
    ],
  },
  {
    id: "code-organization",
    title: "Code Organization",
    stage: "practice",
    level: "intermediate",
    summary:
      "Folders, headers, namespaces and modules that keep a growing project easy to navigate.",
    outcome: "Structure a project so others can find their way around.",
    prereqs: ["build-systems", "namespaces"],
  },
  {
    id: "maintainable-code",
    title: "Writing Maintainable Code",
    stage: "practice",
    level: "intermediate",
    summary:
      "Clear names, small functions, consistent formatting and comments that explain why.",
    outcome: "Write code a teammate can read and change safely.",
    prereqs: ["code-organization"],
    links: [
      {
        label: "C++ Core Guidelines",
        href: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines",
      },
    ],
  },
  {
    id: "dev-practices",
    title: "Software Development Practices",
    stage: "practice",
    level: "intermediate",
    summary:
      "Code review, pull requests, issue tracking and continuous integration: how teams ship software together.",
    outcome: "Work on a shared codebase the way professional teams do.",
    prereqs: ["git", "testing"],
  },
];

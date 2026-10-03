---
title: "C++ Constructors and Destructors Explained"
author: "Shafin Chowdhury"
pubDatetime: 2026-10-02T09:00:00+06:00
featured: false
draft: false
tags:
  - cpp
  - oop
  - constructors
  - destructors
  - memory
description: "Master object lifecycle in C++. Learn default and parameterized constructors, member initializer lists, destructor execution order, and RAII foundations."
---

In our previous guide on [classes and objects in C++](/posts/cpp-classes-and-objects/), we saw that after instantiating an object, we had to manually populate its fields using helper functions. If someone forgot to call those functions, the object remained in an uninitialized state—frequently causing unexpected bugs or garbage values.

C++ eliminates this vulnerability through **constructors** and **destructors**. These special member functions guarantee that every object is automatically initialized into a valid state the moment it is born, and properly cleaned up when its lifetime ends.

---

## What You'll Learn

- What a constructor is and why it exists
- How to define default and parameterized constructors
- Why constructor overloading provides flexible object creation
- The critical difference between assignment inside the constructor body and a **member initializer list**
- In-class default member initialization in modern C++
- The step-by-step lifecycle of an object during creation
- What a destructor is, its syntax, and when the compiler calls it
- How constructors and destructors execute in reverse (LIFO) order across multiple objects
- How scope and lifetime govern automatic resource management (RAII)

---

## What Is a Constructor?

A **constructor** is a special member function that is automatically invoked whenever an instance of a class is created.

A constructor has two unique syntactic properties:

1. It shares the **exact same name** as the class.
2. It has **no return type**—not even `void`.

```cpp
#include <iostream>
#include <string>

using namespace std;

class Student {
public:
    string name;
    int id;

    // Default constructor: invoked automatically when an object is created
    Student() {
        name = "Unassigned";
        id = 0;
        cout << "Constructor called for student!" << endl;
    }
};

int main() {
    cout << "About to create student..." << endl;
    Student s1; // The constructor executes right here
    cout << "Student name: " << s1.name << " | ID: " << s1.id << endl;
    return 0;
}
```

```text
Output:
About to create student...
Constructor called for student!
Student name: Unassigned | ID: 0
```

Without any manual setup calls, `s1` is guaranteed to be in a predictable, valid state from the moment it is declared.

---

## Types of Constructors

### 1. The Default Constructor

A **default constructor** is a constructor that can be called with no arguments. It either accepts zero parameters or has default values for all its parameters.

If you write a class and do not declare _any_ constructors, the C++ compiler automatically synthesizes a **default constructor** for you behind the scenes. However, the synthesized constructor leaves fundamental types (like `int`, `double`, and raw pointers) uninitialized if declared on the stack.

> [!WARNING]
> If you define **any** custom constructor that takes arguments, the compiler **no longer synthesizes** the default constructor. If you still want to allow `Student s;` without arguments, you must explicitly declare a default constructor.

### 2. Parameterized Constructors

A **parameterized constructor** accepts arguments, allowing callers to supply initial values directly upon instantiation:

```cpp
#include <iostream>
#include <string>

using namespace std;

class Student {
public:
    string name;
    int id;
    double gpa;

    // Parameterized constructor
    Student(string studentName, int studentId, double studentGpa) {
        name = studentName;
        id = studentId;
        gpa = studentGpa;
    }

    void display() {
        cout << name << " (ID: " << id << ") - GPA: " << gpa << endl;
    }
};

int main() {
    // Direct initialization
    Student s1("Shafin", 101, 3.92);

    // Uniform brace initialization (Modern C++)
    Student s2{"Ayman", 102, 3.75};

    s1.display();
    s2.display();

    return 0;
}
```

```text
Output:
Shafin (ID: 101) - GPA: 3.92
Ayman (ID: 102) - GPA: 3.75
```

---

## Constructor Overloading

Just like ordinary C++ functions, constructors can be **overloaded**. You can provide multiple constructors for the same class as long as each version has a distinct parameter list (different count, types, or order of parameters).

```cpp
#include <iostream>
#include <string>

using namespace std;

class BankAccount {
public:
    string accountHolder;
    double balance;

    // Constructor 1: No arguments (default)
    BankAccount() {
        accountHolder = "Anonymous";
        balance = 0.0;
    }

    // Constructor 2: Name only
    BankAccount(string holder) {
        accountHolder = holder;
        balance = 0.0;
    }

    // Constructor 3: Name and opening deposit
    BankAccount(string holder, double initialBalance) {
        accountHolder = holder;
        balance = (initialBalance >= 0.0) ? initialBalance : 0.0;
    }

    void printSummary() {
        cout << "Holder: " << accountHolder << " | Balance: $" << balance << endl;
    }
};

int main() {
    BankAccount acc1;
    BankAccount acc2("Shafin");
    BankAccount acc3("Ayman", 1250.50);

    acc1.printSummary();
    acc2.printSummary();
    acc3.printSummary();

    return 0;
}
```

```text
Output:
Holder: Anonymous | Balance: $0
Holder: Shafin | Balance: $0
Holder: Ayman | Balance: $1250.5
```

---

## Member Initializer Lists

Many beginners initialize data members by assigning them inside the constructor body:

```cpp
Student(string name, int id) {
    this->name = name; // Assignment inside body
    this->id = id;
}
```

While this compiles and works for fundamental types, it is technically **assignment**, not **initialization**.

### Why Member Initializer Lists Are Better

In C++, member variables are initialized _before_ the constructor's curly braces `{}` are entered. If you assign values inside the constructor body:

1. The member is first default-constructed with an empty or default value.
2. The assignment operator runs, overwriting that initial value.

This performs redundant work. Furthermore, certain C++ constructs **cannot** be assigned inside the body and _require_ a member initializer list:

- `const` data members (cannot be assigned after creation)
- Reference members (must be bound immediately)
- Member objects lacking a default constructor

The **member initializer list** syntax places a colon `:` after the parameter list, followed by comma-separated member initializations:

```cpp
#include <iostream>
#include <string>

using namespace std;

class CourseEnrollment {
private:
    const int studentId; // const members MUST use initializer lists
    string courseCode;
    int credits;

public:
    // Member Initializer List: initializes members directly at allocation time
    CourseEnrollment(int id, string code, int creds)
        : studentId(id), courseCode(code), credits(creds) {
        // Constructor body can remain empty or perform validation
        cout << "Enrolled student " << studentId << " in " << courseCode << endl;
    }

    void display() {
        cout << "Student: " << studentId
             << " | Course: " << courseCode
             << " | Credits: " << credits << endl;
    }
};

int main() {
    CourseEnrollment enrollment(101, "CSE201", 3);
    enrollment.display();
    return 0;
}
```

```text
Output:
Enrolled student 101 in CSE201
Student: 101 | Course: CSE201 | Credits: 3
```

> [!TIP]
> **Initialization Order**: Member variables are always initialized in the order they are **declared inside the class definition**, _not_ the order they appear in the member initializer list. To avoid compiler warnings and subtle bugs, always list initializers in declaration order.

### Default Member Initialization (Modern C++)

In modern C++ (C++11 and newer), you can specify default member initializers directly inside the class declaration. The member initializer list overrides these defaults if specified:

```cpp
class ServerConfig {
public:
    string host{"127.0.0.1"};
    int port{8080};
    int maxConnections{100};

    // Uses defaults for host and port, overrides maxConnections
    ServerConfig(int maxConn) : maxConnections(maxConn) {}

    // Default constructor uses all defaults
    ServerConfig() = default;
};
```

---

## What Happens When an Object Is Created?

When C++ creates an object, execution follows an exact sequence:

1. **Storage allocation**: Memory is reserved for the object on the stack or heap.
2. **Base classes initialized**: If the class inherits from a base class, the base constructor runs first.
3. **Data members initialized**: Member variables are constructed in order of their class declaration using member initializer lists or default member initializers.
4. **Constructor body executed**: Code inside `{ ... }` runs to perform additional setup or validation.

---

## What Is a Destructor?

A **destructor** is a special member function that is automatically invoked when an object reaches the end of its lifetime and is destroyed.

Key characteristics of a destructor:

1. It shares the class name preceded by a tilde symbol (`~`).
2. It takes **no arguments** and has **no return type**.
3. A class can have **only one destructor** (destructors cannot be overloaded).

### Destructor Syntax

```cpp
#include <iostream>
#include <string>

using namespace std;

class DatabaseConnection {
private:
    string connectionName;

public:
    DatabaseConnection(string name) : connectionName(name) {
        cout << "[OPEN] Connection opened: " << connectionName << endl;
    }

    ~DatabaseConnection() {
        cout << "[CLOSE] Connection closed: " << connectionName << endl;
    }
};

int main() {
    cout << "Entering main function..." << endl;
    {
        // Inner block scope begins
        DatabaseConnection db("ProductionDB");
        cout << "Inside inner block, executing queries..." << endl;
        // Inner block scope ends here: db is destroyed automatically!
    }
    cout << "Exited inner block. Continuing main function..." << endl;

    return 0;
}
```

```text
Output:
Entering main function...
[OPEN] Connection opened: ProductionDB
Inside inner block, executing queries...
[CLOSE] Connection closed: ProductionDB
Exited inner block. Continuing main function...
```

Notice that the destructor executed automatically when the closing brace `}` was reached, before "Exited inner block" printed. No manual cleanup calls were necessary.

---

## Execution Order: Multiple Objects and LIFO Destruction

When multiple local objects are declared within the same scope, C++ constructs them in the order they are declared. When the scope exits, C++ destroys them in **reverse order of construction** (Last In, First Out — LIFO).

This mirrors how the runtime stack works: variables pushed onto the stack most recently must be popped off first.

```cpp
#include <iostream>
#include <string>

using namespace std;

class Tracker {
private:
    string label;

public:
    Tracker(string name) : label(name) {
        cout << "Constructing: " << label << endl;
    }

    ~Tracker() {
        cout << "Destructing:  " << label << endl;
    }
};

int main() {
    cout << "--- Scope Begins ---" << endl;
    Tracker first("First");
    Tracker second("Second");
    Tracker third("Third");
    cout << "--- Scope Ending ---" << endl;

    return 0;
}
```

```text
Output:
--- Scope Begins ---
Constructing: First
Constructing: Second
Constructing: Third
--- Scope Ending ---
Destructing:  Third
Destructing:  Second
Destructing:  First
```

```text
Stack Construction & Destruction:
1. Push 'First'   ───► Destruct 'First'   (Last)
2. Push 'Second'  ───► Destruct 'Second'  (Middle)
3. Push 'Third'   ───► Destruct 'Third'   (First to be popped)
```

This guaranteed reverse-order destruction is essential for dependent objects. If `third` depends on `first`, `third` is safely torn down while `first` is still alive.

---

## Basic Concept of RAII

The pairing of constructors and destructors forms the core of the most celebrated design pattern in C++: **Resource Acquisition Is Initialization (RAII)**.

Under RAII:

- A resource (heap memory, file handle, database connection, thread, mutex lock) is acquired inside the **constructor**.
- The resource is released inside the **destructor**.

Because the C++ compiler guarantees that destructors run when objects exit scope—even if a function returns early or throws an exception—RAII prevents resource leaks automatically.

---

## Common Beginner Mistakes

### 1. The "Most Vexing Parse"

Attempting to invoke a default constructor with empty parentheses causes C++ to parse the line as a **function declaration** rather than an object instantiation:

```cpp
class Timer {
public:
    Timer() { cout << "Timer started" << endl; }
};

int main() {
    Timer t(); // WARNING: Declares a function named 't' returning a Timer!
    // Nothing is printed because no Timer object was constructed!

    Timer properTimer;   // Correct: no parentheses for default constructor
    Timer modernTimer{}; // Correct: uniform initialization (preferred in modern C++)
    return 0;
}
```

### 2. Calling the Destructor Manually

Beginners sometimes write `obj.~Student();` assuming it deletes the object. In C++, calling a destructor manually does **not** deallocate the memory. When the object eventually leaves scope, the compiler will invoke the destructor a second time, resulting in **undefined behavior** (often a double-free crash). Never call destructors manually on automatic (stack) objects.

### 3. Relying on Uninitialized Primitive Data Members

If you write a default constructor but forget to initialize fundamental members, they retain garbage values:

```cpp
class Score {
public:
    int points; // Garbage if not initialized!
    Score() {}  // Forgot to initialize points
};
```

**Fix:** Use default member initializers (`int points{0};`) or a member initializer list.

---

## Best Practices

1. **Always prefer member initializer lists**: They avoid default construction followed by assignment and are mandatory for `const` and reference members.
2. **Use default member initializers for sensible baselines**: Set defaults directly in the class header so all constructors start with known values.
3. **Keep constructors and destructors focused**: Constructors should establish valid invariants; destructors should release owned resources.
4. **Use `= default` when possible**: If you need an empty default constructor alongside parameterized constructors, write `ClassName() = default;` to keep the class trivial where possible.
5. **Rely on automatic destruction**: Never write manual cleanup functions like `cleanup()` or `close()` that callers must remember to invoke. Let the destructor handle it.

---

## Summary

- **Constructors** guarantee that objects are initialized immediately upon creation.
- A **default constructor** takes no arguments; a **parameterized constructor** initializes an object with custom values.
- Constructors can be **overloaded** with different parameter lists.
- **Member initializer lists** (`: member(value)`) initialize members before the constructor body executes and are required for `const` and reference members.
- **Destructors** (`~ClassName()`) execute automatically when an object goes out of scope or is deleted.
- Multiple local objects are destroyed in **reverse order of construction (LIFO)**.
- Automatic destruction is the foundation of **RAII** in modern C++.

---

## What's Next in the Series?

Now that we know how objects are created, initialized, and destroyed, we need to consider how to protect their internal data from being corrupted during their lifetime.

If all variables in a class are accessible to external code, anyone can bypass our rules and break our objects. In the next guide, we explore **encapsulation**, data hiding, getters, setters, and class invariants.

---

## Continue Learning C++ OOP

- **Previous Article:** [C++ Classes and Objects: A Beginner's Guide](/posts/cpp-classes-and-objects/)
- **Next Article:** [C++ Encapsulation: Data Hiding, Getters and Setters](/posts/cpp-encapsulation/)
- **Topic Hub:** Explore the full curriculum on the [C++ Object-Oriented Programming Topic Hub](/topics/cpp-oop/)
- **Related Fundamental:** [Const Correctness & constexpr in C++](/posts/cpp-const/)

---
title: "C++ Polymorphism: Compile-Time vs Runtime Polymorphism"
author: "Shafin Chowdhury"
pubDatetime: 2026-10-02T12:00:00+06:00
featured: false
draft: false
tags:
  - cpp
  - oop
  - polymorphism
  - virtual-functions
  - dynamic-dispatch
description: "Master polymorphism in modern C++. Understand compile-time vs runtime polymorphism, virtual functions, dynamic dispatch, the override specifier, and virtual destructors."
---

In our previous article on [inheritance](/posts/cpp-inheritance/), we learned how derived classes acquire state and behavior from a base class. But inheritance only unlocks its true architectural potential when paired with **polymorphism**.

Polymorphism allows you to treat derived objects as instances of their base class, while still executing their specialized, derived behaviors automatically at runtime. It is the mechanism that enables extensible systems, plugins, and scalable software design.

---

## What You'll Learn

- What polymorphism means conceptually and practically
- The difference between **compile-time (static)** and **runtime (dynamic)** polymorphism
- How **function overloading** achieves static polymorphism
- Why **virtual functions** are necessary for dynamic dispatch
- What happens with and without the `virtual` keyword when using base pointers
- How to write safe, maintainable code using the modern `override` specifier
- Why polymorphic base classes **must have virtual destructors**
- An introduction to pure virtual functions
- An advanced technical note on the **vtable (virtual table)** mechanism

---

## What Is Polymorphism?

The word **polymorphism** is derived from Greek: _poly_ meaning "many" and _morph_ meaning "form." In computer science, polymorphism is the ability of different types to respond to the same interface or function call in their own type-specific way.

In C++, polymorphism falls into two distinct categories:

```text
                             Polymorphism in C++
                                      |
             +------------------------+------------------------+
             |                                                 |
             v                                                 v
  Compile-Time (Static)                              Runtime (Dynamic)
  - Resolved at compile time                         - Resolved at execution time
  - Zero runtime overhead                            - Modest pointer indirection
  - Function Overloading                             - Virtual Functions
  - Operator Overloading                             - Base Pointers & References
  - Templates                                        - Dynamic Dispatch
```

---

## Compile-Time (Static) Polymorphism

Under **compile-time polymorphism**, the compiler determines precisely which function implementation to call during the compilation process. This decision is based on function signatures, argument types, or template parameters. It is also known as **early binding** or **static dispatch**.

The most common form is **function overloading**:

```cpp
#include <iostream>
#include <string>

using namespace std;

class Calculator {
public:
    // Overload 1: Two integers
    int add(int a, int b) {
        return a + b;
    }

    // Overload 2: Two doubles
    double add(double a, double b) {
        return a + b;
    }

    // Overload 3: Three integers
    int add(int a, int b, int c) {
        return a + b + c;
    }
};

int main() {
    Calculator calc;

    // The compiler knows at compile time which add() function to bind
    cout << "Sum (int, int): " << calc.add(10, 20) << endl;
    cout << "Sum (double, double): " << calc.add(5.5, 4.2) << endl;
    cout << "Sum (int, int, int): " << calc.add(1, 2, 3) << endl;

    return 0;
}
```

```text
Output:
Sum (int, int): 30
Sum (double, double): 9.7
Sum (int, int, int): 6
```

Because the resolution happens entirely at compile time, static polymorphism incurs **zero runtime performance penalty**.

---

## Runtime (Dynamic) Polymorphism

In many scenarios, the exact type of an object cannot be known at compile time.

Imagine developing a video game: players encounter enemies that spawn dynamically based on difficulty. When your loop iterates over a list of enemies to call `attack()`, each enemy (`Zombie`, `Dragon`, `Archer`) must execute its own specialized attack routine.

This requires **runtime polymorphism** (also called **late binding** or **dynamic dispatch**), where the decision of which function to execute is deferred to the moment the program runs.

In C++, runtime polymorphism requires three elements:

1. An **inheritance hierarchy**.
2. Member functions marked with the **`virtual`** keyword in the base class.
3. Accessing derived objects through **base-class pointers** (`Base*`) or **base-class references** (`Base&`).

---

## The Problem: Without `virtual`

To appreciate what `virtual` does, let's first observe what happens when we omit it:

```cpp
#include <iostream>

using namespace std;

class Animal {
public:
    void sound() {
        cout << "Animal makes a generic sound" << endl;
    }
};

class Dog : public Animal {
public:
    void sound() {
        cout << "Dog barks: Woof! Woof!" << endl;
    }
};

int main() {
    Dog myDog;
    Animal* ptr = &myDog; // Base pointer pointing to a derived Dog object

    // What will this call?
    ptr->sound();

    return 0;
}
```

```text
Output:
Animal makes a generic sound
```

### Why Did That Happen?

Even though the actual object living in memory is a `Dog`, C++ invoked `Animal::sound()`!

Because `sound()` was **not** marked `virtual`, the compiler used **early binding (static dispatch)**. It looked solely at the _declared type of the pointer_ (`Animal*`), ignored the actual underlying object type, and hardcoded a direct call to `Animal::sound()` into the binary.

---

## The Solution: The `virtual` Keyword

When you declare a member function as **`virtual`** in a base class, you instruct the compiler:

> _"Do not bind this call at compile time based on the pointer's type. Instead, check the actual object at runtime and call its overridden version."_

Let's modify our code to include `virtual` and the modern **`override`** keyword:

```cpp
#include <iostream>

using namespace std;

class Animal {
public:
    // Virtual function enables dynamic dispatch
    virtual void sound() {
        cout << "Animal makes a generic sound" << endl;
    }

    // Virtual destructor is critical for polymorphic base classes!
    virtual ~Animal() {
        cout << "[Animal Destructor]" << endl;
    }
};

class Dog : public Animal {
public:
    // 'override' verifies we are correctly overriding a base virtual function
    void sound() override {
        cout << "Dog barks: Woof! Woof!" << endl;
    }

    ~Dog() override {
        cout << "[Dog Destructor]" << endl;
    }
};

class Cat : public Animal {
public:
    void sound() override {
        cout << "Cat meows: Meow! Meow!" << endl;
    }

    ~Cat() override {
        cout << "[Cat Destructor]" << endl;
    }
};

// Polymorphic utility function accepting a base reference
void playSound(Animal& animal) {
    animal.sound(); // Dynamically dispatches to the correct derived version!
}

int main() {
    Dog dog;
    Cat cat;

    cout << "--- Calling via Base References ---" << endl;
    playSound(dog);
    playSound(cat);

    cout << "\n--- Calling via Base Pointer & Heap Allocation ---" << endl;
    Animal* animalPtr = new Dog();
    animalPtr->sound(); // Dispatches to Dog::sound()!

    delete animalPtr; // Cleans up Dog then Animal safely via virtual destructor

    return 0;
}
```

```text
Output:
--- Calling via Base References ---
Dog barks: Woof! Woof!
Cat meows: Meow! Meow!

--- Calling via Base Pointer & Heap Allocation ---
Dog barks: Woof! Woof!
[Dog Destructor]
[Animal Destructor]
```

Now, `animalPtr->sound()` and `playSound(dog)` correctly execute the dog's bark! Even though the function parameter is declared as `Animal&`, dynamic dispatch identifies the concrete object type at runtime and routes execution to the appropriate implementation.

---

## Why the `override` Keyword Matters (C++11)

In older C++, developers simply redeclared the function name in derived classes. However, if you made a slight typo in the function name, changed the parameter types, or missed a `const` qualifier, you were **not** overriding the function—you were unintentionally declaring a completely new function!

The compiler would silently fall back to calling the base function, leading to notoriously difficult bugs.

Modern C++ introduced the **`override`** specifier. When you append `override` to a derived member function declaration:

- The compiler verifies that the base class contains a `virtual` function with the **exact same signature**.
- If the signatures do not match, compilation **fails immediately with a helpful error**.

```cpp
class Animal {
public:
    virtual void sound() const { /* ... */ }
};

class Dog : public Animal {
public:
    // If you forget 'const', the signatures don't match!
    // void sound() override; // COMPILE ERROR: does not override any base function!

    void sound() const override { // Matches exactly! Compiles cleanly.
        cout << "Woof!" << endl;
    }
};
```

> [!TIP]
> Always mark overridden member functions in derived classes with `override`. It acts as an automated compile-time safety check and explicitly documents your design to other developers.

---

## Crucial Rule: Virtual Destructors

If your class contains even one virtual function, or is intended to be used as a polymorphic base class, **its destructor must be declared `virtual`**:

```cpp
class Base {
public:
    virtual ~Base() = default; // Essential!
};
```

### What Happens Without a Virtual Destructor?

Consider deleting a derived object through a pointer to its base class:

```cpp
Animal* ptr = new Dog();
delete ptr; // UNDEFINED BEHAVIOR if ~Animal() is not virtual!
```

If `~Animal()` is not virtual:

1. The compiler uses static binding to resolve the destructor call.
2. It invokes **only `~Animal()`**, completely skipping `~Dog()`.
3. Any memory, file handles, or network sockets allocated inside `Dog` are **leaked**.
4. According to the C++ standard (ISO C++ §8.3.5), deleting an object of derived type through a pointer to a base type without a virtual destructor results in **undefined behavior**.

Declaring the base destructor `virtual` guarantees that the full destruction chain runs: `~Dog()` executes first, followed by `~Animal()`.

---

## Introduction to Pure Virtual Functions

Sometimes, a base class represents a concept that is so abstract that it cannot provide a sensible default implementation for a function.

For example, what is the "sound" of a generic `Shape` or a generic `PaymentMethod`? It doesn't have one!

C++ allows you to declare a **pure virtual function** by appending `= 0` to the function declaration:

```cpp
class Shape {
public:
    // Pure virtual function
    virtual double calculateArea() const = 0;

    virtual ~Shape() = default;
};
```

A class containing at least one pure virtual function is called an **abstract class**. You cannot instantiate objects of an abstract class. Derived classes must provide concrete implementations for all pure virtual functions to be instantiated.

We explore abstract classes and interfaces thoroughly in the next article, [C++ Abstraction](/posts/cpp-abstraction/).

---

## Advanced Note: How Dynamic Dispatch Works Under the Hood

> [!NOTE]
> This section explains how modern C++ compilers (GCC, Clang, MSVC) implement dynamic dispatch. The exact mechanism is an implementation detail (part of the platform's ABI), but virtually all compilers use the **Virtual Table (vtable)** pattern.

### The Virtual Table (vtable)

When a class defines or inherits at least one virtual function, the compiler creates a static array of function pointers called a **vtable** (virtual method table) for that class:

- `Animal vtable` contains a pointer to `Animal::sound()`.
- `Dog vtable` contains a pointer to `Dog::sound()`.
- `Cat vtable` contains a pointer to `Cat::sound()`.

### The Virtual Pointer (vptr)

Every object instance of a polymorphic class has a hidden pointer inserted into its memory layout by the compiler, known as the **vptr** (virtual table pointer).
When an object is constructed:

- A `Dog` object's `vptr` is initialized to point to the `Dog vtable`.
- A `Cat` object's `vptr` is initialized to point to the `Cat vtable`.

```text
Object in Memory (Dog)          Dog vtable (Static Memory)
+-----------------------+       +------------------------------------+
| vptr (8 bytes)        | ----> | sound() -> &Dog::sound             |
| member variables...   |       | ~Animal() -> &Dog::~Dog            |
+-----------------------+       +------------------------------------+
```

When you execute `ptr->sound()`:

1. The CPU reads the object's `vptr`.
2. It looks up the function pointer at the known offset for `sound()` in that specific vtable.
3. It performs an indirect call to that address.

This single pointer indirection takes only a few nanoseconds on modern hardware, giving C++ powerful runtime flexibility with negligible runtime overhead.

---

## Common Beginner Mistakes

### 1. Object Slicing

Assigning a derived object to a base object by value **slices off** all derived state and virtual behavior:

```cpp
Dog dog;
Animal a = dog; // OBJECT SLICING!
a.sound(); // Calls Animal::sound(), NOT Dog::sound()!
```

To preserve polymorphic behavior, always pass objects by **reference** (`Animal&`) or **pointer** (`Animal*`).

### 2. Forgetting `virtual` in the Base Class

Marking `override` in a derived class does not make a function virtual if it was not already virtual in the base class. The virtuality must originate in the base class.

### 3. Calling Virtual Functions in Constructors or Destructors

In C++, calling a virtual function inside a base constructor executes the **base-class version**, not the derived-class version. This is because the derived object has not yet been constructed! Avoid calling virtual functions within constructors and destructors.

---

## Best Practices

1. **Always declare base destructors `virtual`**: If a class has virtual functions, its destructor must be `virtual`.
2. **Use the `override` keyword on all derived overrides**: It turns subtle signature typos into immediate compile-time errors.
3. **Pass polymorphic objects by reference or pointer**: Prevent object slicing by accepting `const Base&` or `Base*`.
4. **Prefer compile-time polymorphism when runtime flexibility is unneeded**: If types are known at compile time, templates and function overloading provide zero-cost static dispatch.

---

## Summary

- **Polymorphism** allows treating derived objects through base-class interfaces while preserving specialized behaviors.
- **Compile-time polymorphism** (function overloading, templates) is resolved at compile time with zero runtime overhead.
- **Runtime polymorphism** relies on **virtual functions**, base pointers/references, and dynamic dispatch.
- Omitting `virtual` leads to early binding based strictly on the pointer's declared type.
- The **`override` specifier** ensures the compiler validates your function signature against the base class.
- Polymorphic base classes must declare **virtual destructors** to prevent resource leaks and undefined behavior.
- Compilers typically implement dynamic dispatch using **vtables** and **vptrs**.

---

## What's Next in the Series?

Now that we understand how virtual functions enable dynamic dispatch, what happens when a base class represents a pure blueprint that should never be instantiated directly?

In the next guide, we explore **abstraction**: pure virtual functions, abstract classes, and how to build pure interfaces in C++.

---

## Continue Learning C++ OOP

- **Previous Article:** [C++ Inheritance: Base Classes, Derived Classes and Access](/posts/cpp-inheritance/)
- **Next Article:** [C++ Abstraction: Abstract Classes and Pure Virtual Functions](/posts/cpp-abstraction/)
- **Topic Hub:** Explore the full curriculum on the [C++ Object-Oriented Programming Topic Hub](/topics/cpp-oop/)
- **Related Deep Dive:** [Function Overloading vs Function Overriding in C++](/posts/cpp-function-overloading-vs-overriding/)

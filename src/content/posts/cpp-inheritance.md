---
title: "C++ Inheritance: Base Classes, Derived Classes and Access"
author: "Shafin Chowdhury"
pubDatetime: 2026-10-02T11:00:00+06:00
featured: false
draft: false
tags:
  - cpp
  - oop
  - inheritance
  - base-class
  - derived-class
description: "Learn C++ inheritance from the ground up. Understand base and derived classes, access behavior under public inheritance, constructor call order, and the is-a relationship."
---

In our previous article on [encapsulation](/posts/cpp-encapsulation/), we learned how to design robust, self-contained classes that protect their internal state. However, in real-world systems, entities rarely exist in complete isolation.

Consider modeling an educational institution: you need classes for `Student`, `Professor`, and `Staff`. All of them share fundamental human attributes: a legal name, government identification, and email address. Copy-pasting those identical fields across three separate classes produces maintenance nightmares.

C++ solves this through **inheritance**: a mechanism that allows a new class to acquire properties and behaviors from an existing class, establishing a structured hierarchy.

---

## What You'll Learn

- What inheritance is and why it exists
- The concept of a **base class** (parent) and a **derived class** (child)
- Basic inheritance syntax in C++
- The role of `protected` members
- The access behavior table under `public` inheritance
- Forms of inheritance: Single, Multilevel, Hierarchical, and Multiple
- Constructor and destructor invocation order in inheritance hierarchies
- How to initialize base classes using member initializer lists
- The crucial **"is-a" relationship** and why inheritance is not merely a tool for code reuse

---

## What Is Inheritance?

**Inheritance** is a mechanism in C++ where a new class—called the **derived class** (or subclass/child class)—is defined based on an existing class—called the **base class** (or superclass/parent class).

The derived class automatically inherits the non-private data members and member functions of the base class. The derived class can then:

1. **Reuse** base-class functionality as-is.
2. **Extend** the base class by adding new attributes and member functions.
3. **Specialize** behavior by providing custom implementations for inherited functions (paving the way for polymorphism).

```text
               +---------------------------+
               |     Base Class: Person    |
               | - name: string            |
               | - id: int                 |
               +-------------+-------------+
                             |
             +---------------+---------------+
             |                               |
             v                               v
+---------------------------+   +---------------------------+
|   Derived Class: Student  |   |  Derived Class: Professor |
| - major: string           |   | - department: string      |
| - gpa: double             |   | - publications: int       |
+---------------------------+   +---------------------------+
```

---

## The "Is-A" Relationship

Before writing any inheritance code, every C++ developer must understand the fundamental design test: **the "is-a" rule**.

Inheritance should only be employed when the derived class genuinely represents a more specialized subtype of the base class:

- A `Student` **is a** `Person`. (Valid)
- A `Car` **is a** `Vehicle`. (Valid)
- A `Dog` **is an** `Animal`. (Valid)

If you find yourself tempted to inherit simply because class B wants to borrow some utility functions from class A, stop. For example, a `Car` **has an** `Engine`, but a `Car` **is not an** `Engine`. Modeling that relationship through inheritance is an architectural defect.

When entities share a "has-a" relationship, the correct design is **composition**, which we examine in detail in [Article 8: Composition vs Inheritance](/posts/cpp-composition-vs-inheritance/).

---

## Basic Inheritance Syntax

In C++, inheritance is declared using a colon `:` following the derived class name, accompanied by an **inheritance access specifier** (most commonly `public`):

```cpp
class DerivedClass : public BaseClass {
    // New members and member functions specific to DerivedClass
};
```

Let's write a complete program modeling `Person` and `Student`:

```cpp
#include <iostream>
#include <string>

using namespace std;

// Base Class
class Person {
private:
    string name;
    int age;

public:
    Person(string personName, int personAge)
        : name(personName), age(personAge) {
        cout << "[Person Constructor] Initialized: " << name << endl;
    }

    void introduce() const {
        cout << "Hello, my name is " << name << " and I am " << age << " years old." << endl;
    }

    string getName() const {
        return name;
    }
};

// Derived Class inheriting publicly from Person
class Student : public Person {
private:
    int studentId;
    string major;

public:
    // Base class constructor MUST be initialized via the member initializer list
    Student(string name, int age, int id, string studentMajor)
        : Person(name, age), studentId(id), major(studentMajor) {
        cout << "[Student Constructor] Initialized ID: " << studentId << endl;
    }

    void study() const {
        cout << getName() << " is studying " << major << " for upcoming exams." << endl;
    }
};

int main() {
    cout << "Creating student object..." << endl;
    Student student1("Shafin", 21, 101, "Computer Science");

    cout << "\nInvoking inherited behavior:" << endl;
    student1.introduce(); // Inherited directly from Person!

    cout << "\nInvoking derived-specific behavior:" << endl;
    student1.study();     // Defined specifically inside Student

    return 0;
}
```

```text
Output:
Creating student object...
[Person Constructor] Initialized: Shafin
[Student Constructor] Initialized ID: 101

Invoking inherited behavior:
Hello, my name is Shafin and I am 21 years old.

Invoking derived-specific behavior:
Shafin is studying Computer Science for upcoming exams.
```

Notice the output: `student1` could immediately call `introduce()`, even though that function was authored inside `Person`.

---

## Base-Class Member Access and `protected`

How do access specifiers in the base class affect the derived class?

1. **`private` members**: Are **inaccessible** directly within the derived class. They are inherited in terms of memory storage, but derived member functions cannot name or access them directly. They must be accessed through base public/protected getters or setters.
2. **`public` members**: Remain fully accessible anywhere the object is visible.
3. **`protected` members**: Provide a middle ground. A `protected` member is **inaccessible to the outside world** (behaving like `private`), but is **directly accessible** to member functions of derived classes.

```cpp
#include <iostream>
#include <string>

using namespace std;

class Vehicle {
protected:
    int currentSpeed; // Accessible by derived classes, hidden from main()

private:
    string vinNumber; // Strictly private to Vehicle

public:
    Vehicle(int speed, string vin) : currentSpeed(speed), vinNumber(vin) {}

    void honk() const {
        cout << "Beep beep!" << endl;
    }
};

class Car : public Vehicle {
private:
    int passengerCapacity;

public:
    Car(int speed, string vin, int capacity)
        : Vehicle(speed, vin), passengerCapacity(capacity) {}

    void accelerate(int delta) {
        // Direct access to protected member of base class:
        currentSpeed += delta;
        cout << "Accelerated to: " << currentSpeed << " km/h" << endl;

        // string v = vinNumber; // COMPILE ERROR: vinNumber is strictly private to Vehicle!
    }
};

int main() {
    Car myCar(50, "1HGCR2F83HA000000", 5);
    myCar.honk();
    myCar.accelerate(30);

    // myCar.currentSpeed = 100; // COMPILE ERROR: currentSpeed is protected!
    return 0;
}
```

```text
Output:
Beep beep!
Accelerated to: 80 km/h
```

### Access Behavior Under Public Inheritance

| Base Member Specifier | Accessibility Inside Derived Class       | Accessibility From Outside (`main`) |
| :-------------------- | :--------------------------------------- | :---------------------------------- |
| `public`              | Accessible directly                      | Accessible directly                 |
| `protected`           | Accessible directly                      | **Inaccessible** (hidden)           |
| `private`             | **Inaccessible** (must use base getters) | **Inaccessible** (hidden)           |

> [!TIP]
> While C++ also supports `protected` and `private` inheritance (`class B : private A`), these are advanced, specialized tools that do **not** model an "is-a" relationship. Over 95% of object-oriented C++ designs utilize **`public` inheritance**.

---

## Forms of Inheritance

C++ supports multiple organizational hierarchies:

```text
Single:          Multilevel:        Hierarchical:         Multiple:
  Base              Grandparent           Base           Base1   Base2
   |                     |               /    \             \     /
Derived                Parent       Derived1  Derived2       Derived
                         |
                       Child
```

### 1. Single Inheritance

A derived class inherits from exactly one base class (`Person -> Student`).

### 2. Multilevel Inheritance

A class inherits from a derived class, forming a chain:

```cpp
class LivingThing { /* ... */ };
class Animal : public LivingThing { /* ... */ };
class Dog : public Animal { /* ... */ };
```

### 3. Hierarchical Inheritance

Multiple derived classes inherit from a shared base class (`Vehicle -> Car`, `Vehicle -> Truck`, `Vehicle -> Motorcycle`).

### 4. Multiple Inheritance

A derived class inherits from **more than one base class** simultaneously:

```cpp
class Printable { /* ... */ };
class Serializable { /* ... */ };
class Document : public Printable, public Serializable { /* ... */ };
```

While multiple inheritance is powerful, it can lead to complications such as the **Diamond Problem** (where two base classes inherit from a common grandparent, causing duplicated state). C++ solves this using _virtual inheritance_, which is an advanced topic. In typical application design, single inheritance or composition is preferred.

---

## Constructor and Destructor Execution Order

When a derived object is instantiated, what gets constructed first? And what gets destructed first when it dies?

The rule in C++ is strict:

1. **Base-class constructors execute first** (top-down from the root of the hierarchy).
2. **Derived-class constructors execute last**.
3. **Destructors execute in exact reverse order (LIFO)**: Derived-class destructors execute first, followed by base-class destructors.

Let's verify this empirically:

```cpp
#include <iostream>

using namespace std;

class Base {
public:
    Base() {
        cout << "1. Base Constructor" << endl;
    }
    ~Base() {
        cout << "4. Base Destructor" << endl;
    }
};

class Derived : public Base {
public:
    Derived() {
        cout << "2. Derived Constructor" << endl;
    }
    ~Derived() {
        cout << "3. Derived Destructor" << endl;
    }
};

int main() {
    cout << "Entering scope..." << endl;
    {
        Derived obj;
    }
    cout << "Exited scope." << endl;
    return 0;
}
```

```text
Output:
Entering scope...
1. Base Constructor
2. Derived Constructor
3. Derived Destructor
4. Base Destructor
Exited scope.
```

### Why This Order Matters

A child object depends on the foundation provided by the parent. You cannot build the second story of a house before laying the foundation! Therefore, the base class must be fully constructed before the derived class constructor can touch its own members.

Conversely, during teardown, the derived class cleans up its own specialized resources first before the base class foundation is dismantled.

---

## Base-Class Initialization via Member Initializer Lists

If a base class does not have a default constructor, the derived class constructor **must explicitly call** a parameterized base constructor using its member initializer list:

```cpp
class Base {
public:
    Base(int x) { /* ... */ }
};

class Derived : public Base {
public:
    // Calling Base(x) in the member initializer list
    Derived(int x, int y) : Base(x) {
        // Derived body
    }
};
```

Failing to supply a base constructor call when no default base constructor exists results in a compile-time error.

---

## Common Beginner Mistakes

### 1. Inheriting for the Sole Purpose of Code Reuse

A common antipattern is subclassing an existing class simply to reuse three utility methods, even when the "is-a" relationship does not hold:

```cpp
// INCORRECT DESIGN: An Engine is NOT a Car!
class Engine {
public:
    void igniteSparkPlug() { /* ... */ }
};

class Car : public Engine { // ANTI-PATTERN!
};
```

This violates the principle of least astonishment. A caller holding a `Car` should not see engine internal operations directly as methods of `Car`. Instead, the `Car` should contain an `Engine` member variable (composition).

### 2. Making All Base Members `protected` Unnecessarily

Beginners often replace all `private` members with `protected` to avoid writing getters. However, this creates tight coupling: every derived class becomes dependent on the internal data representation of the base class. If the base class changes its variable types or names, every derived class breaks.

**Rule of thumb:** Keep base members `private`. Expose protected helper functions or getters only when necessary.

### 3. Forgetting That Derived Constructors Cannot Directly Initialize Base Private Fields

You cannot write:

```cpp
class Derived : public Base {
public:
    Derived(int val) {
        basePrivateField = val; // ERROR: basePrivateField is private to Base!
    }
};
```

You must pass the value up to the `Base` constructor via `: Base(val)`.

---

## Best Practices

1. **Verify the "is-a" test rigorously**: Ensure every derived class can safely be used anywhere its base class is expected (Liskov Substitution Principle).
2. **Favor `public` inheritance for subtyping**: Use `public` inheritance when establishing type hierarchies.
3. **Always initialize base classes in member initializer lists**: Explicitly document which base constructor is being invoked.
4. **Prefer composition when modeling "has-a"**: If class B merely utilizes class A, make class A a member of class B.

---

## Summary

- **Inheritance** allows a derived class to acquire properties and behaviors from a base class.
- Public inheritance models an **"is-a" relationship**.
- `protected` members are accessible to derived classes while remaining hidden from external callers.
- Under `public` inheritance: `public` members remain `public`, `protected` members remain `protected`, and `private` members are inaccessible directly.
- **Construction order** is top-down (Base first, then Derived).
- **Destruction order** is bottom-up (Derived first, then Base).
- Derived classes must invoke base constructors using member initializer lists.

---

## What's Next in the Series?

Now that we can construct hierarchies of base and derived classes, what happens when we want a single function to operate uniformly across any type in the hierarchy?

For instance, if we have an `Animal` base class and derived `Dog` and `Cat` classes, how can we call `sound()` on an `Animal*` pointer and have it execute the dog's bark or the cat's meow dynamically?

In the next guide, we explore **polymorphism**: static vs dynamic dispatch, virtual functions, and the `override` keyword.

---

## Continue Learning C++ OOP

- **Previous Article:** [C++ Encapsulation: Data Hiding, Getters and Setters](/posts/cpp-encapsulation/)
- **Next Article:** [C++ Polymorphism: Compile-Time vs Runtime Polymorphism](/posts/cpp-polymorphism/)
- **Topic Hub:** Explore the full curriculum on the [C++ Object-Oriented Programming Topic Hub](/topics/cpp-oop/)
- **Related Architecture:** [Composition vs Inheritance in C++: Object Design Trade-Offs](/posts/cpp-composition-vs-inheritance/)

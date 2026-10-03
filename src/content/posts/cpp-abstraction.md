---
title: "C++ Abstraction: Abstract Classes and Pure Virtual Functions"
author: "Shafin Chowdhury"
pubDatetime: 2026-10-02T13:00:00+06:00
featured: false
draft: false
tags:
  - cpp
  - oop
  - abstraction
  - abstract-classes
  - interfaces
description: "Master abstraction in C++. Learn how pure virtual functions and abstract classes decouple interfaces from implementations using a complete payment gateway system."
---

In our previous article on [polymorphism](/posts/cpp-polymorphism/), we learned how virtual functions allow a base pointer to dynamically execute derived behaviors. However, in many architectural designs, the base class itself should never be instantiated.

Consider an e-commerce checkout engine. The checkout system processes a `Payment`. But there is no such tangible thing as a "generic payment" in the physical world—money must be moved through a specific channel: a credit card gateway, cash on delivery, or a digital mobile wallet.

Allowing a developer to write `Payment p;` would be an architectural error because a generic payment has no mechanism to move funds.

C++ enforces these high-level architectural contracts through **abstraction**, **pure virtual functions**, and **abstract classes**.

---

## What You'll Learn

- What abstraction means in software engineering
- Why abstraction reduces cognitive load and decouples systems
- The fundamental separation between an **interface** and an **implementation**
- How to declare **pure virtual functions** (`= 0`)
- What defines an **abstract class** and why it cannot be instantiated
- How to create concrete derived classes that satisfy abstract contracts
- How to implement pure **interfaces** in C++
- The technical distinction between **abstraction** and **encapsulation**
- A realistic, extensible **Payment Gateway** architecture

---

## What Is Abstraction?

**Abstraction** is the process of exposing only the essential features and behaviors of an entity while concealing the underlying complexity, background machinery, and implementation mechanics.

Consider driving an automobile:

- The driver interacts with a straightforward abstraction: a steering wheel, an accelerator pedal, and a brake pedal.
- The driver does not need to know the engine's internal combustion timing, the automatic transmission gear ratios, or the electronic fuel injection telemetry to steer or brake.
- If the manufacturer swaps a gasoline engine for an electric motor, the abstraction (steering wheel and pedals) remains identical from the driver's perspective.

In C++, abstraction allows you to write high-level business logic that depends solely on **abstract interfaces**, completely decoupled from the specific low-level details of concrete classes.

```text
+-------------------------------------------------------------+
|                 The Abstraction Barrier                     |
+-------------------------------------------------------------+
| Client / Consumer Code interacts ONLY with the interface:   |
|   - processPayment(double amount)                           |
|   - getPaymentMethod()                                      |
+------------------------------+------------------------------+
                               |
                   [ Abstraction Barrier ]
                               |
+------------------------------+------------------------------+
| Hidden Implementation Details:                              |
|   - CreditCardPayment: HTTPS API calls, Stripe tokens, CVV  |
|   - CashPayment: Physical bill verification, change drawer  |
|   - MobilePayment: OAuth tokens, QR code cryptographic hash |
+-------------------------------------------------------------+
```

---

## Pure Virtual Functions

In [polymorphism](/posts/cpp-polymorphism/), we saw virtual functions that provided a default implementation:

```cpp
virtual void sound() { cout << "Generic sound" << endl; }
```

A **pure virtual function** provides **no implementation** in the base class. It specifies a mandatory signature that derived classes must implement. You declare a pure virtual function by assigning `= 0` at the end of the function declaration:

```cpp
virtual ReturnType functionName(Parameters) = 0;
```

The `= 0` syntax tells the C++ compiler:

> _"This class declares that this operation exists, but cannot provide a body for it. Any concrete class that derives from this must provide the implementation."_

---

## Abstract Classes vs Concrete Classes

- An **abstract class** is any class that contains **at least one pure virtual function**.
- A **concrete class** is a class that provides implementations for **all** inherited pure virtual functions.

### The Instantiation Rule

You **cannot create an instance of an abstract class**:

```cpp
class Payment {
public:
    virtual void processPayment(double amount) = 0; // Pure virtual
    virtual ~Payment() = default;
};

int main() {
    // Payment p; // COMPILE ERROR: cannot allocate an object of abstract type 'Payment'!
    return 0;
}
```

The compiler rejects the instantiation because `Payment` is incomplete. However, you **can declare pointers and references to an abstract class**:

```cpp
Payment* paymentPtr = nullptr; // Fully valid!
```

This pointer can point to any concrete derived class that satisfies the `Payment` contract.

---

## Realistic Architecture: Extensible Payment Processing

Let's build a modular payment system that demonstrates the power of abstraction:

```cpp
#include <iostream>
#include <string>
#include <vector>

using namespace std;

// ==========================================
// 1. ABSTRACT BASE CLASS (THE ABSTRACTION)
// ==========================================
class Payment {
public:
    // Pure virtual functions define the mandatory contract
    virtual bool processPayment(double amount) = 0;
    virtual string getPaymentMethod() const = 0;

    // Polymorphic base classes must have a virtual destructor
    virtual ~Payment() = default;
};

// ==========================================
// 2. CONCRETE IMPLEMENTATION: CREDIT CARD
// ==========================================
class CreditCardPayment : public Payment {
private:
    string cardNumber;
    string cardHolder;

public:
    CreditCardPayment(string number, string holder)
        : cardNumber(number), cardHolder(holder) {}

    bool processPayment(double amount) override {
        cout << "[Credit Card Gateway] Contacting banking API..." << endl;
        cout << "Card: ****-****-****-" << cardNumber.substr(cardNumber.length() - 4) << endl;
        cout << "Charged $" << amount << " to " << cardHolder << endl;
        return true;
    }

    string getPaymentMethod() const override {
        return "Credit Card";
    }
};

// ==========================================
// 3. CONCRETE IMPLEMENTATION: CASH
// ==========================================
class CashPayment : public Payment {
private:
    string cashierId;

public:
    CashPayment(string cashier) : cashierId(cashier) {}

    bool processPayment(double amount) override {
        cout << "[Cash Register] Cashier " << cashierId
             << " accepted physical cash tender of $" << amount << endl;
        cout << "Cash drawer opened. Receipt printed." << endl;
        return true;
    }

    string getPaymentMethod() const override {
        return "Cash";
    }
};

// ==========================================
// 4. CONCRETE IMPLEMENTATION: MOBILE WALLET
// ==========================================
class MobilePayment : public Payment {
private:
    string phoneNumber;
    string provider;

public:
    MobilePayment(string phone, string walletProvider)
        : phoneNumber(phone), provider(walletProvider) {}

    bool processPayment(double amount) override {
        cout << "[" << provider << " Service] Push notification sent to " << phoneNumber << endl;
        cout << "Cryptographic biometric token verified. Transferred $" << amount << endl;
        return true;
    }

    string getPaymentMethod() const override {
        return provider + " Mobile Wallet";
    }
};

// ==========================================
// 5. HIGH-LEVEL CLIENT CODE
// ==========================================
// This function operates purely on the abstraction.
// It has zero knowledge of credit card numbers, cashiers, or mobile tokens!
void checkout(Payment& paymentMethod, double totalAmount) {
    cout << "\nInitiating checkout for: " << paymentMethod.getPaymentMethod() << endl;
    cout << "Total Due: $" << totalAmount << endl;

    bool success = paymentMethod.processPayment(totalAmount);
    if (success) {
        cout << "Transaction Complete! Order confirmed." << endl;
    } else {
        cout << "Transaction Failed!" << endl;
    }
}

int main() {
    CreditCardPayment visa("4111222233334567", "Shafin Chowdhury");
    CashPayment inStoreRegister("CASHIER-42");
    MobilePayment applePay("+1-555-0199", "Apple Pay");

    // Checkout works seamlessly across all payment methods
    checkout(visa, 149.99);
    checkout(inStoreRegister, 24.50);
    checkout(applePay, 89.00);

    return 0;
}
```

```text
Output:
Initiating checkout for: Credit Card
Total Due: $149.99
[Credit Card Gateway] Contacting banking API...
Card: ****-****-****-4567
Charged $149.99 to Shafin Chowdhury
Transaction Complete! Order confirmed.

Initiating checkout for: Cash
Total Due: $24.5
[Cash Register] Cashier CASHIER-42 accepted physical cash tender of $24.5
Cash drawer opened. Receipt printed.
Transaction Complete! Order confirmed.

Initiating checkout for: Apple Pay Mobile Wallet
Total Due: $89
[Apple Pay Service] Push notification sent to +1-555-0199
Cryptographic biometric token verified. Transferred $89
Transaction Complete! Order confirmed.
```

### Why This Design Is Superior

Look at the `checkout()` function. It accepts a `Payment&`.

If your team decides tomorrow to add cryptocurrency payments (`CryptoPayment`), **you do not need to modify a single line of `checkout()` or main logic**. You simply author a new concrete class that overrides `processPayment()` and pass it in.

This directly embodies the **Open/Closed Principle**: software entities should be open for extension, but closed for modification.

---

## C++ Interfaces: Pure Abstract Classes

Unlike Java or C#, C++ does not possess an explicit `interface` keyword. Instead, an **interface** in C++ is modeled as a class with:

1. **Only pure virtual functions** (no concrete member functions).
2. **No member variables** (state).
3. A **virtual destructor** (`virtual ~InterfaceName() = default;`).

```cpp
// Pure Interface in C++
class Serializable {
public:
    virtual string serialize() const = 0;
    virtual void deserialize(const string& data) = 0;
    virtual ~Serializable() = default;
};
```

This represents a pure behavioral contract. A class can inherit from multiple pure interfaces without suffering from the diamond problem, because interfaces possess no data members to duplicate.

---

## Abstraction vs Encapsulation

Let's clearly delineate how these two core OOP concepts differ and cooperate:

```text
+-----------------------+-------------------------------------------------------+
| Aspect                | Encapsulation                                         |
+-----------------------+-------------------------------------------------------+
| Objective             | Protect state & maintain invariants.                  |
| Mechanism             | 'private' access specifier, getters, setters.        |
| Scope                 | Implementation-level (inside the class).              |
| Example               | Validating that account balance never drops below $0. |
+-----------------------+-------------------------------------------------------+
| Aspect                | Abstraction                                           |
+-----------------------+-------------------------------------------------------+
| Objective             | Hide implementation details & reduce complexity.      |
| Mechanism             | Pure virtual functions, abstract classes, interfaces. |
| Scope                 | Design-level (architectural boundaries).              |
| Example               | The checkout() function calling processPayment().     |
+-----------------------+-------------------------------------------------------+
```

- **Encapsulation** says: _"I will keep my internal variables private and ensure no one puts my object into an invalid state."_
- **Abstraction** says: _"I don't care how you implement this operation internally; as long as you fulfill this contract, I can use you."_

---

## Common Beginner Mistakes

### 1. Forgetting to Implement a Pure Virtual Function in a Derived Class

If a derived class fails to provide an implementation for even **one** inherited pure virtual function, that derived class **also becomes an abstract class**:

```cpp
class Animal {
public:
    virtual void sound() = 0;
    virtual void sleep() = 0;
};

class Dog : public Animal {
public:
    void sound() override { cout << "Bark" << endl; }
    // Forgot to implement sleep()!
};

int main() {
    // Dog d; // COMPILE ERROR: cannot declare variable 'd' to be of abstract type 'Dog'
    // because sleep() remains pure virtual!
    return 0;
}
```

### 2. Forgetting the Virtual Destructor in an Abstract Base Class

Deleting a concrete object through an abstract pointer without a virtual destructor results in **undefined behavior**:

```cpp
Payment* p = new CreditCardPayment("...", "...");
delete p; // Memory leak if ~Payment() is not virtual!
```

Always provide `virtual ~Payment() = default;` in your abstract base classes.

### 3. Creating Premature Abstractions

Do not create abstract classes with only one single implementation when there is no foreseeable need for multiple variants. Abstraction introduces a layer of indirection; apply it where genuine variation or architectural decoupling is required.

---

## Best Practices

1. **Depend on abstractions, not concretions**: High-level modules should depend on abstract base classes or interfaces, not concrete implementations (Dependency Inversion Principle).
2. **Always include a virtual destructor in abstract classes**: Ensure safe polymorphic teardown via base pointers.
3. **Use the `override` specifier**: Guarantee that concrete classes correctly fulfill base pure virtual function contracts.
4. **Keep interfaces focused and cohesive**: Prefer smaller, specific interfaces over monolithic interfaces with dozens of methods (Interface Segregation Principle).

---

## Summary

- **Abstraction** exposes essential capabilities while hiding implementation complexity behind clean interfaces.
- A **pure virtual function** (`virtual void f() = 0;`) establishes a mandatory contract with no base implementation.
- An **abstract class** contains at least one pure virtual function and cannot be instantiated.
- Concrete derived classes must implement all inherited pure virtual functions to allow instantiation.
- Pure abstract classes act as **interfaces** in C++.
- Encapsulation is about _data integrity and access control_; abstraction is about _interface design and complexity reduction_.

---

## What's Next in the Series?

Throughout our exploration of polymorphism and abstraction, we have encountered two closely related concepts that frequently confuse developers: **overloading** and **overriding**.

In the next guide, we place **function overloading** and **function overriding** head-to-head, comparing compile-time resolution, signatures, scope, and the `override` keyword in detail.

---

## Continue Learning C++ OOP

- **Previous Article:** [C++ Polymorphism: Compile-Time vs Runtime Polymorphism](/posts/cpp-polymorphism/)
- **Next Article:** [Function Overloading vs Function Overriding in C++](/posts/cpp-function-overloading-vs-overriding/)
- **Topic Hub:** Explore the full curriculum on the [C++ Object-Oriented Programming Topic Hub](/topics/cpp-oop/)
- **Related Design Principle:** [Composition vs Inheritance in C++: Object Design Trade-Offs](/posts/cpp-composition-vs-inheritance/)

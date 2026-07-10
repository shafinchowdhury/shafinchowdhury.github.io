---
title: "Part 3: Encapsulation — Protecting Your Data"
author: "Shafin Chowdhury"
pubDatetime: 2026-07-20T09:19:00Z
featured: true
draft: false
tags:
  - java
  - oop
  - encapsulation
  - java-beginner
  - clean-code
  - java-core
description: "This blog makes Java encapsulation super easy to understand. You will learn how to wrap your data and code together inside a single unit to keep it safe from outside mistakes. By using simple examples, you will quickly master how to use "getters" and "setters" to build better, cleaner programs.
---

In the previous chapter, we learned how to create classes and objects. [Click here](https://shafinchowdhury.dev/posts/class-object/) to revise the topic.
However, do you notice? There's a problem with the classes we've written so far.

Consider this `Student` class.

```java
class Student {

    String name;
    int age;
    double gpa;

}
```

Since all the variables are accessible from outside the class, anyone can modify them. Any object have direct access to the data feilds of the class, which is dengarous for real life projects.

```java
Student student = new Student();

student.name = "Ayasha";
student.gpa = -10;
student.age = -5;
```

Nothing stops another programmer from assigning invalid values. For small codes that don't matter, but imagine a banking system where someone could simply write

```java
account.balance = -100000;
```

or maybe, 

```java
account.balance = 999999999;
```

That would be a serious problem. This is exactly why Java provides **Encapsulation**.

---

## What Encapsulation Actually Is

Think about a medicine capsule. You cannot reach inside it and change with the contents. The makers of the capsule can control what goes in and what comes out. You can only interact with it the way it was designed to be used, you just swallow it whole.

A well-designed Java class works the same way.

Instead of letting external code read and write its variables freely, the class hides its data and **exposes only safe, controlled ways to interact with it**. That's the main concept of encapsulation. 

> **Encapsulation** Encapsulation is one of the fundamental principles of object-oriented programming (OOP). It provides a way to bundle the data (fields) and methods that operate on the data into a class unit. By restricting direct access to some of the object’s components, encapsulation protects the integrity of the data and ensures that the object controls its state. 

The three tools Java gives you to achieve this are:

- **Access modifiers** — control who can even see a variable or method
- **Getter methods** — let outside code _read_ a value safely
- **Setter methods** — let outside code _change_ a value, but only after validation

---

## Step 1: Access Modifiers

Before writing any code, you need to understand the four access levels, Java provides.

|Modifier|Who Can Access It|
|---|---|
|`private`|Only code inside this same class|
|`Default`|Code inside the same package|
|`protected`|Same package, plus subclasses|
|`public`|Anywhere in the entire program|

For encapsulation, the ones you will use constantly are `private` (for data you want to hide) and `public` (for methods you want to expose, like getters and setters).

Think of it this way: `private` is the lock on the door. `public` is the controlled entrance with a receptionist.

---

## Step 2: Why private is the Starting Point

The first and most important rule of encapsulation is:

> **All instance variables should be `private`.**

Let's apply this to a `BankAccount` class.

java

```java
class BankAccount {
    private String accountHolder;
    private String accountNumber;
    private double balance;
}
```

Now if someone tries to access these directly:

java

```java
BankAccount account = new BankAccount();
account.balance = 5000; // Compile-time error
```

Java refuses. `balance` is private. Code outside `BankAccount` cannot touch it.

However, a new problem has arisen: how does anything get read or changed? The answer is getter and setter methods. 
## Step 4: Getter Methods: Reading Private Data

A **getter** is a `public` method that reads and returns a private variable. The naming convention is always `get` followed by the variable name with the first letter capitalised, like getName(), getBalance(), getNid() and so on.

java

```java
class BankAccount {
    private double balance;

    public double getBalance() {
        return balance;
    }
}
```

Now outside code can _read_ the balance, but cannot _write_ to it directly.

java

```java
System.out.println(account.getBalance()); // Fine — reading through the getter
account.balance = 5000;                   // Error — still cannot access directly
```

One of the famous example of the getter is a **one-way window**. You can look through it, but you cannot reach through it.

Here is why this matters, even if the getter seems to just return the value with no logic:

- You can later add logic to the getter for example format a currency value, mask an account number without changing how outside code calls it.
- You can make some variables readable but others completely hidden, giving you proper role based control.

More examples:

java

```java
student.getName();
employee.getSalary();
account.getAccountNumber();
```

---

## Step 4: Setter Methods — Changing Private Data Safely

A **setter** is a `public` method that validates and then assigns a new value to a private variable.The naming convention is `set` followed by the variable name with the first letter capitalized.

java

```java
public void setBalance(double balance) {
    if (balance < 0) {
        System.out.println("Balance cannot be negative.");
        return;
    }
    this.balance = balance;
}
```

Notice `this.balance` — the keyword `this` refers to the current object's variable. Without it, Java would get confused between the method parameter `balance` and the class field `balance`. This is a very common pattern inside setters, you can learn more about `this` keyword in previous part. 


java

```java
account.balance = -99999; // Old, broken, direct access
```

You write:

java

```java
account.setBalance(-99999); // Rejected by the setter's validation
```

The class now has the final say over what values it accepts.

More examples of setters in practice:

java

```java
student.setAge(20);      // Can validate: age must be between 1 and 150
student.setGpa(3.8);     // Can validate: GPA must be between 0.0 and 4.0
employee.setSalary(5000); // Can validate: salary must be positive
```
---
## Step 5: Not Every Variable Needs a Setter

This is an important design decision beginners often miss. Just because you _can_ write a setter does not mean you _should_.

Some data should be read-only after the object is created. For example, an `accountNumber` should probably never change. In that case, you write a getter but no setter at all.

java

```java
public String getAccountNumber() {
    return accountNumber;
}

// No setAccountNumber() — intentional
```

The absence of a setter is itself a design decision. It says: "this value is set once, in the constructor, and never changed."

This is one of the powers of encapsulation — you get to decide the rules for your own data.

---

## Step 6: Domain Methods vs. Setters

Sometimes a raw setter is the wrong tool altogether.

For a bank account, directly setting a balance doesn't reflect how banking actually works. You don't just _set_ a balance — you _deposit_ or _withdraw_ money. These operations have their own rules.

A deposit:

- Must be a positive amount
- Adds to the current balance

A withdrawal:

- Must be a positive amount
- Cannot exceed the current balance

Here is how to model this properly:

java

```java
public void deposit(double amount) {
    if (amount <= 0) {
        System.out.println("Deposit amount must be positive.");
        return;
    }
    balance += amount;
    System.out.println("Deposited: " + amount);
}

public void withdraw(double amount) {
    if (amount <= 0) {
        System.out.println("Withdrawal amount must be positive.");
        return;
    }
    if (amount > balance) {
        System.out.println("Insufficient funds.");
        return;
    }
    balance -= amount;
    System.out.println("Withdrawn: " + amount);
}
```

These methods are not setters in the traditional sense. They are **domain methods** — methods that implement real business logic. The class decides _how_ the balance changes, not just _whether_ it can change.

This is important application of encapsulation: the class doesn't just validate input, it _owns the rules_ of how its data evolves

---
# Step 7: Constructor vs Getter/Setter

Which is better to use, initialization through a constructor + overriding the toString() method, or using getters and setters?

It is definitely better to use getters and setters to access fields protected by the private access modifier. This provides greater flexibility in the code and improves its readability. When you see the use of the getName() method in the code, you immediately understand that this method retrieves the field named name. The same applies when you see the use of the setName() method, you immediately understand that you are assigning a specific value to the field for the object of the class in which it is used. If other people read your code, they will be happy to see getters and setters.

It is also worth noting that each field requires its own getter and setter. If a class has two fields protected by the private access modifier, the class should have one getter for each field, meaning two getters and two setters. Let's take a look at an example where we add an age field to the Person class:

# Step 8: Complete Encapsulated BankAccount Class
Let's put everything together into a `BankAccount` class that demonstrates all the concepts: private fields, a constructor, getters, intentionally missing setters, and domain methods.

```java
class BankAccount {

    private String accountHolder;
    private String accountNumber;
    private double balance;

    public BankAccount(String accountHolder,
                       String accountNumber,
                       double initialBalance) {

        this.accountHolder = accountHolder;
        this.accountNumber = accountNumber;

        if (initialBalance < 0) {
            throw new IllegalArgumentException("Initial balance cannot be negative.");
        }

        this.balance = initialBalance;

    }

    public String getAccountHolder() {
        return accountHolder;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public double getBalance() {
        return balance;
    }

    public void deposit(double amount) {

        if (amount <= 0) {
            System.out.println("Deposit amount must be positive.");
            return;
        }

        balance += amount;

        System.out.println("Deposited: " + amount);
    }

    public void withdraw(double amount) {

        if (amount <= 0) {
            System.out.println("Withdrawal amount must be positive.");
            return;
        }

        if (amount > balance) {
            System.out.println("Insufficient funds.");
            return;
        }

        balance -= amount;

        System.out.println("Withdrawn: " + amount);
    }

    public void printStatement() {

        System.out.println("----- Account Statement -----");
        System.out.println("Holder : " + accountHolder);
        System.out.println("Account: " + accountNumber);
        System.out.println("Balance: " + balance);
        System.out.println("-----------------------------");

    }

}
```

---

## Step 9: Using the Class

java

```java
public class Main {
    public static void main(String[] args) {

        BankAccount account = new BankAccount("Ayasha", "NSU-2024-001", 5000);

        account.deposit(2000);
        account.withdraw(500);
        account.withdraw(10000); // Should be rejected

        System.out.println("Balance: " + account.getBalance());

        account.printStatement();

        // This line would cause a compile-time error:
        // account.balance = -99999; // ❌ balance is private

    }
}
```

Output:

```
Deposited: 2000.0
Withdrawn: 500.0
Insufficient funds.
Balance: 6500.0

----- Account Statement -----
Holder : Ayasha
Account: NSU-2024-001
Balance: 6500.0
-----------------------------
```

The balance is 6500 because:

- Started at 5000
- Deposited 2000 → 7000
- Withdrew 500 → 6500
- The withdrawal of 10000 was blocked

---

## Step 10: A Setter When It Makes Sense: Student Example

Not everything needs domain methods. Sometimes a plain setter is the right tool. Here's a `Student` class where setters make sense because the data is simpler.

java

```java
class Student {

    private String name;
    private int age;
    private double gpa;

    public Student(String name, int age, double gpa) {
        this.name = name;
        setAge(age);   // Reuse the setter's validation even in the constructor
        setGpa(gpa);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (name == null || name.isEmpty()) {
            System.out.println("Name cannot be empty.");
            return;
        }
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age < 1 || age > 150) {
            System.out.println("Invalid age: " + age);
            return;
        }
        this.age = age;
    }

    public double getGpa() {
        return gpa;
    }

    public void setGpa(double gpa) {
        if (gpa < 0.0 || gpa > 4.0) {
            System.out.println("GPA must be between 0.0 and 4.0.");
            return;
        }
        this.gpa = gpa;
    }

    public void printInfo() {
        System.out.println("Name: " + name + " | Age: " + age + " | GPA: " + gpa);
    }

}
```

Using it:

java

```java
Student student = new Student("Ayasha", 20, 3.8);
student.printInfo();

student.setGpa(-10); // Rejected
student.setAge(200); // Rejected
student.setName("Rafiq");

student.printInfo();
```

Output:

```
Name: Ayasha | Age: 20 | GPA: 3.8
GPA must be between 0.0 and 4.0.
Invalid age: 200
Name: Rafiq | Age: 20 | GPA: 3.8
```

Notice that invalid values were silently ignored — the object kept its last valid state.

> A useful pattern: **reuse your setters inside the constructor**. Instead of duplicating validation logic in two places, call `setAge(age)` from the constructor. This way, if you later update the validation in the setter, the constructor automatically uses the new rules too.

---

## Step 11: Why Encapsulation Matters

At this point you might be thinking: this is a lot of extra code just to protect some variables. Is it really worth it?

Yes. Here's why.

### Data Integrity

Every value is validated before it's stored. Invalid states become impossible, not just unlikely. A `BankAccount` can never have a negative balance. A `Student` can never have a GPA above 4.0. The rules are enforced automatically, every single time.

### Security

Sensitive fields like passwords, account numbers, or API keys cannot be read or written by outside code. You decide exactly what is visible and what is hidden.

### Flexibility — The Hidden Superpower

This is the benefit most beginners underestimate.

Imagine you later decide to store the balance in cents instead of dollars (a common approach to avoid floating-point precision errors). With encapsulation, you change the internal implementation of `BankAccount` and update `getBalance()` to convert back to dollars before returning. Every single class that calls `account.getBalance()` continues to work without any changes.

Without encapsulation, every place in your codebase that reads `account.balance` directly would need to be updated. In a large project, that could be hundreds of files.

### Maintainability

All the rules for a piece of data live in one place — inside the class that owns it. If a bug is found in how withdrawals work, you fix it in one method. You don't have to hunt through the entire codebase for every place that modifies the balance

---
# Encapsulation Workflow

When designing an encapsulated class, follow these steps
1. Create the class.
    
2. Make all instance variables `private`.
    
3. Create a constructor to initialize the object.
    
4. Add getter methods for values that should be readable.
    
5. Add setter methods or other public methods to safely modify the data.
    
6. Validate every input before changing the object's state.
    

---

# Summary

|Task|Syntax|
|---|---|
|Make data private|`private double balance;`|
|Read data|`account.getBalance();`|
|Modify data safely|`account.deposit(500);`|
|Restrict direct access|Use `private`|
|Allow controlled access|Use `public` methods|

Encapsulation is not just about hiding variables. It's about **protecting an object's data and ensuring that every change follows the rules defined by the class**. By controlling how data is accessed and modified, classes become safer, easier to maintain, and much less prone to bugs. In the next part we will learn about Inheritance. Click here to learn about it. Thank you 
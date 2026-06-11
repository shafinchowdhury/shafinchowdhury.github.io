---
title: "Binary number conversions"
author: "Shafin Chowdhury"
pubDatetime: 2026-06-10T10:11:00+06:00
featured: true
draft: false
tags:
  - memory
  - memory-allocation
  - c
  - memory-handaling
  - memory-with-no-limitation
description: "Proper view of memory allocation dynamicly."
---

# Conversion between Binary and Other Number Systems

Binary numbers use digits `0` and `1` and have a base of 2. Converting a binary number to another number system involves changing its base. This guide outlines all conversions related to the binary system in a sequential, structured format.

---

## 1. Binary to Decimal Conversion (B → D)

A binary number is converted into a decimal number by multiplying each binary digit (`0` or `1`) by its corresponding power of 2 according to its positional place value, starting from 0 on the right.

**Steps:**

1. Write the given binary number and assign powers of 2 from right to left (starting from 0).
2. Multiply each binary digit by its corresponding power of 2.
3. Add all the products together to get the final decimal number.
![image](https://cdn.shafinchowdhury.dev/blogs/number-system/decimal_to_binary_conversio.png)

**Solved Examples:**

**Q.1: Convert the binary number 1001 to a decimal number.**

$$1001_2 = (1 \times 2^3) + (0 \times 2^2) + (0 \times 2^1) + (1 \times 2^0) = 8 + 0 + 0 + 1 = 9_{10}$$

**Q.2: Convert $1101001_2$ into an equivalent decimal number.**

$$1101001_2 = (1 \times 2^6) + (1 \times 2^5) + (0 \times 2^4) + (1 \times 2^3) + (0 \times 2^2) + (0 \times 2^1) + (1 \times 2^0)$$

$$= 64 + 32 + 0 + 8 + 0 + 0 + 1 = (105)_{10}$$

**Q.3: Convert $(11110111)_2$ into the base-10 number system.**

$$(11110111)_2 = (1 \times 2^7) + (1 \times 2^6) + (1 \times 2^5) + (1 \times 2^4) + (0 \times 2^3) + (1 \times 2^2) + (1 \times 2^1) + (1 \times 2^0)$$

$$= 128 + 64 + 32 + 16 + 0 + 4 + 2 + 1 = (247)_{10}$$

---

## 2. Decimal to Binary Conversion (D → B)

To convert a decimal number to binary, the number is repeatedly divided by 2, and the remainders are tracked until the quotient becomes 0.

**Steps:**

1. Divide the decimal number by 2 and note down the remainder.
2. Divide the resulting quotient by 2 again and note the remainder.
3. Repeat the process until the quotient becomes 0.
4. Read the remainders from bottom to top (from MSB to LSB) to get the binary equivalent.

**Solved Examples:**

**Q.1: Convert $(25)_{10}$ to a binary number.**

| Division | Quotient | Remainder |
|----------|----------|-----------|
| 25 ÷ 2   | 12       | 1 (LSB)   |
| 12 ÷ 2   | 6        | 0         |
| 6 ÷ 2    | 3        | 0         |
| 3 ÷ 2    | 1        | 1         |
| 1 ÷ 2    | 0        | 1 (MSB)   |

Reading remainders from bottom to top: $(25)_{10} = (11001)_2$

**Q.2: Convert $(43)_{10}$ to a binary number.**

| Division | Quotient | Remainder |
|----------|----------|-----------|
| 43 ÷ 2   | 21       | 1 (LSB)   |
| 21 ÷ 2   | 10       | 1         |
| 10 ÷ 2   | 5        | 0         |
| 5 ÷ 2    | 2        | 1         |
| 2 ÷ 2    | 1        | 0         |
| 1 ÷ 2    | 0        | 1 (MSB)   |

Reading remainders from bottom to top: $(43)_{10} = (101011)_2$

---

## 3. Binary to Octal Conversion (B → O)

Binary numbers have a base of 2, while octal numbers have a base of 8 ($2^3 = 8$). Thus, we group bits into sets of three.

**Steps:**

1. Divide the binary number into groups of three digits starting from right to left (LSB to MSB).
2. If the leftmost group has fewer than three digits, pad it with leading zeros.
3. Convert each 3-digit group into its equivalent octal digit.
![image](https://cdn.shafinchowdhury.dev/blogs/number-system/1_vgtJh1NVWEqa3b9OsuRXSQ.jpg)

**Solved Examples:**

**Q.1: Convert $(11101011)_2$ into an octal number.**

| Binary Group | Octal Digit |
|:------------:|:-----------:|
| `011`        | 3           |
| `101`        | 5           |
| `011`        | 3           |

> Leading zero added to leftmost group.

Result: $(11101011)_2 = (353)_8$

**Q.2: Convert $(101101)_2$ into an octal number.**

| Binary Group | Octal Digit |
|:------------:|:-----------:|
| `101`        | 5           |
| `101`        | 5           |

Result: $(101101)_2 = (55)_8$

---

## 4. Octal to Binary Conversion (O → B)

To convert an octal number to binary, each individual octal digit is expanded into its 3-digit binary equivalent.

**Steps:**

1. Write down each digit of the octal number separately.
2. Convert each individual octal digit into its 3-bit binary equivalent.
3. Combine all the binary groups together.

**Solved Examples:**

**Q.1: Convert $(742)_8$ into a binary number.**

| Octal Digit | Binary Group |
|:-----------:|:------------:|
| 7           | `111`        |
| 4           | `100`        |
| 2           | `010`        |

Result: $(742)_8 = (111100010)_2$

---

## 5. Binary to Hexadecimal Conversion (B → H)

Binary numbers have a base of 2, while hexadecimal numbers have a base of 16 ($2^4 = 16$). Thus, we group bits into sets of four.

**Steps:**

1. Divide the binary number into groups of four digits starting from right to left (LSB to MSB).
2. Pad with leading zeros on the left if the last group has fewer than four digits.
3. Convert each 4-bit group into its equivalent hexadecimal digit (0–9, A–F).

**Solved Examples:**

**Q.1: Convert $(1110101101101)_2$ into a hexadecimal number.**

| Binary Group | Hex Digit |
|:------------:|:---------:|
| `0001`       | 1         |
| `1101`       | D         |
| `0110`       | 6         |
| `1101`       | D         |

> Three leading zeros added to leftmost group.

Result: $(1110101101101)_2 = (1D6D)_{16}$

---

## 6. Hexadecimal to Binary Conversion (H → B)

To convert a hexadecimal number to binary, each hex digit is expanded into its 4-digit binary equivalent.

**Steps:**

1. Write down each digit of the hexadecimal number.
2. Convert each hex character into its 4-bit binary equivalent.
3. Concatenate the groups to form the final binary string.

**Solved Examples:**

**Q.1: Convert $(3A9)_{16}$ into a binary number.**

| Hex Digit | Binary Group |
|:---------:|:------------:|
| 3         | `0011`       |
| A         | `1010`       |
| 9         | `1001`       |

> Drop leading zeros from the final combined result.

Result: $(3A9)_{16} = (1110111001)_2$

---

## Number Systems Conversion Map

```
               ┌──────────────────┐
               │     DECIMAL      │
               │    (Base 10)     │
               └────▲────────▲────┘
         Divide by 2│        │Sum weights (×2ⁿ)
                    │        │
               ┌────▼────────┴────┐
   ┌──────────►│      BINARY      │◄──────────┐
   │ 3-bit     │     (Base 2)     │   4-bit   │
   │ grouping  └────▲────────▲────┘  grouping │
   │                │        │                │
┌──▼───────────────┐│        │┌───────────────▼──┐
│      OCTAL       │┘        └│   HEXADECIMAL    │
│     (Base 8)     │          │    (Base 16)     │
└──────────────────┘          └──────────────────┘
```

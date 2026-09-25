---
title: "Mathematics Formula Cheat Sheet"
author: "Shafin Chowdhury"
pubDatetime: 2026-09-24T18:00:00+06:00
featured: true
draft: false
tags:
  - mathematics
  - cheat-sheet
  - reference
  - calculus
  - algebra
  - geometry
description: "A compact yet comprehensive mathematical formula cheat sheet covering arithmetic, algebra, calculus, coordinate geometry, trigonometry, matrices, probability, statistics, and discrete mathematics."
socials:
  - name: "github"
    url: "https://github.com/shafinchowdhury"
    linkTitle: "Shafin on GitHub"
  - name: "linkedin"
    url: "https://www.linkedin.com/in/md-shafin-chowdhury/"
    linkTitle: "Shafin on LinkedIn"
  - name: "mail"
    url: "mailto:shafinchowdhury2003@gmail.com"
    linkTitle: "Send an email to Shafin"
  - name: "facebook"
    url: "https://www.facebook.com/shafinchowdhury160ms"
    linkTitle: "Shafin on Facebook"
  - name: "instagram"
    url: "https://www.instagram.com/shafin_chowdhury1920/"
    linkTitle: "Shafin on Instagram"
---

> **A compact but broad reference of the most-used mathematical formulas.**
>
> This sheet is designed for quick lookup rather than derivations. It covers school mathematics, higher-secondary mathematics, undergraduate calculus, coordinate geometry, vectors, matrices, complex numbers, sequences and series, probability, statistics, number theory, discrete mathematics, numerical methods, and common applied formulas.
>
> **Important:** No finite document can literally contain _every formula in mathematics_—mathematics is an open-ended discipline with infinitely many identities and specialized results. This version aims to cover the standard formulas most useful for students, competitive programming, engineering, computer science, and general mathematical work.

---

## Arithmetic & Foundations

### 1. Basic Arithmetic

#### Order of Operations & Arithmetic Properties

| No. | Property / Rule                 |           Formula           | Conditions / Notes                                                                                                                  |
| :-: | :------------------------------ | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------- |
|  1  | Order of Operations             |  $\text{PEMDAS / BODMAS}$   | Parentheses/Brackets $\to$ Exponents/Orders $\to$ Multiplication/Division $\to$ Addition/Subtraction (left-to-right for equal rank) |
|  2  | Commutative (Addition)          |       $a + b = b + a$       | Order of terms does not affect sum                                                                                                  |
|  3  | Commutative (Multiplication)    |          $ab = ba$          | Order of factors does not affect product                                                                                            |
|  4  | Associative (Addition)          | $(a + b) + c = a + (b + c)$ | Grouping does not affect sum                                                                                                        |
|  5  | Associative (Multiplication)    |       $(ab)c = a(bc)$       | Grouping does not affect product                                                                                                    |
|  6  | Distributive (Over Addition)    |    $a(b + c) = ab + ac$     | Factor distributes across sum                                                                                                       |
|  7  | Distributive (Over Subtraction) |    $a(b - c) = ab - ac$     | Factor distributes across difference                                                                                                |
|  8  | Additive Identity               |         $a + 0 = a$         | $0$ is the additive identity                                                                                                        |
|  9  | Multiplicative Identity         |       $a \cdot 1 = a$       | $1$ is the multiplicative identity                                                                                                  |
| 10  | Additive Inverse                |       $a + (-a) = 0$        | Opposite value yields zero                                                                                                          |
| 11  | Multiplicative Inverse          |  $a \cdot \frac{1}{a} = 1$  | Reciprocal yields unity ($a \ne 0$)                                                                                                 |

#### Absolute Value

| No. | Property                    |                                Formula                                 | Conditions / Notes                                |
| :-: | :-------------------------- | :--------------------------------------------------------------------: | :------------------------------------------------ |
| 12  | Piecewise Definition        | $\vert x\vert = \begin{cases} x, & x \ge 0 \\ -x, & x < 0 \end{cases}$ | Geometric distance from $0$ on number line        |
| 13  | Absolute Product            |              $\vert ab\vert = \vert a\vert \vert b\vert$               | Magnitude of product equals product of magnitudes |
| 14  | Absolute Quotient           | $\left\vert\frac{a}{b}\right\vert = \frac{\vert a\vert}{\vert b\vert}$ | Magnitude of quotient ($b \ne 0$)                 |
| 15  | Triangle Inequality         |           $\vert a + b\vert \le \vert a\vert + \vert b\vert$           | Upper bound on magnitude of sum                   |
| 16  | Reverse Triangle Inequality |  $\big\vert\vert a\vert - \vert b\vert\big\vert \le \vert a - b\vert$  | Lower bound on magnitude of difference            |

---

### 2. Fractions, Ratios, Proportions and Percentages

#### Fraction Operations

| No. | Operation               |                                    Formula                                     | Conditions / Notes |
| :-: | :---------------------- | :----------------------------------------------------------------------------: | :----------------- |
| 17  | Fraction Addition       |                $\frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd}$                | $b, d \ne 0$       |
| 18  | Fraction Subtraction    |                $\frac{a}{b} - \frac{c}{d} = \frac{ad - bc}{bd}$                | $b, d \ne 0$       |
| 19  | Fraction Multiplication |                $\frac{a}{b} \cdot \frac{c}{d} = \frac{ac}{bd}$                 | $b, d \ne 0$       |
| 20  | Fraction Division       | $\frac{a}{b} \div \frac{c}{d} = \frac{a}{b} \cdot \frac{d}{c} = \frac{ad}{bc}$ | $b, c, d \ne 0$    |

#### Ratios & Proportions

| No. | Concept                  |                 Formula                 | Conditions / Notes                                |
| :-: | :----------------------- | :-------------------------------------: | :------------------------------------------------ |
| 21  | Ratio Notation           |          $a : b = \frac{a}{b}$          | Comparison of two relative quantities ($b \ne 0$) |
| 22  | Proportion Cross-Product |      $a : b = c : d \iff ad = bc$       | Equality of two ratios ($b, d \ne 0$)             |
| 23  | Direct Proportion        |      $y \propto x \implies y = kx$      | $k$ is constant of proportionality                |
| 24  | Inverse Proportion       | $y \propto \frac{1}{x} \implies xy = k$ | $k$ is constant of variation                      |

#### Percentages

| No. | Metric                 |                                                  Formula                                                   | Conditions / Notes                                 |
| :-: | :--------------------- | :--------------------------------------------------------------------------------------------------------: | :------------------------------------------------- |
| 25  | Percentage Calculation |                    $\text{Percentage} = \frac{\text{Part}}{\text{Whole}} \times 100\%$                     | Ratio expressed per hundred                        |
| 26  | Part from Percentage   |                     $\text{Part} = \frac{\text{Percentage}}{100} \times \text{Whole}$                      | Amount corresponding to percentage rate            |
| 27  | Percentage Change      |                $\%\text{ Change} = \frac{\text{New} - \text{Old}}{\text{Old}} \times 100\%$                | Relative change over baseline                      |
| 28  | Successive Changes     |                        $\text{Net Change} = \left(a + b + \frac{ab}{100}\right)\%$                         | For consecutive percentage changes $a\%$ and $b\%$ |
| 29  | Percentage Error       | $\%\text{ Error} = \frac{\vert\text{Experimental} - \text{True}\vert}{\vert\text{True}\vert} \times 100\%$ | Accuracy relative to standard/true value           |

---

### 3. Powers, Exponents and Radicals

#### Laws of Exponents

| No. | Law                       |                    Formula                     | Conditions / Notes                             |
| :-: | :------------------------ | :--------------------------------------------: | :--------------------------------------------- |
| 30  | Product of Powers         |              $a^m a^n = a^{m+n}$               | Add exponents when multiplying same base       |
| 31  | Quotient of Powers        |          $\frac{a^m}{a^n} = a^{m-n}$           | Subtract exponents ($a \ne 0$)                 |
| 32  | Power of a Power          |               $(a^m)^n = a^{mn}$               | Multiply inner and outer exponents             |
| 33  | Power of a Product        |               $(ab)^n = a^n b^n$               | Distribute exponent across factors             |
| 34  | Power of a Quotient       | $\left(\frac{a}{b}\right)^n = \frac{a^n}{b^n}$ | Distribute exponent across terms ($b \ne 0$)   |
| 35  | Zero Exponent             |                   $a^0 = 1$                    | Nonzero base to the zero power ($a \ne 0$)     |
| 36  | Negative Exponent         |            $a^{-n} = \frac{1}{a^n}$            | Reciprocal with positive power ($a \ne 0$)     |
| 37  | Unit Fractional Exponent  |            $a^{1/n} = \sqrt[n]{a}$             | Principal $n$-th root ($a \ge 0$ for even $n$) |
| 38  | General Rational Exponent |  $a^{m/n} = \sqrt[n]{a^m} = (\sqrt[n]{a})^m$   | $m, n \in \mathbb{Z}, n > 0$                   |

#### Radical Rules & Rationalization

| No. | Property                 |                         Formula                         | Conditions / Notes                       |
| :-: | :----------------------- | :-----------------------------------------------------: | :--------------------------------------- |
| 39  | Radical Product          |             $\sqrt{ab} = \sqrt{a}\sqrt{b}$              | $a, b \ge 0$                             |
| 40  | Radical Quotient         |    $\sqrt{\frac{a}{b}} = \frac{\sqrt{a}}{\sqrt{b}}$     | $a \ge 0, b > 0$                         |
| 41  | Root of a Power          |                $\sqrt[n]{a^m} = a^{m/n}$                | Radical to fractional power equivalence  |
| 42  | Nested Radicals          |         $\sqrt[n]{\sqrt[m]{a}} = \sqrt[mn]{a}$          | Product of root indices                  |
| 43  | Radical Power Inverse    |                  $(\sqrt[n]{a})^n = a$                  | $a \ge 0$ if $n$ is even                 |
| 44  | Monomial Rationalization |        $\frac{1}{\sqrt{a}} = \frac{\sqrt{a}}{a}$        | Multiply top & bottom by $\sqrt{a}$      |
| 45  | Binomial Rationalization | $\frac{1}{a + \sqrt{b}} = \frac{a - \sqrt{b}}{a^2 - b}$ | Multiply by conjugate $(a - \sqrt{b})$   |
| 46  | Conjugate Product        |        $(a + \sqrt{b})(a - \sqrt{b}) = a^2 - b$         | Difference of squares eliminates radical |

---

## Algebra

### 4. Algebraic Identities

#### Squares & Quadratics

| No. | Identity                  |            Formula            | Conditions / Notes                     |
| :-: | :------------------------ | :---------------------------: | :------------------------------------- |
| 47  | Square of Sum             | $(a + b)^2 = a^2 + 2ab + b^2$ | Trinomial expansion                    |
| 48  | Square of Difference      | $(a - b)^2 = a^2 - 2ab + b^2$ | Middle term negative                   |
| 49  | Difference of Squares     | $a^2 - b^2 = (a + b)(a - b)$  | Factoring conjugate binomials          |
| 50  | Sum of Squares (via Sum)  | $a^2 + b^2 = (a + b)^2 - 2ab$ | Expressed using sum and product        |
| 51  | Sum of Squares (via Diff) | $a^2 + b^2 = (a - b)^2 + 2ab$ | Expressed using difference and product |

#### Cubes & Higher Powers

| No. | Identity                    |                      Formula                      | Conditions / Notes                       |
| :-: | :-------------------------- | :-----------------------------------------------: | :--------------------------------------- |
| 52  | Cube of Sum                 |      $(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$      | $= a^3 + b^3 + 3ab(a + b)$               |
| 53  | Cube of Difference          |      $(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$      | $= a^3 - b^3 - 3ab(a - b)$               |
| 54  | Sum of Cubes                |       $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$       | Linear factor with alternating quadratic |
| 55  | Difference of Cubes         |       $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$       | Linear factor with positive quadratic    |
| 56  | Difference of Fourth Powers |      $a^4 - b^4 = (a - b)(a + b)(a^2 + b^2)$      | Iterated difference of squares           |
| 57  | Fourth Power of Sum         | $(a + b)^4 = a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4$ | Binomial coefficients: 1, 4, 6, 4, 1     |
| 58  | Fourth Power of Difference  | $(a - b)^4 = a^4 - 4a^3b + 6a^2b^2 - 4ab^3 + b^4$ | Alternating sign expansion               |

#### Multi-Variable & General Powers

| No. | Identity                            |                                Formula                                 | Conditions / Notes                     |
| :-: | :---------------------------------- | :--------------------------------------------------------------------: | :------------------------------------- |
| 59  | Square of Trinomial                 |          $(a + b + c)^2 = a^2 + b^2 + c^2 + 2(ab + bc + ca)$           | Sum of squares + all pairwise products |
| 60  | Alternating Trinomial Square        |          $(a - b - c)^2 = a^2 + b^2 + c^2 - 2ab - 2ac + 2bc$           | Sign distribution rule                 |
| 61  | Sum of Three Cubes                  | $a^3 + b^3 + c^3 - 3abc = (a + b + c)(a^2 + b^2 + c^2 - ab - bc - ca)$ | Euler's factorization identity         |
| 62  | Zero-Sum Cubic Special Case         |            $a + b + c = 0 \implies a^3 + b^3 + c^3 = 3abc$             | Direct consequence of Euler's identity |
| 63  | General Difference of $n$-th Powers |      $a^n - b^n = (a - b)(a^{n-1} + a^{n-2}b + \cdots + b^{n-1})$      | Valid for all positive integers $n$    |
| 64  | General Sum of $n$-th Powers        |      $a^n + b^n = (a + b)(a^{n-1} - a^{n-2}b + \cdots + b^{n-1})$      | Valid for odd integers $n$             |

---

### 5. Polynomials

#### Theorems & Quadratics

| No. | Concept / Form                       |                         Formula                          | Conditions / Notes                              |
| :-: | :----------------------------------- | :------------------------------------------------------: | :---------------------------------------------- |
| 65  | Polynomial Form                      | $P(x) = a_n x^n + a_{n-1}x^{n-1} + \cdots + a_1 x + a_0$ | Degree $n$ with leading coefficient $a_n \ne 0$ |
| 66  | Remainder Theorem                    |                $\text{Remainder} = P(a)$                 | Remainder when $P(x)$ is divided by $(x - a)$   |
| 67  | Factor Theorem                       |   $P(a) = 0 \iff (x - a) \text{ is a factor of } P(x)$   | Root-factor equivalence                         |
| 68  | Quadratic Formula                    |         $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$         | Roots of $ax^2 + bx + c = 0$ ($a \ne 0$)        |
| 69  | Quadratic Discriminant               |                   $\Delta = b^2 - 4ac$                   | Determines nature and multiplicity of roots     |
| 70  | Vieta's Sum of Roots (Quadratic)     |             $\alpha + \beta = -\frac{b}{a}$              | Sum of roots of $ax^2 + bx + c = 0$             |
| 71  | Vieta's Product of Roots (Quadratic) |               $\alpha\beta = \frac{c}{a}$                | Product of roots of $ax^2 + bx + c = 0$         |
| 72  | Factored Quadratic Form              |        $ax^2 + bx + c = a(x - \alpha)(x - \beta)$        | Factorization via roots $\alpha, \beta$         |

#### Cubic Root Relations (Vieta's Formulas)

| No. | Relation                 |                         Formula                          | Conditions / Notes             |
| :-: | :----------------------- | :------------------------------------------------------: | :----------------------------- |
| 73  | Sum of Roots             |         $\alpha + \beta + \gamma = -\frac{b}{a}$         | For $ax^3 + bx^2 + cx + d = 0$ |
| 74  | Sum of Pairwise Products | $\alpha\beta + \beta\gamma + \gamma\alpha = \frac{c}{a}$ | Pairwise root products         |
| 75  | Product of Roots         |            $\alpha\beta\gamma = -\frac{d}{a}$            | Product of all three roots     |

---

### 6. Equations and Inequalities

#### Linear & Systems of Equations

| No. | Form / Concept         |                Formula                 | Conditions / Notes                            |
| :-: | :--------------------- | :------------------------------------: | :-------------------------------------------- |
| 76  | Linear Equation        | $ax + b = 0 \implies x = -\frac{b}{a}$ | $a \ne 0$                                     |
| 77  | System Determinant $D$ |        $D = a_1 b_2 - a_2 b_1$         | Determinant of $2\times 2$ coefficient matrix |
| 78  | Cramer's Rule for $x$  |   $x = \frac{c_1 b_2 - c_2 b_1}{D}$    | Unique solution when $D \ne 0$                |
| 79  | Cramer's Rule for $y$  |   $y = \frac{a_1 c_2 - a_2 c_1}{D}$    | Unique solution when $D \ne 0$                |

#### Quadratic Nature & Parabola Vertex

| No. | Feature                        |                          Formula                           | Conditions / Notes                           |
| :-: | :----------------------------- | :--------------------------------------------------------: | :------------------------------------------- |
| 80  | Two Distinct Real Roots        |                  $\Delta = b^2 - 4ac > 0$                  | Graph intersects $x$-axis twice              |
| 81  | One Repeated Real Root         |                  $\Delta = b^2 - 4ac = 0$                  | Graph tangent to $x$-axis at double root     |
| 82  | Complex Conjugate Roots        |                  $\Delta = b^2 - 4ac < 0$                  | No real roots; graph does not touch $x$-axis |
| 83  | Parabola Vertex $x$-Coordinate |                   $x_v = -\frac{b}{2a}$                    | Axis of symmetry: $x = -\frac{b}{2a}$        |
| 84  | Parabola Vertex $y$-Coordinate | $y_v = f\left(-\frac{b}{2a}\right) = \frac{4ac - b^2}{4a}$ | Extremum value of quadratic function         |
| 85  | Parabola Vertex Form           |                    $y = a(x - h)^2 + k$                    | Vertex located at $(h, k)$                   |

#### Absolute-Value Equations & Inequalities

| No. | Expression                  |            Solution / Equivalent Form            | Conditions / Notes               |
| :-: | :-------------------------- | :----------------------------------------------: | :------------------------------- |
| 86  | Absolute Value Equality     |      $\vert x\vert = a \implies x = \pm a$       | Valid for $a \ge 0$              |
| 87  | Absolute Value Less-Than    |        $\vert x\vert < a \iff -a < x < a$        | Bounded interval ($a > 0$)       |
| 88  | Absolute Value Greater-Than | $\vert x\vert > a \iff x < -a \text{ or } x > a$ | Disjoint exterior rays ($a > 0$) |

---

### 7. Logarithms

#### Definitions & Core Properties

| No. | Property / Rule      |           Formula           | Conditions / Notes                 |
| :-: | :------------------- | :-------------------------: | :--------------------------------- |
| 89  | Logarithm Definition | $\log_a b = c \iff a^c = b$ | $a > 0, a \ne 1, b > 0$            |
| 90  | Logarithm of 1       |       $\log_a 1 = 0$        | $a^0 = 1$                          |
| 91  | Logarithm of Base    |       $\log_a a = 1$        | $a^1 = a$                          |
| 92  | Log of Base Power    |      $\log_a(a^x) = x$      | Inverse cancellation law           |
| 93  | Base to Log Power    |     $a^{\log_a x} = x$      | Inverse cancellation law ($x > 0$) |

#### Operational Laws & Base Conversion

| No. | Law                      |                        Formula                         | Conditions / Notes                              |
| :-: | :----------------------- | :----------------------------------------------------: | :---------------------------------------------- |
| 94  | Product Rule             |           $\log_a(xy) = \log_a x + \log_a y$           | $x, y > 0$                                      |
| 95  | Quotient Rule            | $\log_a\left(\frac{x}{y}\right) = \log_a x - \log_a y$ | $x, y > 0$                                      |
| 96  | Power Rule               |               $\log_a(x^r) = r\log_a x$                | $x > 0$                                         |
| 97  | Change of Base Formula   |         $\log_a x = \frac{\log_b x}{\log_b a}$         | Convert to any convenient base $b > 0, b \ne 1$ |
| 98  | Change to Natural Log    |            $\log_a x = \frac{\ln x}{\ln a}$            | Base $e$ conversion                             |
| 99  | Change to Common Log     |           $\log_a x = \frac{\log x}{\log a}$           | Base $10$ conversion                            |
| 100 | Reciprocal Identity      |            $\log_a b = \frac{1}{\log_b a}$             | Inverts base and argument ($b \ne 1$)           |
| 101 | Natural Log Definition   |                   $\ln x = \log_e x$                   | Base $e \approx 2.71828$                        |
| 102 | Exponential-Log Identity |       $e^{\ln x} = x \text{ and } \ln(e^x) = x$        | $x > 0$ for $e^{\ln x}$                         |

---

### 8. Sequences and Series

#### Arithmetic Progression (AP)

| No. | Form / Concept                    |              Formula               | Conditions / Notes                    |
| :-: | :-------------------------------- | :--------------------------------: | :------------------------------------ |
| 103 | $n$-th Term of AP                 |        $a_n = a + (n - 1)d$        | First term $a$, common difference $d$ |
| 104 | Sum of First $n$ Terms (with $d$) | $S_n = \frac{n}{2}[2a + (n - 1)d]$ | Total sum of $n$ terms                |
| 105 | Sum of First $n$ Terms (with $l$) |     $S_n = \frac{n}{2}(a + l)$     | $l = a_n$ is the last term            |
| 106 | Arithmetic Mean                   |   $\text{AM} = \frac{a + b}{2}$    | Midpoint between $a$ and $b$          |

#### Geometric Progression (GP)

| No. | Form / Concept            |                         Formula                         | Conditions / Notes               |
| :-: | :------------------------ | :-----------------------------------------------------: | :------------------------------- |
| 107 | $n$-th Term of GP         |                    $a_n = a r^{n-1}$                    | First term $a$, common ratio $r$ |
| 108 | Finite GP Sum ($r \ne 1$) | $S_n = a\frac{1 - r^n}{1 - r} = a\frac{r^n - 1}{r - 1}$ | $r \ne 1$                        |
| 109 | Finite GP Sum ($r = 1$)   |                       $S_n = na$                        | Identical repeated terms         |
| 110 | Infinite Geometric Series |              $S_\infty = \frac{a}{1 - r}$               | Converges iff $\vert r\vert < 1$ |
| 111 | Geometric Mean            |                 $\text{GM} = \sqrt{ab}$                 | $a, b > 0$                       |

#### Harmonic Progression & Standard Series Sums

| No. | Formula / Series                |                                    Expression                                    | Conditions / Notes                     |
| :-: | :------------------------------ | :------------------------------------------------------------------------------: | :------------------------------------- |
| 112 | Harmonic Progression Definition | $a, b, c \in \text{HP} \iff \frac{1}{a}, \frac{1}{b}, \frac{1}{c} \in \text{AP}$ | Reciprocal sequence form               |
| 113 | Harmonic Mean (Two Numbers)     |                         $\text{HM} = \frac{2ab}{a + b}$                          | $a, b > 0$                             |
| 114 | Harmonic Mean ($n$ Numbers)     |                $\text{HM} = \frac{n}{\sum_{i=1}^n \frac{1}{x_i}}$                | Reciprocal of average of reciprocals   |
| 115 | AM-GM-HM Inequality             |                     $\text{AM} \ge \text{GM} \ge \text{HM}$                      | Equality holds iff all terms are equal |
| 116 | Sum of First $n$ Integers       |                      $\sum_{k=1}^n k = \frac{n(n + 1)}{2}$                       | Triangular numbers                     |
| 117 | Sum of First $n$ Squares        |                 $\sum_{k=1}^n k^2 = \frac{n(n + 1)(2n + 1)}{6}$                  | Sum of squares formula                 |
| 118 | Sum of First $n$ Cubes          |              $\sum_{k=1}^n k^3 = \left[\frac{n(n + 1)}{2}\right]^2$              | Square of the sum of integers          |

---

### 9. Binomial Theorem

| No. | Formula / Identity          |                     Expression                      | Conditions / Notes                      |
| :-: | :-------------------------- | :-------------------------------------------------: | :-------------------------------------- |
| 119 | Binomial Expansion          | $(a + b)^n = \sum_{k=0}^n \binom{n}{k} a^{n-k} b^k$ | Nonnegative integer $n$                 |
| 120 | Binomial Coefficient        |       $\binom{n}{k} = \frac{n!}{k!(n - k)!}$        | Combinations formula                    |
| 121 | General Term $T_{k+1}$      |        $T_{k+1} = \binom{n}{k} a^{n-k} b^k$         | $(k+1)$-th term of expansion            |
| 122 | Boundary Values             |          $\binom{n}{0} = \binom{n}{n} = 1$          | Endpoints of row in Pascal's triangle   |
| 123 | Symmetry Identity           |          $\binom{n}{k} = \binom{n}{n - k}$          | Symmetry of Pascal's triangle           |
| 124 | Pascal's Recurrence         | $\binom{n}{k} = \binom{n-1}{k} + \binom{n-1}{k-1}$  | Additive rule of Pascal's triangle      |
| 125 | Sum of Coefficients         |          $\sum_{k=0}^n \binom{n}{k} = 2^n$          | Total number of subsets of $n$ elements |
| 126 | Alternating Coefficient Sum |       $\sum_{k=0}^n (-1)^k \binom{n}{k} = 0$        | Valid for $n > 0$                       |

---

### 10. Permutations and Combinations

| No. | Concept / Rule                     |                      Formula                      | Conditions / Notes                                   |
| :-: | :--------------------------------- | :-----------------------------------------------: | :--------------------------------------------------- |
| 127 | Factorial Definition               |       $n! = n(n - 1)(n - 2)\cdots 2\cdot 1$       | Product of first $n$ positive integers               |
| 128 | Factorial of Zero                  |                     $0! = 1$                      | By definition / empty product                        |
| 129 | Permutations without Repetition    |         ${}^n P_r = \frac{n!}{(n - r)!}$          | Ordered arrangements of $r$ from $n$ distinct        |
| 130 | Combinations without Repetition    | ${}^n C_r = \binom{n}{r} = \frac{n!}{r!(n - r)!}$ | Unordered selections of $r$ from $n$ distinct        |
| 131 | Permutation-Combination Relation   |          ${}^n P_r = {}^n C_r \cdot r!$           | Accounts for $r!$ internal orderings                 |
| 132 | Permutations with Repetition       |        $\frac{n!}{n_1! n_2! \cdots n_k!}$         | Groups of identical objects of sizes $n_i$           |
| 133 | Circular Permutations (Distinct)   |                    $(n - 1)!$                     | Distinct clockwise vs counterclockwise               |
| 134 | Circular Permutations (Unoriented) |               $\frac{(n - 1)!}{2}$                | Flipping allowed (e.g. bead necklace)                |
| 135 | Combinations with Repetition       |              $\binom{n + r - 1}{r}$               | Stars and bars selection of $r$ items from $n$ types |

---

### 11. Set Theory

| No. | Law / Identity                 |                                                              Formula                                                              | Conditions / Notes                                 |
| :-: | :----------------------------- | :-------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------- |
| 136 | Inclusion-Exclusion (2 Sets)   |                             $\vert A \cup B\vert = \vert A\vert + \vert B\vert - \vert A \cap B\vert$                             | Prevents double-counting intersection              |
| 137 | Inclusion-Exclusion (3 Sets)   | $\vert A \cup B \cup C\vert = \vert A\vert + \vert B\vert + \vert C\vert - \sum \vert A \cap B\vert + \vert A \cap B \cap C\vert$ | Alternating inclusion-exclusion                    |
| 138 | Complement Cardinality         |                                          $\vert A^c\vert = \vert U\vert - \vert A\vert$                                           | Elements outside $A$ in universe $U$               |
| 139 | Set Difference                 |                                                       $A - B = A \cap B^c$                                                        | Elements in $A$ but not in $B$                     |
| 140 | De Morgan's Law (Union)        |                                                   $(A \cup B)^c = A^c \cap B^c$                                                   | Complement of union is intersection of complements |
| 141 | De Morgan's Law (Intersection) |                                                   $(A \cap B)^c = A^c \cup B^c$                                                   | Complement of intersection is union of complements |
| 142 | Cartesian Product Cardinality  |                                        $\vert A \times B\vert = \vert A\vert \vert B\vert$                                        | Ordered pairs $(a, b)$                             |
| 143 | Power Set Cardinality          |                                                 $\vert\mathcal{P}(A)\vert = 2^n$                                                  | Total distinct subsets of set of size $n$          |

---

### 12. Functions

| No. | Concept                   |                     Formula                      | Conditions / Notes                      |
| :-: | :------------------------ | :----------------------------------------------: | :-------------------------------------- |
| 144 | Composite Function        |            $(f \circ g)(x) = f(g(x))$            | Output of $g$ becomes input to $f$      |
| 145 | Inverse Function Identity | $f(f^{-1}(x)) = x \text{ and } f^{-1}(f(x)) = x$ | Bidirectional cancellation              |
| 146 | Even Function             |                  $f(-x) = f(x)$                  | Symmetric about the $y$-axis            |
| 147 | Odd Function              |                 $f(-x) = -f(x)$                  | Symmetric about the origin (rotational) |
| 148 | Average Rate of Change    |           $\frac{f(b) - f(a)}{b - a}$            | Secant line slope over $[a, b]$         |
| 149 | Linear Function           |                 $f(x) = mx + c$                  | Constant slope $m$, $y$-intercept $c$   |

---

## Geometry

### 13. Coordinate Geometry

| No. | Formula Name             |                                   Formula                                    | Conditions / Notes                                             |
| :-: | :----------------------- | :--------------------------------------------------------------------------: | :------------------------------------------------------------- |
| 150 | Distance Formula         |                  $d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$                  | Euclidean distance between $P_1(x_1, y_1)$ and $P_2(x_2, y_2)$ |
| 151 | Midpoint Formula         |         $M = \left(\frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2}\right)$          | Halfway point of line segment                                  |
| 152 | Internal Section Formula |   $P = \left(\frac{mx_2 + nx_1}{m + n}, \frac{my_2 + ny_1}{m + n}\right)$    | Divides segment internally in ratio $m:n$                      |
| 153 | External Section Formula |   $P = \left(\frac{mx_2 - nx_1}{m - n}, \frac{my_2 - ny_1}{m - n}\right)$    | Divides segment externally in ratio $m:n$ ($m \ne n$)          |
| 154 | Triangle Centroid        |   $G = \left(\frac{x_1 + x_2 + x_3}{3}, \frac{y_1 + y_2 + y_3}{3}\right)$    | Intersection of three medians                                  |
| 155 | Area from Coordinates    | $A = \frac{1}{2}\vert x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)\vert$ | Shoelace formula for vertices $(x_i, y_i)$                     |
| 156 | Collinearity Condition   |            $x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2) = 0$            | Area of triangle is zero iff points are collinear              |

---

### 14. Straight Lines

| No. | Form / Concept                  |                        Equation / Formula                         | Conditions / Notes                                            |
| :-: | :------------------------------ | :---------------------------------------------------------------: | :------------------------------------------------------------ |
| 157 | Slope of Line                   |                 $m = \frac{y_2 - y_1}{x_2 - x_1}$                 | Line through $(x_1, y_1)$ and $(x_2, y_2)$ ($x_1 \ne x_2$)    |
| 158 | Point-Slope Form                |                      $y - y_1 = m(x - x_1)$                       | Line through $(x_1, y_1)$ with slope $m$                      |
| 159 | Slope-Intercept Form            |                           $y = mx + c$                            | Slope $m$, $y$-intercept $(0, c)$                             |
| 160 | Two-Point Form                  |         $y - y_1 = \frac{y_2 - y_1}{x_2 - x_1}(x - x_1)$          | Line passing through two designated points                    |
| 161 | Intercept Form                  |                  $\frac{x}{a} + \frac{y}{b} = 1$                  | $x$-intercept $a$, $y$-intercept $b$ ($a, b \ne 0$)           |
| 162 | General Form Slope              |            $Ax + By + C = 0 \implies m = -\frac{A}{B}$            | Slope of general linear form ($B \ne 0$)                      |
| 163 | Angle Between Lines             | $\tan\theta = \left\vert\frac{m_2 - m_1}{1 + m_1 m_2}\right\vert$ | Acute angle between slopes $m_1, m_2$                         |
| 164 | Perpendicular Lines             |                          $m_1 m_2 = -1$                           | Slopes are negative reciprocals                               |
| 165 | Parallel Lines                  |                            $m_1 = m_2$                            | Slopes are equal                                              |
| 166 | Point to Line Distance          |     $d = \frac{\vert Ax_1 + By_1 + C\vert}{\sqrt{A^2 + B^2}}$     | Perpendicular distance from $(x_1, y_1)$ to $Ax + By + C = 0$ |
| 167 | Distance Between Parallel Lines |        $d = \frac{\vert C_1 - C_2\vert}{\sqrt{A^2 + B^2}}$        | Between $Ax + By + C_1 = 0$ and $Ax + By + C_2 = 0$           |

---

### 15. Circles

| No. | Property / Form         |                  Formula                  | Conditions / Notes                        |
| :-: | :---------------------- | :---------------------------------------: | :---------------------------------------- |
| 168 | Standard Equation       |       $(x - h)^2 + (y - k)^2 = r^2$       | Center $(h, k)$, radius $r$               |
| 169 | Center at Origin        |             $x^2 + y^2 = r^2$             | Center $(0, 0)$, radius $r$               |
| 170 | General Equation Center | $\left(-\frac{D}{2}, -\frac{E}{2}\right)$ | For $x^2 + y^2 + Dx + Ey + F = 0$         |
| 171 | General Equation Radius |  $r = \frac{1}{2}\sqrt{D^2 + E^2 - 4F}$   | Real circle requires $D^2 + E^2 - 4F > 0$ |
| 172 | Circumference           |           $C = 2\pi r = \pi d$            | Perimeter of circle                       |
| 173 | Area                    |     $A = \pi r^2 = \frac{\pi d^2}{4}$     | Total enclosed surface                    |
| 174 | Arc Length (Radians)    |               $s = r\theta$               | Angle $\theta$ in radians                 |
| 175 | Arc Length (Degrees)    |   $s = \frac{\theta}{360^\circ} 2\pi r$   | Angle $\theta$ in degrees                 |
| 176 | Sector Area (Radians)   |        $A = \frac{1}{2}r^2\theta$         | Central angle $\theta$ in radians         |
| 177 | Sector Area (Degrees)   |   $A = \frac{\theta}{360^\circ}\pi r^2$   | Central angle $\theta$ in degrees         |
| 178 | Chord Length            | $c = 2r\sin\left(\frac{\theta}{2}\right)$ | Central angle $\theta$                    |

---

### 16. Conic Sections

#### Parabola

| No. | Form / Property                |               Formula                | Conditions / Notes                       |
| :-: | :----------------------------- | :----------------------------------: | :--------------------------------------- |
| 179 | Horizontal Standard Parabola   |             $y^2 = 4ax$              | Opens right ($a > 0$) or left ($a < 0$)  |
| 180 | Vertical Standard Parabola     |             $x^2 = 4ay$              | Opens up ($a > 0$) or down ($a < 0$)     |
| 181 | Parabola Focus ($y^2=4ax$)     |           Focus: $(a, 0)$            | Directrix: $x = -a$                      |
| 182 | Parabola Vertex & Latus Rectum | Vertex: $(0, 0)$, Latus Rectum: $4a$ | Focal chord length perpendicular to axis |

#### Ellipse

| No. | Form / Property             |                    Formula                     | Conditions / Notes                  |
| :-: | :-------------------------- | :--------------------------------------------: | :---------------------------------- |
| 183 | Horizontal Ellipse Equation |    $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$     | Major axis horizontal ($a > b > 0$) |
| 184 | Vertical Ellipse Equation   |    $\frac{x^2}{b^2} + \frac{y^2}{a^2} = 1$     | Major axis vertical ($a > b > 0$)   |
| 185 | Focal Distance Relation     |               $c^2 = a^2 - b^2$                | $c$ is distance from center to foci |
| 186 | Eccentricity                | $e = \frac{c}{a} = \sqrt{1 - \frac{b^2}{a^2}}$ | $0 < e < 1$ for an ellipse          |
| 187 | Foci Coordinates            |                   (\pm c, 0)                   | Foci located on major axis          |
| 188 | Ellipse Area                |                  $A = \pi ab$                  | Total enclosed area                 |

#### Hyperbola

| No. | Form / Property               |                    Formula                     | Conditions / Notes                  |
| :-: | :---------------------------- | :--------------------------------------------: | :---------------------------------- |
| 189 | Horizontal Hyperbola Equation |    $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$     | Transverse axis on $x$-axis         |
| 190 | Vertical Hyperbola Equation   |    $\frac{y^2}{a^2} - \frac{x^2}{b^2} = 1$     | Transverse axis on $y$-axis         |
| 191 | Focal Distance Relation       |               $c^2 = a^2 + b^2$                | $c$ is distance from center to foci |
| 192 | Eccentricity                  | $e = \frac{c}{a} = \sqrt{1 + \frac{b^2}{a^2}}$ | $e > 1$ for a hyperbola             |
| 193 | Asymptotes (Horizontal Form)  |             $y = \pm \frac{b}{a}x$             | Slant asymptotes through origin     |
| 194 | Asymptotes (Vertical Form)    |             $y = \pm \frac{a}{b}x$             | Slant asymptotes through origin     |

---

### 17. Plane Geometry

| No. | Concept / Theorem              |                      Formula                       | Conditions / Notes                                        |
| :-: | :----------------------------- | :------------------------------------------------: | :-------------------------------------------------------- |
| 195 | Straight Angle                 |           $180^\circ = \pi \text{ rad}$            | Angle on a straight line                                  |
| 196 | Full Revolution                |           $360^\circ = 2\pi \text{ rad}$           | Complete circular angle around a point                    |
| 197 | Complementary Angles           |                 $A + B = 90^\circ$                 | Two angles sum to right angle                             |
| 198 | Supplementary Angles           |                $A + B = 180^\circ$                 | Two angles sum to straight angle                          |
| 199 | Interior Angle Sum ($n$-gon)   |               $S = (n - 2)180^\circ$               | Total interior angles of any $n$-sided polygon            |
| 200 | Regular $n$-gon Interior Angle | $\theta_{\text{int}} = \frac{(n - 2)180^\circ}{n}$ | Each interior angle of regular polygon                    |
| 201 | Sum of Exterior Angles         |            $S_{\text{ext}} = 360^\circ$            | Exterior angles sum to $360^\circ$ for any convex polygon |
| 202 | Regular $n$-gon Exterior Angle |    $\theta_{\text{ext}} = \frac{360^\circ}{n}$     | Each exterior angle of regular polygon                    |
| 203 | Number of Diagonals            |              $D = \frac{n(n - 3)}{2}$              | Total diagonals connecting non-adjacent vertices          |
| 204 | Similar Figures Area Ratio     |              $\frac{A_2}{A_1} = k^2$               | For linear scale factor $k = \frac{L_2}{L_1}$             |
| 205 | Similar Figures Volume Ratio   |              $\frac{V_2}{V_1} = k^3$               | For linear scale factor $k = \frac{L_2}{L_1}$             |

---

### 18. Triangles

| No. | Formula Name                 |                                Formula                                | Conditions / Notes                                 |
| :-: | :--------------------------- | :-------------------------------------------------------------------: | :------------------------------------------------- |
| 206 | Basic Area                   |                          $A = \frac{1}{2}bh$                          | Base $b$, perpendicular height $h$                 |
| 207 | Semiperimeter                |                       $s = \frac{a + b + c}{2}$                       | Half of triangle perimeter                         |
| 208 | Heron's Formula              |                  $A = \sqrt{s(s - a)(s - b)(s - c)}$                  | Area from three side lengths $a, b, c$             |
| 209 | Equilateral Triangle Height  |                       $h = \frac{\sqrt{3}}{2}a$                       | For side length $a$                                |
| 210 | Equilateral Triangle Area    |                      $A = \frac{\sqrt{3}}{4}a^2$                      | Area of equilateral triangle                       |
| 211 | Pythagorean Theorem          |                           $a^2 + b^2 = c^2$                           | Right triangle with hypotenuse $c$                 |
| 212 | Law of Sines                 |     $\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C} = 2R$     | $R$ is circumradius                                |
| 213 | Law of Cosines               |                     $a^2 = b^2 + c^2 - 2bc\cos A$                     | Solves SAS and SSS configurations                  |
| 214 | Area via Sine (SAS)          | $A = \frac{1}{2}bc\sin A = \frac{1}{2}ca\sin B = \frac{1}{2}ab\sin C$ | Area from two sides and included angle             |
| 215 | Circumradius Formula         |                         $R = \frac{abc}{4A}$                          | Radius of circumscribed circle                     |
| 216 | Inradius Formula             |                   $r = \frac{A}{s} \implies A = rs$                   | Radius of inscribed circle                         |
| 217 | Euler's Triangle Relation    |                          $OI^2 = R(R - 2r)$                           | Distance between circumcenter $O$ and incenter $I$ |
| 218 | Median Length (to side $a$)  |              $m_a = \frac{1}{2}\sqrt{2b^2 + 2c^2 - a^2}$              | Apollonius theorem for median length               |
| 219 | Angle Bisector (to side $a$) |                  $t_a = \frac{2bc\cos(A/2)}{b + c}$                   | Internal bisector of angle $A$                     |

---

### 19. Quadrilaterals and Polygons

| No. | Shape         |                Property / Formula                | Conditions / Notes                      |
| :-: | :------------ | :----------------------------------------------: | :-------------------------------------- |
| 220 | Square        |       $P = 4a,\; A = a^2,\; d = a\sqrt{2}$       | Side length $a$, diagonal $d$           |
| 221 | Rectangle     | $P = 2(l + w),\; A = lw,\; d = \sqrt{l^2 + w^2}$ | Length $l$, width $w$, diagonal $d$     |
| 222 | Parallelogram |             $A = bh,\; P = 2(a + b)$             | Base $b$, height $h$, adjacent side $a$ |
| 223 | Rhombus       |        $A = \frac{1}{2}d_1 d_2,\; P = 4a$        | Diagonals $d_1, d_2$ are perpendicular  |
| 224 | Trapezoid     |            $A = \frac{1}{2}(a + b)h$             | Parallel bases $a, b$ with height $h$   |
| 225 | Kite          |             $A = \frac{1}{2}d_1 d_2$             | Diagonals $d_1, d_2$ are perpendicular  |

---

### 20. 3D Geometry and Mensuration

| No. | Solid                      |                                                Formulas                                                | Conditions / Notes                                   |
| :-: | :------------------------- | :----------------------------------------------------------------------------------------------------: | :--------------------------------------------------- |
| 226 | Cube                       |                                 $V = a^3,\; S = 6a^2,\; d = a\sqrt{3}$                                 | Edge $a$, total surface area $S$, space diagonal $d$ |
| 227 | Rectangular Prism (Cuboid) |                     $V = lwh,\; S = 2(lw + lh + wh),\; d = \sqrt{l^2 + w^2 + h^2}$                     | Length $l$, width $w$, height $h$                    |
| 228 | Right Circular Cylinder    |                 $V = \pi r^2 h,\; \text{CSA} = 2\pi rh,\; \text{TSA} = 2\pi r(h + r)$                  | Base radius $r$, height $h$                          |
| 229 | Right Circular Cone        | $l = \sqrt{r^2 + h^2},\; V = \frac{1}{3}\pi r^2 h,\; \text{CSA} = \pi rl,\; \text{TSA} = \pi r(l + r)$ | Slant height $l$, radius $r$, vertical height $h$    |
| 230 | Sphere                     |                                $S = 4\pi r^2,\; V = \frac{4}{3}\pi r^3$                                | Surface area $S$, volume $V$                         |
| 231 | Hemisphere                 |               $\text{CSA} = 2\pi r^2,\; \text{TSA} = 3\pi r^2,\; V = \frac{2}{3}\pi r^3$               | Curved and total surface area                        |
| 232 | Right Prism                |                               $V = Bh,\; \text{LSA} = P_{\text{base}} h$                               | Base area $B$, base perimeter $P_{\text{base}}$      |
| 233 | Regular Pyramid            |                                          $V = \frac{1}{3}Bh$                                           | Base area $B$, vertical height $h$                   |

---

## Trigonometry

### 21. Trigonometry

#### Right-Triangle Ratios & Reciprocals

| No. | Ratio / Function   |                         Formula                          | Conditions / Notes        |
| :-: | :----------------- | :------------------------------------------------------: | :------------------------ |
| 234 | Sine Ratio         | $\sin\theta = \frac{\text{Opposite}}{\text{Hypotenuse}}$ | Right triangle definition |
| 235 | Cosine Ratio       | $\cos\theta = \frac{\text{Adjacent}}{\text{Hypotenuse}}$ | Right triangle definition |
| 236 | Tangent Ratio      |  $\tan\theta = \frac{\text{Opposite}}{\text{Adjacent}}$  | Right triangle definition |
| 237 | Cosecant Ratio     |           $\csc\theta = \frac{1}{\sin\theta}$            | Reciprocal of sine        |
| 238 | Secant Ratio       |           $\sec\theta = \frac{1}{\cos\theta}$            | Reciprocal of cosine      |
| 239 | Cotangent Ratio    |           $\cot\theta = \frac{1}{\tan\theta}$            | Reciprocal of tangent     |
| 240 | Tangent Quotient   |       $\tan\theta = \frac{\sin\theta}{\cos\theta}$       | Ratio of sine to cosine   |
| 241 | Cotangent Quotient |       $\cot\theta = \frac{\cos\theta}{\sin\theta}$       | Ratio of cosine to sine   |

#### Pythagorean, Parity & Cofunction Identities

| No. | Identity                 |                        Formula                         | Conditions / Notes                  |
| :-: | :----------------------- | :----------------------------------------------------: | :---------------------------------- |
| 242 | Pythagorean Identity I   |           $\sin^2\theta + \cos^2\theta = 1$            | Fundamental identity on unit circle |
| 243 | Pythagorean Identity II  |           $1 + \tan^2\theta = \sec^2\theta$            | Divide by $\cos^2\theta$            |
| 244 | Pythagorean Identity III |           $1 + \cot^2\theta = \csc^2\theta$            | Divide by $\sin^2\theta$            |
| 245 | Sine Parity (Odd)        |                  $\sin(-x) = -\sin x$                  | Odd function                        |
| 246 | Cosine Parity (Even)     |                  $\cos(-x) = \cos x$                   | Even function                       |
| 247 | Tangent Parity (Odd)     |                  $\tan(-x) = -\tan x$                  | Odd function                        |
| 248 | Cotangent Parity (Odd)   |                  $\cot(-x) = -\cot x$                  | Odd function                        |
| 249 | Secant Parity (Even)     |                  $\sec(-x) = \sec x$                   | Even function                       |
| 250 | Cosecant Parity (Odd)    |                  $\csc(-x) = -\csc x$                  | Odd function                        |
| 251 | Sine Cofunction          | $\sin\left(\frac{\pi}{2} - \theta\right) = \cos\theta$ | Complementary angle relation        |
| 252 | Cosine Cofunction        | $\cos\left(\frac{\pi}{2} - \theta\right) = \sin\theta$ | Complementary angle relation        |
| 253 | Tangent Cofunction       | $\tan\left(\frac{\pi}{2} - \theta\right) = \cot\theta$ | Complementary angle relation        |

#### Compound, Multiple & Half-Angle Formulas

| No. | Identity Name             |                                                   Formula                                                   | Conditions / Notes                        |
| :-: | :------------------------ | :---------------------------------------------------------------------------------------------------------: | :---------------------------------------- |
| 254 | Sine of Sum               |                                 $\sin(A + B) = \sin A\cos B + \cos A\sin B$                                 | Compound angle formula                    |
| 255 | Sine of Difference        |                                 $\sin(A - B) = \sin A\cos B - \cos A\sin B$                                 | Compound angle formula                    |
| 256 | Cosine of Sum             |                                 $\cos(A + B) = \cos A\cos B - \sin A\sin B$                                 | Compound angle formula                    |
| 257 | Cosine of Difference      |                                 $\cos(A - B) = \cos A\cos B + \sin A\sin B$                                 | Compound angle formula                    |
| 258 | Tangent of Sum            |                          $\tan(A + B) = \frac{\tan A + \tan B}{1 - \tan A\tan B}$                           | Compound angle formula                    |
| 259 | Tangent of Difference     |                          $\tan(A - B) = \frac{\tan A - \tan B}{1 + \tan A\tan B}$                           | Compound angle formula                    |
| 260 | Sine Double Angle         |                                   $\sin 2\theta = 2\sin\theta\cos\theta$                                    | Double angle formula                      |
| 261 | Cosine Double Angle (I)   |                                $\cos 2\theta = \cos^2\theta - \sin^2\theta$                                 | Double angle formula                      |
| 262 | Cosine Double Angle (II)  |                                     $\cos 2\theta = 2\cos^2\theta - 1$                                      | Cosine-only form                          |
| 263 | Cosine Double Angle (III) |                                     $\cos 2\theta = 1 - 2\sin^2\theta$                                      | Sine-only form                            |
| 264 | Tangent Double Angle      |                            $\tan 2\theta = \frac{2\tan\theta}{1 - \tan^2\theta}$                            | Double angle formula                      |
| 265 | Sine Triple Angle         |                                $\sin 3\theta = 3\sin\theta - 4\sin^3\theta$                                 | Triple angle expansion                    |
| 266 | Cosine Triple Angle       |                                $\cos 3\theta = 4\cos^3\theta - 3\cos\theta$                                 | Triple angle expansion                    |
| 267 | Tangent Triple Angle      |                    $\tan 3\theta = \frac{3\tan\theta - \tan^3\theta}{1 - 3\tan^2\theta}$                    | Triple angle expansion                    |
| 268 | Sine Half Angle           |                  $\sin\left(\frac{\theta}{2}\right) = \pm\sqrt{\frac{1 - \cos\theta}{2}}$                   | Sign determined by quadrant of $\theta/2$ |
| 269 | Cosine Half Angle         |                  $\cos\left(\frac{\theta}{2}\right) = \pm\sqrt{\frac{1 + \cos\theta}{2}}$                   | Sign determined by quadrant of $\theta/2$ |
| 270 | Tangent Half Angle        | $\tan\left(\frac{\theta}{2}\right) = \frac{1 - \cos\theta}{\sin\theta} = \frac{\sin\theta}{1 + \cos\theta}$ | Rational half-angle forms                 |

#### Product-Sum & Power Reduction Transformations

| No. | Transformation                |                                        Formula                                         | Conditions / Notes               |
| :-: | :---------------------------- | :------------------------------------------------------------------------------------: | :------------------------------- |
| 271 | Product to Sum: $\sin\sin$    |                $\sin A\sin B = \frac{1}{2}[\cos(A - B) - \cos(A + B)]$                 | Converts products to sums        |
| 272 | Product to Sum: $\cos\cos$    |                $\cos A\cos B = \frac{1}{2}[\cos(A - B) + \cos(A + B)]$                 | Converts products to sums        |
| 273 | Product to Sum: $\sin\cos$    |                $\sin A\cos B = \frac{1}{2}[\sin(A + B) + \sin(A - B)]$                 | Converts products to sums        |
| 274 | Sum to Product: $\sin + \sin$ | $\sin A + \sin B = 2\sin\left(\frac{A + B}{2}\right)\cos\left(\frac{A - B}{2}\right)$  | Converts sums to products        |
| 275 | Sum to Product: $\sin - \sin$ | $\sin A - \sin B = 2\cos\left(\frac{A + B}{2}\right)\sin\left(\frac{A - B}{2}\right)$  | Converts differences to products |
| 276 | Sum to Product: $\cos + \cos$ | $\cos A + \cos B = 2\cos\left(\frac{A + B}{2}\right)\cos\left(\frac{A - B}{2}\right)$  | Converts sums to products        |
| 277 | Sum to Product: $\cos - \cos$ | $\cos A - \cos B = -2\sin\left(\frac{A + B}{2}\right)\sin\left(\frac{A - B}{2}\right)$ | Converts differences to products |
| 278 | Sine Power Reduction          |                      $\sin^2\theta = \frac{1 - \cos 2\theta}{2}$                       | Useful in calculus integrations  |
| 279 | Cosine Power Reduction        |                      $\cos^2\theta = \frac{1 + \cos 2\theta}{2}$                       | Useful in calculus integrations  |
| 280 | Tangent Power Reduction       |               $\tan^2\theta = \frac{1 - \cos 2\theta}{1 + \cos 2\theta}$               | Ratio of power reduction forms   |

---

### 22. Inverse Trigonometry

| No. | Property / Identity           |                                                         Expression                                                          | Conditions / Notes                              |
| :-: | :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------- |
| 281 | $\arcsin x$ Principal Range   |                                 $\arcsin x \in \left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$                                  | Domain: $x \in [-1, 1]$                         |
| 282 | $\arccos x$ Principal Range   |                                                  $\arccos x \in [0, \pi]$                                                   | Domain: $x \in [-1, 1]$                         |
| 283 | $\arctan x$ Principal Range   |                                 $\arctan x \in \left(-\frac{\pi}{2}, \frac{\pi}{2}\right)$                                  | Domain: $x \in \mathbb{R}$                      |
| 284 | Complementary Arc Sum         |                                           $\arcsin x + \arccos x = \frac{\pi}{2}$                                           | Valid for $x \in [-1, 1]$                       |
| 285 | Reciprocal Argument $\arctan$ | $\arctan x + \arctan\left(\frac{1}{x}\right) = \begin{cases} \frac{\pi}{2}, & x > 0 \\ -\frac{\pi}{2}, & x < 0 \end{cases}$ | Reciprocal argument identity                    |
| 286 | Addition of $\arctan$         |                             $\arctan x + \arctan y = \arctan\left(\frac{x + y}{1 - xy}\right)$                              | For $xy < 1$ (quadrant adjustments if $xy > 1$) |

---

## Complex Numbers

### 23. Complex Numbers

| No. | Concept / Property             |                             Formula                             | Conditions / Notes                                             |
| :-: | :----------------------------- | :-------------------------------------------------------------: | :------------------------------------------------------------- |
| 287 | Standard Algebraic Form        |                          $z = a + bi$                           | $a = \operatorname{Re}(z), b = \operatorname{Im}(z), i^2 = -1$ |
| 288 | Powers of $i$ Cycle            |          $i^0=1,\; i^1=i,\; i^2=-1,\; i^3=-i,\; i^4=1$          | Powers repeat with period 4                                    |
| 289 | Complex Conjugate              |                       $\bar{z} = a - bi$                        | Reflection across real axis                                    |
| 290 | Modulus (Absolute Value)       |                $\vert z\vert = \sqrt{a^2 + b^2}$                | Euclidean distance from origin in complex plane                |
| 291 | Modulus-Conjugate Relation     |                   $z\bar{z} = \vert z\vert^2$                   | Crucial for division / rationalization                         |
| 292 | Complex Addition               |           $(a + bi) + (c + di) = (a + c) + (b + d)i$            | Add real and imaginary parts                                   |
| 293 | Complex Multiplication         |           $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$           | FOIL expansion with $i^2 = -1$                                 |
| 294 | Complex Division               |  $\frac{a + bi}{c + di} = \frac{(a + bi)(c - di)}{c^2 + d^2}$   | Multiply numerator & denominator by $\bar{w}$                  |
| 295 | Polar Trigonometric Form       |                $z = r(\cos\theta + i\sin\theta)$                | $r = \vert z\vert, \theta = \operatorname{arg}(z)$             |
| 296 | Euler's Formula                |            $e^{i\theta} = \cos\theta + i\sin\theta$             | Bridges complex exponential and trigonometry                   |
| 297 | Exponential Complex Form       |                       $z = r e^{i\theta}$                       | Compact polar representation                                   |
| 298 | De Moivre's Theorem            | $(\cos\theta + i\sin\theta)^n = \cos(n\theta) + i\sin(n\theta)$ | $(e^{i\theta})^n = e^{in\theta}$ for $n \in \mathbb{Z}$        |
| 299 | $n$-th Roots of Complex Number |          $z_k = r^{1/n} e^{i\frac{\theta + 2k\pi}{n}}$          | $k = 0, 1, \ldots, n-1$ (equally spaced roots)                 |
| 300 | Euler's Identity               |                       $e^{i\pi} + 1 = 0$                        | Fundamental identity linking 5 core constants                  |

---

## Differentiation

### 24. Limits

| No. | Limit Law / Standard Limit  |                              Formula                               | Conditions / Notes                  |
| :-: | :-------------------------- | :----------------------------------------------------------------: | :---------------------------------- |
| 301 | Derivative Definition Limit |         $f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}$         | Instantaneous rate of change        |
| 302 | Fundamental Trig Limit I    |               $\lim_{x \to 0} \frac{\sin x}{x} = 1$                | Angle $x$ measured in radians       |
| 303 | Fundamental Trig Limit II   |               $\lim_{x \to 0} \frac{\tan x}{x} = 1$                | Angle $x$ measured in radians       |
| 304 | Cosine Limit                |       $\lim_{x \to 0} \frac{1 - \cos x}{x^2} = \frac{1}{2}$        | Derived via half-angle identity     |
| 305 | Exponential Limit           |               $\lim_{x \to 0} \frac{e^x - 1}{x} = 1$               | Derivative of $e^x$ at $x=0$        |
| 306 | Logarithmic Limit           |             $\lim_{x \to 0} \frac{\ln(1 + x)}{x} = 1$              | Derivative of $\ln x$ at $x=1$      |
| 307 | Euler's Number Limit        |      $\lim_{x \to \infty} \left(1 + \frac{1}{x}\right)^x = e$      | Continuous compounding base         |
| 308 | Generalized Euler Limit     |     $\lim_{x \to \infty} \left(1 + \frac{a}{x}\right)^x = e^a$     | Exponential power limit             |
| 309 | Sum & Product Laws          | $\lim(f \pm g) = \lim f \pm \lim g,\; \lim(fg) = (\lim f)(\lim g)$ | Provided limits exist independently |
| 310 | Quotient Law                |             $\lim \frac{f}{g} = \frac{\lim f}{\lim g}$             | Valid when $\lim g \ne 0$           |

---

### 25. Differentiation

#### Basic & Core Differentiation Rules

| No. | Rule                       |                             Formula                              | Conditions / Notes                        |
| :-: | :------------------------- | :--------------------------------------------------------------: | :---------------------------------------- |
| 311 | Constant Rule              |                      $\frac{d}{dx}(c) = 0$                       | Derivative of constant is zero            |
| 312 | Power Rule                 |                 $\frac{d}{dx}(x^n) = n x^{n-1}$                  | Valid for all real powers $n$             |
| 313 | Constant Multiple Rule     |                 $\frac{d}{dx}[c f(x)] = c f'(x)$                 | Scalar factors out of derivative          |
| 314 | Sum and Difference Rule    |         $\frac{d}{dx}[f(x) \pm g(x)] = f'(x) \pm g'(x)$          | Linearity of derivative operator          |
| 315 | Product Rule               |                $\frac{d}{dx}[f g] = f' g + f g'$                 | Leibniz product rule                      |
| 316 | Quotient Rule              | $\frac{d}{dx}\left[\frac{f}{g}\right] = \frac{f' g - f g'}{g^2}$ | Valid where $g(x) \ne 0$                  |
| 317 | Chain Rule (Function Form) |             $\frac{d}{dx}[f(g(x))] = f'(g(x)) g'(x)$             | Derivative of composite functions         |
| 318 | Chain Rule (Leibniz Form)  |           $\frac{dy}{dx} = \frac{dy}{du}\frac{du}{dx}$           | Chain rule with intermediate variable $u$ |

#### Derivatives of Elementary Functions

| No. | Function                   |                      Derivative                       | Conditions / Notes                  |
| :-: | :------------------------- | :---------------------------------------------------: | :---------------------------------- |
| 319 | Natural Exponential        |               $\frac{d}{dx}(e^x) = e^x$               | Eigenfunction of differentiation    |
| 320 | Composite Exponential      |             $\frac{d}{dx}(e^u) = e^u u'$              | Chain rule form ($u = u(x)$)        |
| 321 | General Exponential        |            $\frac{d}{dx}(a^x) = a^x \ln a$            | $a > 0, a \ne 1$                    |
| 322 | Natural Logarithm          |          $\frac{d}{dx}(\ln x) = \frac{1}{x}$          | $x > 0$                             |
| 323 | General Logarithm          |     $\frac{d}{dx}(\log_a x) = \frac{1}{x \ln a}$      | $a > 0, a \ne 1, x > 0$             |
| 324 | Sine Derivative            |            $\frac{d}{dx}(\sin x) = \cos x$            | Radians required                    |
| 325 | Cosine Derivative          |           $\frac{d}{dx}(\cos x) = -\sin x$            | Radians required                    |
| 326 | Tangent Derivative         |           $\frac{d}{dx}(\tan x) = \sec^2 x$           | Radians required                    |
| 327 | Cotangent Derivative       |          $\frac{d}{dx}(\cot x) = -\csc^2 x$           | Radians required                    |
| 328 | Secant Derivative          |         $\frac{d}{dx}(\sec x) = \sec x\tan x$         | Radians required                    |
| 329 | Cosecant Derivative        |        $\frac{d}{dx}(\csc x) = -\csc x\cot x$         | Radians required                    |
| 330 | Inverse Sine Derivative    | $\frac{d}{dx}(\arcsin x) = \frac{1}{\sqrt{1 - x^2}}$  | $\vert x\vert < 1$                  |
| 331 | Inverse Cosine Derivative  | $\frac{d}{dx}(\arccos x) = -\frac{1}{\sqrt{1 - x^2}}$ | $\vert x\vert < 1$                  |
| 332 | Inverse Tangent Derivative |     $\frac{d}{dx}(\arctan x) = \frac{1}{1 + x^2}$     | Valid for all $x \in \mathbb{R}$    |
| 333 | Hyperbolic Sine            |           $\frac{d}{dx}(\sinh x) = \cosh x$           | $\sinh x = \frac{e^x - e^{-x}}{2}$  |
| 334 | Hyperbolic Cosine          |           $\frac{d}{dx}(\cosh x) = \sinh x$           | $\cosh x = \frac{e^x + e^{-x}}{2}$  |
| 335 | Hyperbolic Tangent         |   $\frac{d}{dx}(\tanh x) = \operatorname{sech}^2 x$   | $\tanh x = \frac{\sinh x}{\cosh x}$ |

---

### 26. Applications of Differentiation

| No. | Application / Concept        |                                   Formula / Rule                                   | Conditions / Notes                                 |
| :-: | :--------------------------- | :--------------------------------------------------------------------------------: | :------------------------------------------------- |
| 336 | Tangent Line Equation        |                             $y - f(a) = f'(a)(x - a)$                              | Point-slope line with derivative as slope          |
| 337 | Normal Line Equation         |                        $y - f(a) = -\frac{1}{f'(a)}(x - a)$                        | Perpendicular to tangent ($f'(a) \ne 0$)           |
| 338 | Critical Point Condition     |                  $f'(x) = 0 \text{ or } f'(x) \text{ undefined}$                   | Candidates for local extrema                       |
| 339 | Second Derivative Test (Min) |           $f'(c) = 0 \text{ and } f''(c) > 0 \implies \text{Local Min}$            | Graph concave up at $c$                            |
| 340 | Second Derivative Test (Max) |           $f'(c) = 0 \text{ and } f''(c) < 0 \implies \text{Local Max}$            | Graph concave down at $c$                          |
| 341 | Monotonicity Test            |   $f'(x) > 0 \implies \text{Increasing},\; f'(x) < 0 \implies \text{Decreasing}$   | Over open interval $I$                             |
| 342 | Concavity Test               | $f''(x) > 0 \implies \text{Concave Up},\; f''(x) < 0 \implies \text{Concave Down}$ | Over open interval $I$                             |
| 343 | Linear Approximation         |                         $f(x) \approx f(a) + f'(a)(x - a)$                         | First-order Taylor polynomial near $a$             |
| 344 | Mean Value Theorem (MVT)     |                        $f'(c) = \frac{f(b) - f(a)}{b - a}$                         | Continuous on $[a, b]$, differentiable on $(a, b)$ |
| 345 | Rolle's Theorem              |               $f(a) = f(b) \implies \exists c \in (a, b): f'(c) = 0$               | Special case of MVT with equal endpoints           |

---

## Integration

### 27. Integration

#### Indefinite Integrals & Core Techniques

| No. | Rule / Form                  |                         Formula                          | Conditions / Notes                           |
| :-: | :--------------------------- | :------------------------------------------------------: | :------------------------------------------- |
| 346 | Constant Rule                |                  $\int c\,dx = cx + C$                   | $c$ is constant, $C$ is integration constant |
| 347 | Power Rule of Integration    |         $\int x^n\,dx = \frac{x^{n+1}}{n+1} + C$         | Valid for all $n \ne -1$                     |
| 348 | Reciprocal Integral          |       $\int \frac{1}{x}\,dx = \ln\vert x\vert + C$       | $x \ne 0$                                    |
| 349 | Exponential Integral         |                 $\int e^x\,dx = e^x + C$                 | Natural base exponential                     |
| 350 | General Exponential Integral |          $\int a^x\,dx = \frac{a^x}{\ln a} + C$          | $a > 0, a \ne 1$                             |
| 351 | Linearity of Integration     | $\int [a f(x) + b g(x)]dx = a\int f(x)dx + b\int g(x)dx$ | Linear operator property                     |
| 352 | Integration by Substitution  |         $\int f(g(x))g'(x)\,dx = \int f(u)\,du$          | $u = g(x), du = g'(x)dx$                     |
| 353 | Integration by Parts         |              $\int u\,dv = uv - \int v\,du$              | Derived from product rule                    |

#### Trigonometric & Special Integrals

| No. | Integrand                            |                                 Antiderivative                                  | Conditions / Notes                   |
| :-: | :----------------------------------- | :-----------------------------------------------------------------------------: | :----------------------------------- |
| 354 | Sine Integral                        |                         $\int \sin x\,dx = -\cos x + C$                         | Antiderivative of sine               |
| 355 | Cosine Integral                      |                         $\int \cos x\,dx = \sin x + C$                          | Antiderivative of cosine             |
| 356 | Tangent Integral                     |     $\int \tan x\,dx = -\ln\vert\cos x\vert + C = \ln\vert\sec x\vert + C$      | Integrable via substitution          |
| 357 | Cotangent Integral                   |                   $\int \cot x\,dx = \ln\vert\sin x\vert + C$                   | Integrable via substitution          |
| 358 | Secant Squared Integral              |                        $\int \sec^2 x\,dx = \tan x + C$                         | Standard derivative inverse          |
| 359 | Cosecant Squared Integral            |                        $\int \csc^2 x\,dx = -\cot x + C$                        | Standard derivative inverse          |
| 360 | Secant-Tangent Integral              |                      $\int \sec x\tan x\,dx = \sec x + C$                       | Standard derivative inverse          |
| 361 | Cosecant-Cotangent Integral          |                      $\int \csc x\cot x\,dx = -\csc x + C$                      | Standard derivative inverse          |
| 362 | Inverse Tangent Form                 | $\int \frac{1}{a^2 + x^2}\,dx = \frac{1}{a}\arctan\left(\frac{x}{a}\right) + C$ | $a > 0$                              |
| 363 | Inverse Sine Form                    |   $\int \frac{1}{\sqrt{a^2 - x^2}}\,dx = \arcsin\left(\frac{x}{a}\right) + C$   | $a > 0, \vert x\vert < a$            |
| 364 | Fundamental Theorem of Calculus (I)  |                     $\frac{d}{dx}\int_a^x f(t)\,dt = f(x)$                      | Differentiation of integral function |
| 365 | Fundamental Theorem of Calculus (II) |                        $\int_a^b f(x)\,dx = F(b) - F(a)$                        | $F'(x) = f(x)$ on $[a, b]$           |

---

### 28. Applications of Integration

| No. | Application                        |                       Formula                       | Conditions / Notes                       |
| :-: | :--------------------------------- | :-------------------------------------------------: | :--------------------------------------- |
| 366 | Area Under Curve                   |               $A = \int_a^b f(x)\,dx$               | For $f(x) \ge 0$ on $[a, b]$             |
| 367 | Area Between Curves ($x$-slices)   |          $A = \int_a^b [f(x) - g(x)]\,dx$           | $f(x) \ge g(x)$ (upper minus lower)      |
| 368 | Area Between Curves ($y$-slices)   |          $A = \int_c^d [f(y) - g(y)]\,dy$           | $f(y) \ge g(y)$ (right minus left)       |
| 369 | Solid of Revolution: Disk Method   |           $V = \pi\int_a^b [f(x)]^2\,dx$            | Rotation around the $x$-axis             |
| 370 | Solid of Revolution: Washer Method |       $V = \pi\int_a^b [R(x)^2 - r(x)^2]\,dx$       | Outer radius $R(x)$, inner radius $r(x)$ |
| 371 | Solid of Revolution: Shell Method  |            $V = 2\pi\int_a^b x f(x)\,dx$            | Rotation around the $y$-axis ($x \ge 0$) |
| 372 | Arc Length ($y = f(x)$)            |       $L = \int_a^b \sqrt{1 + [f'(x)]^2}\,dx$       | Curve length along $x$-interval $[a, b]$ |
| 373 | Arc Length ($x = g(y)$)            |       $L = \int_c^d \sqrt{1 + [g'(y)]^2}\,dy$       | Curve length along $y$-interval $[c, d]$ |
| 374 | Surface Area of Revolution         |   $S = 2\pi\int_a^b f(x)\sqrt{1 + [f'(x)]^2}\,dx$   | Rotation of $y=f(x)$ around $x$-axis     |
| 375 | Average Value of Function          | $f_{\text{avg}} = \frac{1}{b - a}\int_a^b f(x)\,dx$ | Mean height of function over $[a, b]$    |

---

### 29. Differential Equations

| No. | ODE Type                       |                             Form & Solution                              | Conditions / Notes                               |
| :-: | :----------------------------- | :----------------------------------------------------------------------: | :----------------------------------------------- |
| 376 | Separable ODE                  | $\frac{dy}{dx} = g(x)h(y) \implies \int \frac{dy}{h(y)} = \int g(x)\,dx$ | Separate variables and integrate both sides      |
| 377 | First-Order Linear ODE         |                      $\frac{dy}{dx} + P(x)y = Q(x)$                      | Standard linear differential equation            |
| 378 | Integrating Factor             |                         $IF = e^{\int P(x)\,dx}$                         | Factor converting LHS into product derivative    |
| 379 | First-Order Linear Solution    |                    $y \cdot IF = \int Q(x)IF\,dx + C$                    | General solution via integrating factor          |
| 380 | Exponential Growth / Decay     |             $\frac{dy}{dt} = ky \implies y(t) = y_0 e^{kt}$              | $k > 0$ growth, $k < 0$ decay                    |
| 381 | Radioactive Half-Life          |                  $t_{1/2} = \frac{\ln 2}{\vert k\vert}$                  | Time required for half of substance to decay     |
| 382 | Logistic Differential Equation |             $\frac{dP}{dt} = rP\left(1 - \frac{P}{K}\right)$             | Carrying capacity $K$, intrinsic growth rate $r$ |
| 383 | Logistic Analytical Solution   |       $P(t) = \frac{K}{1 + A e^{-rt}},\; A = \frac{K - P_0}{P_0}$        | S-shaped sigmoidal population curve              |
| 384 | Second-Order Homogeneous ODE   |                         $a y'' + b y' + c y = 0$                         | Constant coefficients $a, b, c$                  |
| 385 | Characteristic Equation        |                          $a r^2 + b r + c = 0$                           | Quadratic auxiliary equation in $r$              |

---

## Vectors & Matrices

### 30. Vectors

| No. | Vector Concept / Operation  |                                                               Formula                                                               | Conditions / Notes                                                            |
| :-: | :-------------------------- | :---------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------- |
| 386 | 3D Component Representation |                      $\vec{v} = \langle v_1, v_2, v_3\rangle = v_1\mathbf{i} + v_2\mathbf{j} + v_3\mathbf{k}$                       | Cartesian vector components                                                   |
| 387 | Vector Magnitude            |                                         $\vert\vec{v}\vert = \sqrt{v_1^2 + v_2^2 + v_3^2}$                                          | Euclidean length / norm                                                       |
| 388 | Unit Vector                 |                                            $\hat{v} = \frac{\vec{v}}{\vert\vec{v}\vert}$                                            | Normalization of nonzero vector $\vec{v}$                                     |
| 389 | Vector Addition             |                                $\vec{a} + \vec{b} = \langle a_1 + b_1, a_2 + b_2, a_3 + b_3\rangle$                                 | Component-wise addition                                                       |
| 390 | Dot Product (Algebraic)     |                                        $\vec{a} \cdot \vec{b} = a_1 b_1 + a_2 b_2 + a_3 b_3$                                        | Scalar result                                                                 |
| 391 | Dot Product (Geometric)     |                               $\vec{a} \cdot \vec{b} = \vert\vec{a}\vert \vert\vec{b}\vert\cos\theta$                               | $\theta$ is angle between vectors                                             |
| 392 | Angle Between Vectors       |                          $\cos\theta = \frac{\vec{a} \cdot \vec{b}}{\vert\vec{a}\vert \vert\vec{b}\vert}$                           | Orthogonal iff $\vec{a} \cdot \vec{b} = 0$                                    |
| 393 | Cross Product Formula       | $\vec{a} \times \vec{b} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ a_1 & a_2 & a_3 \\ b_1 & b_2 & b_3 \end{vmatrix}$ | Vector perpendicular to both $\vec{a}$ and $\vec{b}$                          |
| 394 | Cross Product Magnitude     |                         $\vert\vec{a} \times \vec{b}\vert = \vert\vec{a}\vert \vert\vec{b}\vert\sin\theta$                          | Parallel iff $\vec{a} \times \vec{b} = \vec{0}$                               |
| 395 | Scalar Projection           |                      $\operatorname{comp}_{\vec{b}}\vec{a} = \frac{\vec{a} \cdot \vec{b}}{\vert\vec{b}\vert}$                       | Component of $\vec{a}$ along $\vec{b}$                                        |
| 396 | Vector Projection           |           $\operatorname{proj}_{\vec{b}}\vec{a} = \left(\frac{\vec{a} \cdot \vec{b}}{\vert\vec{b}\vert^2}\right)\vec{b}$            | Vector projected onto direction of $\vec{b}$                                  |
| 397 | Parallelogram Area          |                                               $A = \vert\vec{a} \times \vec{b}\vert$                                                | Area spanned by vectors $\vec{a}$ and $\vec{b}$                               |
| 398 | Triangle Area from Vectors  |                                          $A = \frac{1}{2}\vert\vec{a} \times \vec{b}\vert$                                          | Half of parallelogram area                                                    |
| 399 | Scalar Triple Product       |   $\vec{a} \cdot (\vec{b} \times \vec{c}) = \begin{vmatrix} a_1 & a_2 & a_3 \\ b_1 & b_2 & b_3 \\ c_1 & c_2 & c_3 \end{vmatrix}$    | Volume of parallelepiped $= \vert\vec{a} \cdot (\vec{b} \times \vec{c})\vert$ |

---

### 31. Matrices

| No. | Operation / Property                    |                                                        Formula                                                        | Conditions / Notes                                            |
| :-: | :-------------------------------------- | :-------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------ |
| 400 | Matrix Addition                         |                                           $(A + B)_{ij} = a_{ij} + b_{ij}$                                            | Matrices must share identical dimensions                      |
| 401 | Scalar Multiplication                   |                                                $(c A)_{ij} = c a_{ij}$                                                | Multiplies every entry by scalar $c$                          |
| 402 | Matrix Multiplication                   |                                       $(A B)_{ij} = \sum_{k=1}^n a_{ik} b_{kj}$                                       | $A$ is $m\times n$, $B$ is $n\times p$; generally $AB \ne BA$ |
| 403 | Matrix Transpose                        |                                                 $(A^T)_{ij} = a_{ji}$                                                 | Swaps rows and columns                                        |
| 404 | Transpose of Product                    |                                                  $(AB)^T = B^T A^T$                                                   | Reverses order of matrix product                              |
| 405 | Inverse of $2\times 2$ Matrix           | $\begin{pmatrix} a & b \\ c & d \end{pmatrix}^{-1} = \frac{1}{ad - bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$ | Invertible iff $\det A = ad - bc \ne 0$                       |
| 406 | General Matrix Inverse                  |                                    $A^{-1} = \frac{\operatorname{adj}(A)}{\det A}$                                    | Invertible iff $\det A \ne 0$                                 |
| 407 | Matrix Trace                            |                                     $\operatorname{tr}(A) = \sum_{i=1}^n a_{ii}$                                      | Sum of main diagonal elements                                 |
| 408 | Eigenvalue Equation                     |                               $A\vec{v} = \lambda\vec{v} \iff \det(A - \lambda I) = 0$                                | Characteristic equation determines eigenvalues $\lambda$      |
| 409 | Characteristic Polynomial ($2\times 2$) |                                $\lambda^2 - \operatorname{tr}(A)\lambda + \det(A) = 0$                                | Characteristic equation for $2\times 2$ matrices              |

---

### 32. Determinants

| No. | Concept / Property            |                                                  Formula                                                   | Conditions / Notes                                  |
| :-: | :---------------------------- | :--------------------------------------------------------------------------------------------------------: | :-------------------------------------------------- |
| 410 | $2\times 2$ Determinant       |                          $\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc$                          | Product of main diag minus anti-diag                |
| 411 | $3\times 3$ Determinant       | $\begin{vmatrix} a & b & c \\ d & e & f \\ g & h & i \end{vmatrix} = a(ei - fh) - b(di - fg) + c(dh - eg)$ | Cofactor expansion along first row                  |
| 412 | Multiplicative Property       |                                        $\det(AB) = \det(A)\det(B)$                                         | Determinant of matrix product                       |
| 413 | Transpose Property            |                                           $\det(A^T) = \det(A)$                                            | Transpose preserves determinant                     |
| 414 | Inverse Property              |                                     $\det(A^{-1}) = \frac{1}{\det(A)}$                                     | Reciprocal of determinant                           |
| 415 | Row Multiplication by Scalar  |                                           $\det(A') = k\det(A)$                                            | Multiplying a single row by $k$                     |
| 416 | Triangular Matrix Determinant |                                      $\det A = \prod_{i=1}^n a_{ii}$                                       | Product of diagonal entries for triangular matrices |

---

## Probability & Statistics

### 33. Probability

| No. | Rule / Theorem                     |                                  Formula                                  | Conditions / Notes                                 |
| :-: | :--------------------------------- | :-----------------------------------------------------------------------: | :------------------------------------------------- |
| 417 | Classical Probability              | $P(A) = \frac{\text{Favorable Outcomes}}{\text{Total Possible Outcomes}}$ | Equally likely outcome space                       |
| 418 | Complement Rule                    |                            $P(A^c) = 1 - P(A)$                            | Probability of event not occurring                 |
| 419 | Addition Rule (General)            |                 $P(A \cup B) = P(A) + P(B) - P(A \cap B)$                 | Union of any two events                            |
| 420 | Addition Rule (Mutually Exclusive) |                        $P(A \cup B) = P(A) + P(B)$                        | When $A \cap B = \emptyset$                        |
| 421 | Conditional Probability            |                  $P(A\mid B) = \frac{P(A \cap B)}{P(B)}$                  | Probability of $A$ given $B$ occurred ($P(B) > 0$) |
| 422 | Multiplication Rule                |              $P(A \cap B) = P(A\mid B)P(B) = P(B\mid A)P(A)$              | Joint probability calculation                      |
| 423 | Independent Events                 |              $P(A \cap B) = P(A)P(B) \iff P(A\mid B) = P(A)$              | Events exert no mutual influence                   |
| 424 | Bayes' Theorem                     |                $P(A\mid B) = \frac{P(B\mid A)P(A)}{P(B)}$                 | Posterior probability from likelihood and prior    |
| 425 | Law of Total Probability           |                   $P(B) = \sum_{i} P(B\mid A_i)P(A_i)$                    | For partition $\{A_1, A_2, \ldots, A_n\}$          |

---

### 34. Statistics

| No. | Statistical Measure             |                                                             Formula                                                             | Conditions / Notes                                |
| :-: | :------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------ |
| 426 | Arithmetic Mean (Sample)        |                                             $\bar{x} = \frac{1}{n}\sum_{i=1}^n x_i$                                             | Sum divided by sample size $n$                    |
| 427 | Weighted Mean                   |                                           $\bar{x}_w = \frac{\sum w_i x_i}{\sum w_i}$                                           | Accounts for varying observations weights $w_i$   |
| 428 | Range                           |                                              $\text{Range} = x_{\max} - x_{\min}$                                               | Difference between extreme values                 |
| 429 | Population Variance             |                                       $\sigma^2 = \frac{1}{N}\sum_{i=1}^N (x_i - \mu)^2$                                        | For entire population of size $N$                 |
| 430 | Population Standard Deviation   |                                     $\sigma = \sqrt{\frac{1}{N}\sum_{i=1}^N (x_i - \mu)^2}$                                     | Square root of population variance                |
| 431 | Sample Variance                 |                                      $s^2 = \frac{1}{n - 1}\sum_{i=1}^n (x_i - \bar{x})^2$                                      | Bessel's correction with $n-1$ degrees of freedom |
| 432 | Sample Standard Deviation       |                                   $s = \sqrt{\frac{1}{n - 1}\sum_{i=1}^n (x_i - \bar{x})^2}$                                    | Sample variability metric                         |
| 433 | Variance Computational Shortcut |                             $s^2 = \frac{1}{n - 1}\left[\sum x_i^2 - \frac{(\sum x_i)^2}{n}\right]$                             | Single-pass calculation formula                   |
| 434 | Coefficient of Variation        |                                             $CV = \frac{\sigma}{\mu} \times 100\%$                                              | Relative dispersion metric                        |
| 435 | Standard Score ($Z$-Score)      |                                                  $Z = \frac{x - \mu}{\sigma}$                                                   | Number of standard deviations from mean           |
| 436 | Sample Covariance               |                                  $s_{xy} = \frac{1}{n - 1}\sum (x_i - \bar{x})(y_i - \bar{y})$                                  | Joint variability of two variables                |
| 437 | Pearson Correlation ($r$)       | $r = \frac{s_{xy}}{s_x s_y} = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum (x_i - \bar{x})^2 \sum (y_i - \bar{y})^2}}$ | Linear association ($-1 \le r \le 1$)             |
| 438 | Regression Line Slope           |                         $m = \frac{n\sum xy - \sum x\sum y}{n\sum x^2 - (\sum x)^2} = r\frac{s_y}{s_x}$                         | Slope of least-squares line $y = mx + c$          |
| 439 | Regression Line Intercept       |                                                    $c = \bar{y} - m\bar{x}$                                                     | $y$-intercept of least-squares regression line    |

---

## Discrete Mathematics & Number Theory

### 35. Discrete Mathematics

| No. | Logical Law / Principle   |                     Equivalence / Formula                     | Conditions / Notes                           |
| :-: | :------------------------ | :-----------------------------------------------------------: | :------------------------------------------- |
| 440 | Conditional (Implication) |                $p \to q \equiv \neg p \lor q$                 | Fundamental implication identity             |
| 441 | Contrapositive Law        |              $p \to q \equiv \neg q \to \neg p$               | Logically identical to conditional           |
| 442 | Biconditional Law         |    $p \leftrightarrow q \equiv (p \to q) \land (q \to p)$     | Mutual implication equivalence               |
| 443 | De Morgan's Law (AND)     |          $\neg(p \land q) \equiv \neg p \lor \neg q$          | Negation of conjunction                      |
| 444 | De Morgan's Law (OR)      |          $\neg(p \lor q) \equiv \neg p \land \neg q$          | Negation of disjunction                      |
| 445 | Double Negation           |                    $\neg(\neg p) \equiv p$                    | Involution property                          |
| 446 | Idempotent Laws           |      $p \lor p \equiv p \text{ and } p \land p \equiv p$      | Self-combination yields same statement       |
| 447 | Identity Laws             |      $p \lor F \equiv p \text{ and } p \land T \equiv p$      | Neutral truth elements                       |
| 448 | Domination Laws           |      $p \lor T \equiv T \text{ and } p \land F \equiv F$      | Annihilating truth elements                  |
| 449 | Complement Laws           | $p \lor \neg p \equiv T \text{ and } p \land \neg p \equiv F$ | Law of excluded middle and non-contradiction |

---

### 36. Number Theory

| No. | Concept / Theorem              |                      Formula / Property                       | Conditions / Notes                               |
| :-: | :----------------------------- | :-----------------------------------------------------------: | :----------------------------------------------- |
| 450 | Divisibility Definition        |                    $a \mid b \iff b = ak$                     | For some integer $k$                             |
| 451 | Euclidean Algorithm            |               $\gcd(a, b) = \gcd(b, a \bmod b)$               | Iterated reduction until remainder is zero       |
| 452 | LCM-GCD Product Relation       |       $\operatorname{lcm}(a, b) \cdot \gcd(a, b) = a b$       | Positive integers $a, b$                         |
| 453 | Bézout's Identity              |                   $a x + b y = \gcd(a, b)$                    | Always solvable for integer coefficients $x, y$  |
| 454 | Congruence Addition            |   $a \equiv b \pmod m \implies a + c \equiv b + c \pmod m$    | Preserves arithmetic under addition              |
| 455 | Congruence Multiplication      |      $a \equiv b \pmod m \implies ac \equiv bc \pmod m$       | Preserves arithmetic under multiplication        |
| 456 | Modular Multiplicative Inverse |                    $a x \equiv 1 \pmod m$                     | Unique solution exists iff $\gcd(a, m) = 1$      |
| 457 | Fermat's Little Theorem        |                  $a^{p-1} \equiv 1 \pmod p$                   | Prime $p$ and $\gcd(a, p) = 1$                   |
| 458 | Euler's Totient Product        |   $\phi(n) = n\prod_{p \mid n}\left(1 - \frac{1}{p}\right)$   | Count of integers $1 \le k \le n$ coprime to $n$ |
| 459 | Euler's Theorem                |                $a^{\phi(n)} \equiv 1 \pmod n$                 | Generalization of FLT for $\gcd(a, n) = 1$       |
| 460 | Prime Factorization            |          $n = p_1^{a_1} p_2^{a_2} \cdots p_k^{a_k}$           | Unique prime factorization of $n$                |
| 461 | Number of Divisors $d(n)$      |          $d(n) = (a_1 + 1)(a_2 + 1)\cdots(a_k + 1)$           | Total positive factors                           |
| 462 | Sum of Divisors $\sigma(n)$    | $\sigma(n) = \prod_{i=1}^k \frac{p_i^{a_i + 1} - 1}{p_i - 1}$ | Total sum of all positive divisors               |

---

### 37. Graph Theory

| No. | Theorem / Property       |                          Formula                           | Conditions / Notes                              |
| :-: | :----------------------- | :--------------------------------------------------------: | :---------------------------------------------- |
| 463 | Handshaking Lemma        |          $\sum_{v \in V} \deg(v) = 2\vert E\vert$          | Every edge contributes to two endpoint degrees  |
| 464 | Odd Degree Vertex Count  | $\vert\{v : \deg(v) \text{ is odd}\}\vert \text{ is even}$ | Consequence of Handshaking Lemma                |
| 465 | Complete Graph Edges     |          $\vert E(K_n)\vert = \frac{n(n - 1)}{2}$          | Graph where every pair of vertices is connected |
| 466 | Complete Bipartite Edges |               $\vert E(K_{m, n})\vert = mn$                | Partitions of sizes $m$ and $n$                 |
| 467 | Tree Edge Count          |                   $\vert E\vert = n - 1$                   | Connected acyclic graph with $n$ vertices       |
| 468 | Forest Edge Count        |                   $\vert E\vert = n - c$                   | Acyclic graph with $c$ connected components     |
| 469 | Euler's Planar Formula   |                      $V - E + F = 2$                       | Connected planar graph with faces $F$           |
| 470 | Planar Edge Upper Bound  |                       $E \le 3V - 6$                       | For simple planar graphs with $V \ge 3$         |

---

### 38. Set/Counting/Combinatorial Identities

| No. | Identity Name            |                          Formula                          | Conditions / Notes                           |
| :-: | :----------------------- | :-------------------------------------------------------: | :------------------------------------------- |
| 471 | Binomial Sum Identity    |             $\sum_{k=0}^n \binom{n}{k} = 2^n$             | Total subsets of an $n$-element set          |
| 472 | Alternating Binomial Sum |          $\sum_{k=0}^n (-1)^k \binom{n}{k} = 0$           | Valid for $n > 0$                            |
| 473 | Weighted Binomial Sum    |         $\sum_{k=0}^n k \binom{n}{k} = n 2^{n-1}$         | Evaluated via derivative of $(1 + x)^n$      |
| 474 | Vandermonde's Identity   | $\sum_k \binom{r}{k} \binom{s}{n - k} = \binom{r + s}{n}$ | Convolution of binomial coefficients         |
| 475 | Hockey-Stick Identity    |    $\sum_{k=r}^n \binom{k}{r} = \binom{n + 1}{r + 1}$     | Sum of diagonal entries in Pascal's triangle |
| 476 | Catalan Number Formula   |           $C_n = \frac{1}{n + 1}\binom{2n}{n}$            | Sequence: 1, 1, 2, 5, 14, 42, 132...         |
| 477 | Catalan Recurrence       |          $C_{n+1} = \frac{2(2n + 1)}{n + 2}C_n$           | Multiplicative growth recurrence             |

---

## Business Related (Financial Mathematics)

### 39. Financial Mathematics

| No. | Financial Metric         |                      Formula                      | Conditions / Notes                            |
| :-: | :----------------------- | :-----------------------------------------------: | :-------------------------------------------- |
| 478 | Simple Interest          |             $SI = \frac{P R T}{100}$              | Principal $P$, rate $R\%$, time $T$ years     |
| 479 | Simple Total Amount      |  $A = P + SI = P\left(1 + \frac{RT}{100}\right)$  | Total accumulated balance                     |
| 480 | Compound Interest Amount |     $A = P\left(1 + \frac{r}{n}\right)^{nt}$      | Compounded $n$ times/year at decimal rate $r$ |
| 481 | Continuous Compounding   |                  $A = P e^{rt}$                   | Limit as compounding frequency $n \to \infty$ |
| 482 | Exponential Depreciation |                $V(t) = P(1 - r)^t$                | Value with annual depreciation rate $r$       |
| 483 | Present Value            |            $PV = \frac{FV}{(1 + r)^n}$            | Discounted current worth of future cash flow  |
| 484 | Future Value             |                $FV = PV(1 + r)^n$                 | Compounded future worth of present balance    |
| 485 | Annuity Future Value     |     $FV = PMT \cdot \frac{(1 + r)^n - 1}{r}$      | Ordinary annuity with periodic deposit $PMT$  |
| 486 | Annuity Present Value    |    $PV = PMT \cdot \frac{1 - (1 + r)^{-n}}{r}$    | Capitalized value of future income stream     |
| 487 | Loan Periodic Payment    | $PMT = PV \cdot \frac{r(1 + r)^n}{(1 + r)^n - 1}$ | Amortization periodic payment formula         |

---

## Applied Mathematics & Numerical Methods

### 40. Numerical Methods

| No. | Method                     |                                                   Iteration / Quadrature Formula                                                   | Conditions / Notes                       |
| :-: | :------------------------- | :--------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------- |
| 488 | Bisection Method Midpoint  |                                                       $c = \frac{a + b}{2}$                                                        | Requires $f(a)f(b) < 0$                  |
| 489 | Newton-Raphson Iteration   |                                              $x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$                                              | Quadratic convergence near simple roots  |
| 490 | Secant Method Iteration    |                                 $x_{n+1} = x_n - f(x_n)\frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})}$                                  | Derivative-free approximation            |
| 491 | Single Trapezoidal Rule    |                                      $\int_a^b f(x)\,dx \approx \frac{b - a}{2}[f(a) + f(b)]$                                      | Linear approximation of area             |
| 492 | Composite Trapezoidal Rule |                   $\int_a^b f(x)\,dx \approx \frac{h}{2}\left[f(x_0) + f(x_n) + 2\sum_{i=1}^{n-1} f(x_i)\right]$                   | $h = \frac{b - a}{n}$                    |
| 493 | Simpson's $1/3$ Rule       | $\int_a^b f(x)\,dx \approx \frac{h}{3}\left[f(x_0) + 4\sum_{i \text{ odd}} f(x_i) + 2\sum_{j \text{ even}} f(x_j) + f(x_n)\right]$ | Parabolic quadrature (requires even $n$) |

---

### 41. Common Mathematical Constants

| No. | Constant                  |               Symbol               | Approximate Value           | Significance                                                |
| :-: | :------------------------ | :--------------------------------: | :-------------------------- | :---------------------------------------------------------- |
| 494 | Pi                        |               $\pi$                | $\approx 3.141592653589793$ | Ratio of circumference to diameter of circle                |
| 495 | Euler's Number            |                $e$                 | $\approx 2.718281828459045$ | Base of natural logarithm                                   |
| 496 | Pythagoras' Constant      |             $\sqrt{2}$             | $\approx 1.414213562373095$ | Diagonal of unit square / irrational root                   |
| 497 | Theodorus' Constant       |             $\sqrt{3}$             | $\approx 1.732050807568877$ | Diagonal of unit cube                                       |
| 498 | Golden Ratio              | $\varphi = \frac{1 + \sqrt{5}}{2}$ | $\approx 1.618033988749895$ | Positive root of $x^2 - x - 1 = 0$                          |
| 499 | Euler-Mascheroni Constant |              $\gamma$              | $\approx 0.577215664901532$ | Limiting difference between harmonic series and natural log |
| 500 | Imaginary Unit            |                $i$                 | $\sqrt{-1}$                 | Fundamental unit of complex numbers ($i^2 = -1$)            |

---

### 42. Useful Unit Conversions

| No. | Dimension |                     Conversion Identity                      | Scale Factor                        |
| :-: | :-------- | :----------------------------------------------------------: | :---------------------------------- |
| 501 | Length    |                $1\text{ km} = 1000\text{ m}$                 | Metric length                       |
| 502 | Length    |        $1\text{ m} = 100\text{ cm} = 1000\text{ mm}$         | Metric length                       |
| 503 | Length    |                $1\text{ in} = 2.54\text{ cm}$                | Imperial to metric exact definition |
| 504 | Length    |        $1\text{ ft} = 12\text{ in} = 0.3048\text{ m}$        | Imperial foot                       |
| 505 | Length    |        $1\text{ yd} = 3\text{ ft} = 0.9144\text{ m}$         | Imperial yard                       |
| 506 | Length    |   $1\text{ mi} = 5280\text{ ft} \approx 1.60934\text{ km}$   | Statute mile                        |
| 507 | Area      |     $1\text{ m}^2 = 10^4\text{ cm}^2 = 10^6\text{ mm}^2$     | Metric area                         |
| 508 | Area      |      $1\text{ km}^2 = 10^6\text{ m}^2 = 100\text{ ha}$       | 1 hectare = $10^4\text{ m}^2$       |
| 509 | Volume    |      $1\text{ m}^3 = 10^6\text{ cm}^3 = 1000\text{ L}$       | 1 cubic meter                       |
| 510 | Volume    |       $1\text{ L} = 1000\text{ mL} = 1000\text{ cm}^3$       | Metric liquid volume                |
| 511 | Angle     |                 $180^\circ = \pi\text{ rad}$                 | Straight angle equivalence          |
| 512 | Angle     | $1\text{ rad} = \frac{180^\circ}{\pi} \approx 57.2958^\circ$ | Radian to degree conversion         |

---

### 43. Quick Reference Tables

#### Common Derivatives Reference

| No. | Function $f(x)$ |     Derivative $f'(x)$      | Domain / Notes                  |
| :-: | :-------------- | :-------------------------: | :------------------------------ |
| 513 | $c$             |             $0$             | Constant function               |
| 514 | $x^n$           |         $n x^{n-1}$         | Power rule ($n \in \mathbb{R}$) |
| 515 | $e^x$           |            $e^x$            | Natural exponential             |
| 516 | $a^x$           |         $a^x \ln a$         | $a > 0, a \ne 1$                |
| 517 | $\ln x$         |        $\frac{1}{x}$        | $x > 0$                         |
| 518 | $\sin x$        |          $\cos x$           | $x \in \mathbb{R}$              |
| 519 | $\cos x$        |          $-\sin x$          | $x \in \mathbb{R}$              |
| 520 | $\tan x$        |         $\sec^2 x$          | $x \ne \frac{\pi}{2} + k\pi$    |
| 521 | $\cot x$        |         $-\csc^2 x$         | $x \ne k\pi$                    |
| 522 | $\sec x$        |       $\sec x\tan x$        | $x \ne \frac{\pi}{2} + k\pi$    |
| 523 | $\csc x$        |       $-\csc x\cot x$       | $x \ne k\pi$                    |
| 524 | $\arcsin x$     | $\frac{1}{\sqrt{1 - x^2}}$  | $\vert x\vert < 1$              |
| 525 | $\arccos x$     | $-\frac{1}{\sqrt{1 - x^2}}$ | $\vert x\vert < 1$              |
| 526 | $\arctan x$     |     $\frac{1}{1 + x^2}$     | $x \in \mathbb{R}$              |
| 527 | $\sinh x$       |          $\cosh x$          | $x \in \mathbb{R}$              |
| 528 | $\cosh x$       |          $\sinh x$          | $x \in \mathbb{R}$              |
| 529 | $\tanh x$       |  $\operatorname{sech}^2 x$  | $x \in \mathbb{R}$              |

#### Common Integrals Reference

| No. | Function $f(x)$            | Indefinite Integral $\int f(x)\,dx$ | Domain / Notes               |
| :-: | :------------------------- | :---------------------------------: | :--------------------------- |
| 530 | $c$                        |              $cx + C$               | Constant                     |
| 531 | $x^n$                      |      $\frac{x^{n+1}}{n+1} + C$      | $n \ne -1$                   |
| 532 | $\frac{1}{x}$              |        $\ln\vert x\vert + C$        | $x \ne 0$                    |
| 533 | $e^x$                      |              $e^x + C$              | Natural exponential          |
| 534 | $a^x$                      |       $\frac{a^x}{\ln a} + C$       | $a > 0, a \ne 1$             |
| 535 | $\sin x$                   |            $-\cos x + C$            | Trig antiderivative          |
| 536 | $\cos x$                   |            $\sin x + C$             | Trig antiderivative          |
| 537 | $\sec^2 x$                 |            $\tan x + C$             | $x \ne \frac{\pi}{2} + k\pi$ |
| 538 | $\csc^2 x$                 |            $-\cot x + C$            | $x \ne k\pi$                 |
| 539 | $\sec x\tan x$             |            $\sec x + C$             | $x \ne \frac{\pi}{2} + k\pi$ |
| 540 | $\csc x\cot x$             |            $-\csc x + C$            | $x \ne k\pi$                 |
| 541 | $\frac{1}{1 + x^2}$        |           $\arctan x + C$           | $x \in \mathbb{R}$           |
| 542 | $\frac{1}{\sqrt{1 - x^2}}$ |           $\arcsin x + C$           | $\vert x\vert < 1$           |

#### Common Trigonometric Values

| $\theta$     | $0^\circ$ ($0$) | $30^\circ$ ($\pi/6$) | $45^\circ$ ($\pi/4$) | $60^\circ$ ($\pi/3$) | $90^\circ$ ($\pi/2$) |
| :----------- | :-------------: | :------------------: | :------------------: | :------------------: | :------------------: |
| $\sin\theta$ |       $0$       |    $\frac{1}{2}$     | $\frac{\sqrt{2}}{2}$ | $\frac{\sqrt{3}}{2}$ |         $1$          |
| $\cos\theta$ |       $1$       | $\frac{\sqrt{3}}{2}$ | $\frac{\sqrt{2}}{2}$ |    $\frac{1}{2}$     |         $0$          |
| $\tan\theta$ |       $0$       | $\frac{1}{\sqrt{3}}$ |         $1$          |      $\sqrt{3}$      |      undefined       |

---

## Reference & Appendices

### Formula Selection Guide

| Problem Type                                        | Target Section / Formulas                  | Key Method / Identity                                  |
| :-------------------------------------------------- | :----------------------------------------- | :----------------------------------------------------- |
| Expand or factor algebraic expressions              | Algebraic Identities (Sec. 4)              | Binomial, difference of squares, cubes                 |
| Find roots of polynomial equations                  | Equations and Inequalities (Sec. 5 & 6)    | Quadratic formula, Vieta's relations, factoring        |
| Solve exponential / logarithmic equations           | Logarithms (Sec. 7)                        | Change of base, product and power rules                |
| Summing series with constant difference             | Sequences and Series (Sec. 8)              | Arithmetic Progression ($S_n$)                         |
| Summing geometric series / decay processes          | Sequences and Series (Sec. 8)              | Geometric Progression ($S_n, S_\infty$)                |
| Combinations & permutations of objects              | Counting & Combinatorics (Sec. 10)         | ${}^n P_r, ${}^n C_r, stars and bars                   |
| Finding angles, lengths, or sides in triangles      | Trigonometry & Triangles (Sec. 18 & 21)    | SOHCAHTOA, Law of Sines, Law of Cosines                |
| Distance, slope, or line equations in 2D            | Coordinate Geometry & Lines (Sec. 13 & 14) | Distance formula, slope-intercept, point-to-line       |
| Circles, arcs, and sector areas                     | Circles (Sec. 15)                          | Standard circle form, arc length $s = r\theta$         |
| Conic curves (parabolas, ellipses, hyperbolas)      | Conic Sections (Sec. 16)                   | Standard forms, focal distance $c^2$, eccentricity $e$ |
| 3D volumes, surface areas, and slant heights        | 3D Mensuration (Sec. 20)                   | Cylinder, cone, sphere, prism formulas                 |
| Rates of change, tangents, optimization             | Differentiation (Sec. 25 & 26)             | Product/chain rules, critical points $f'(x)=0$         |
| Accumulation, curve areas, solid volumes            | Integration (Sec. 27 & 28)                 | Fundamental theorem, substitution, disk/shell          |
| Dynamic rate processes, growth, half-life           | Differential Equations (Sec. 29)           | Separation of variables, integrating factor            |
| Spatial vectors, angles, planes, projections        | Vectors (Sec. 30)                          | Dot product (angles), cross product (normal/area)      |
| Linear systems, transformations, determinants       | Matrices & Determinants (Sec. 31 & 32)     | Matrix multiplication, $A^{-1}$, $\det A$              |
| Chance events, conditional odds, Bayesian inference | Probability (Sec. 33)                      | Addition/product rules, Bayes' theorem                 |
| Dataset spread, variance, linear regression         | Statistics (Sec. 34)                       | Mean, sample variance $s^2$, correlation $r$           |
| Logic propositions, set intersections               | Discrete Mathematics (Sec. 35)             | De Morgan's laws, inclusion-exclusion                  |
| Divisibility, modular equations, primes             | Number Theory (Sec. 36)                    | Euclidean algorithm, modular inverse, totient          |
| Networks, trees, graph connectivity                 | Graph Theory (Sec. 37)                     | Handshaking lemma, Euler formula $V - E + F = 2$       |
| Interest, depreciation, loan payments               | Financial Mathematics (Sec. 39)            | Compound interest, amortization payment $PMT$          |
| Numerical root finding and numerical integration    | Numerical Methods (Sec. 40)                | Newton-Raphson, composite trapezoidal rule             |

---

### Important Notation

|   Symbol    | Mathematical Meaning                            | Standard Context                          |
| :---------: | :---------------------------------------------- | :---------------------------------------- |
|    $\pi$    | Circle ratio constant ($3.14159\dots$)          | Geometry, trigonometry, calculus          |
|     $e$     | Euler's natural logarithm base ($2.71828\dots$) | Growth models, calculus, complex analysis |
|     $i$     | Imaginary unit ($i^2 = -1$)                     | Complex numbers, algebra                  |
|   $\sum$    | Summation operator                              | Series, statistics, discrete math         |
|   $\prod$   | Product operator                                | Factorials, number theory, linear algebra |
|   $\int$    | Integral operator                               | Calculus, continuous distributions        |
| $\partial$  | Partial derivative                              | Multivariable calculus, PDEs              |
|  $\nabla$   | Del / gradient vector differential operator     | Vector calculus                           |
|  $\Delta$   | Difference / change; discriminant               | Algebra, calculus                         |
|  $\infty$   | Infinity                                        | Limits, unbounded domains                 |
|  $\forall$  | Universal quantifier ("for all")                | Logic, proofs, set theory                 |
|  $\exists$  | Existential quantifier ("there exists")         | Logic, proofs                             |
|    $\in$    | Element of                                      | Set membership                            |
| $\subseteq$ | Subset of                                       | Set theory                                |
|  $\approx$  | Approximately equal to                          | Numerical methods, approximations         |
|  $\equiv$   | Identically equal / congruent modulo $m$        | Algebra, number theory, logic             |
|  $\propto$  | Proportional to                                 | Ratios, variation                         |
|   $\perp$   | Perpendicular to                                | Geometry, orthogonal vectors              |
| $\parallel$ | Parallel to                                     | Geometry, lines                           |

---

### Final Notes

- **Angle Units:** Trigonometric calculus formulas (derivatives and integrals) strictly assume angles are measured in **radians**.
- **Logarithmic Notation:** $\log x$ without an explicit base may refer to base $10$ in applied contexts or the natural logarithm $\ln x$ (base $e$) in advanced mathematics; $\ln x$ unambiguously denotes base $e$.
- **Principal Values:** For square roots over real numbers, $\sqrt{x}$ denotes the non-negative principal root.
- **Domain Restrictions:** Always verify domain validity (e.g. non-zero denominators, strictly positive logarithmic arguments, non-negative radical radicands) before applying identities.

---

### Recent Articles

Explore more programming and computer science guides:

- [**Python Fundamentals**](/posts/part_01_python_fundamentals/) — Foundations of Python covering architecture, CPython execution model, syntax rules, variables, memory mechanics, data types, and operators.
- [**Part 3: Encapsulation — Protecting Your Data**](/posts/elcapsulation/) — Object-oriented principles in Java, data hiding, access modifiers, and writing robust encapsulated code.
- [**Part 2: Classes and Objects — Building Your First Java Class**](/posts/class-object/) — Introduction to object-oriented programming, class design, objects, constructors, and instance state.

---

**Last updated:** 2026-09-25

---
title: "Dynamic Memory Allocation"
author: "Shafin Chowdhury"
pubDatetime: 2026-06-01T09:19:00Z
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


> *Part of learning C with Shafin*
> 

As C is a structured language, it has some fixed rules for programming. One of them includes changing the size of an array. We have to declare an array with its size. But what if we have to store an unknown amount of data? Or if the size of an array is 5 but we only need size 3 to store data, then the 2 more spaces are wasted only. 

Here is where we need dynamic memory allocation, which is essential for efficient memory management in C. There are 4 library functions in C defined under **<stdlib.h>** header file to use dynamic memory allocation in C programming. They are:

1. **malloc()**
2. **calloc()**
3. **free()**
4. **realloc**()

# **malloc():**

Malloc is the shorthand for “Memory Allocation.” M**alloc ( )** usually allocates a single large block of **contiguous** memory and always returns a void pointer. **Why void pointer? Because malloc allocates memory without knowing the return data type, it only returns a void data type or returns null if it somehow fails to allocate memory**. It’s our duty to cast the data type. 

**Syntax:**
`ptr = (cast-type*) malloc(byte-size)`

***int *ptr = ( int* ) malloc (100 * sizeof ( int ) );***

*Here ptr is a pointer that is pointing to the allocated memory.*

```jsx
#include<stdio.h>
#include<stdlib.h>

int main()
{
    int i = 0, n;
    printf("Enter the number of integers.\n");
    scanf("%d",&n);
    int *ptr = (int*) malloc (n*sizeof(int));

    for(i; i < n; i++){
        scanf("%d",(ptr+i)); // here we use ptr + i. 
												        Because ptr is the first location in the memory. 
												        suppose ptr is 100 then the ptr+i = 0, 
												        then i becomes 1 and ptr+i becomes 101.
    }
    for(i = 0; i < n; i++){
        printf("%d ",*(ptr+i));
    }
return 0;
}
```

# **calloc():**

Calloc or “Clear allocation” is similar to malloc( ) But it has two differences:

1. It initializes each block with a default value ‘0’ where malloc is initialized by any garbage value. 
2. It has two parameters or arguments as compared to malloc(). One is the amounts of blocks and the other one is the size of the blocks.

**Syntax:** 

`ptr = (cast-type*)calloc(n, element-size);`

***int *ptr = ( float* ) calloc( 25, sizeof( float ) );***

*This statement allocates contiguous space in memory for 25 elements each with the size of the float.*

```c
#include <stdio.h>
#include <stdlib.h>

int main()

{
		int* ptr;
    int n, i;
    n = 5;
    printf("Enter number of elements: %d\n", n);
    ptr = (int*)calloc(n, sizeof(int))
    // Check if the memory has been successfully
    // allocated by calloc or not
    if (ptr == NULL) {
        printf("Memory not allocated.\n");
        exit(0)
    }

    else {
        // Memory has been successfully allocated
        printf("Memory successfully allocated using calloc.\n");
        // Get the elements of the array
        for (i = 0; i < n; ++i) {
            ptr[i] = i + 1;
        }
        printf("The elements of the array are: ");
        for (i = 0; i < n; ++i) {
            printf("%d, ", ptr[i]);
        }
    }
    return 0;

}
```

# ***realloc():***

Realloc or re-allocation is used to change the size of an data block without loosing the old data. But the memory has to be previously allocated with the help of malloc or calloc. 

**Syntax:**
`ptr = realloc(ptr, newSize);`

# *Free ( ):*

The **“free”** method in C is used to **de-allocate** the memory. The memory allocated using functions malloc() and calloc() is not de-allocated automatically. Hence the free() method is used, whenever the dynamic memory allocation takes place. It helps to reduce the wastage of memory by freeing it.
**Syntax:**
`free(ptr);`

```c
#include <stdio.h>
#include <stdlib.h>

int main()
{
    int *ptr, *ptr1;
    int n, i;

    // Get the number of elements for the array
    n = 5;
    printf("Enter number of elements: %d\n", n);

    // Dynamically allocate memory using malloc()
    ptr = (int*)malloc(n * sizeof(int));

    // Dynamically allocate memory using calloc()
    ptr1 = (int*)calloc(n, sizeof(int));

    // Check if the memory has been successfully
    // allocated by malloc or not
    if (ptr == NULL || ptr1 == NULL) {
        printf("Memory not allocated.\n");
        exit(0);
    }
    else {

        // Memory has been successfully allocated
        printf("Memory successfully allocated using malloc.\n");

        // Free the memory
        free(ptr);
        printf("Malloc Memory successfully freed.\n");

        // Memory has been successfully allocated
        printf("\nMemory successfully allocated using calloc.\n");

        // Free the memory
        free(ptr1);
        printf("Calloc Memory successfully freed.\n");
    }

    return 0;
}
```
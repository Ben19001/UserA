#include <stdio.h>
#include <stdlib.h>

int main()
{
    long myarray[3][3] = {{25, 21, 23}, {36, 34, 95}, {68, 47, 86}};
    printf("1 : %p\n", myarray);
    printf("2 : %p\n", *(myarray));
    printf("3 : %p\n", *(myarray + 2));
    printf("4 : %p\n", *(myarray - 1));
    printf("5 : %p\n", *(myarray + 6));
}

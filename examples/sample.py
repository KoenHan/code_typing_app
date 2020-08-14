def Fibonacci(n):
    if n <= 2:
        return 1
    return Fibonacci(n-1) + Fibonacci(n-2)

if __name__ == "__main__" :
    print([Fibonacci(i) for i in range(1, 10)])

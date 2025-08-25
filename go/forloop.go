package main

import "fmt"

// only for loop no while loop in the go

func main() {
	for i := 0; i < 5; i++ {
		fmt.Println("Iteration:", i)
	}

	// while loop for style
	println("While loop style")
	i := 0
	for i < 5 {
		fmt.Println("Iteration:", i)
		i++
	}

	// range
	println("Range style")
	for i := range 3 {
		fmt.Println("Iteration:", i)
	}
}
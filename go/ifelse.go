package main

import "fmt"

func main() {
	age := 20
	if age < 18 {
		fmt.Println("Minor")
	} else {
		fmt.Println("Adult")
	}

	var role string = "admin"
	var hasAccess bool = true

	if role == "admin" && hasAccess {
		fmt.Println("Access granted")
	} else {
		fmt.Println("Access denied")
	}
}
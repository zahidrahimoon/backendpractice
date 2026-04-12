let profile = {
    name: "Zahid",
    age: 25,
    email: "zahidrahimoon22@gmail.com",
    getFullDetails: ()=>{
        console.log(`My Name is ${this.name} and I am ${this.age} years old and my gmail account is ${this.email}`)
    }
}

let userProfile = Object.create(profile)

console.log("This is my profile", profile)
userProfile.name = 'Rahimoon'
console.log("name changed", userProfile.name)

// even this string's proto is an object that points to the string and inside that strings we have different methods
let name = "zahid";
console.log(name.__proto__)
console.log(name.at(2))


// object inheritance

let p1 = {
    name: "Zahid",
}

let p2 = {
    age: 25,
    __proto__ : p1
}

console.log(`the p2 name is ${p2.name} which is inherited from p1`)
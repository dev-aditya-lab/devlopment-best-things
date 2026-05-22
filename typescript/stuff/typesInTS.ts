let name: string = "John Doe";
let age: number = 30;
let isStudent: boolean = false;
let hobbies: string[] = ["Reading", "Traveling", "Cooking"];
let tuple: [string, number] = ["Alice", 25];
let union: string | number = "Hello";
let anyType: any = 42;
let unknownType: unknown = "This can be anything";
let voidFunction: () => void = () => {
	console.log("This function does not return anything.");
};
let neverFunction: () => never = () => {
	throw new Error("This function never returns.");
};
let address: { street: string; city: string; country: string } = {
	street: "123 Main St",
	city: "Anytown",
	country: "USA",
};
function greet(person: string): string {
	return `Hello, ${person}!`;
}
let greetMessage: string = greet(name);
console.log(greetMessage);

function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("Hello, Generics!");
let output2 = identity<number>(42);
console.log(output1); // Output: Hello, Generics!
console.log(output2); // Output: 42

function loggingIdentity<T>(arg: T[]): T[] {
  console.log(arg.length);
    return arg;
}

let output3 = loggingIdentity<string>(["Hello", "Generics", "in", "TypeScript"]);
console.log(output3); // Output: ["Hello", "Generics", "in", "TypeScript"]

// real use case of generics
function mergeObjects<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const person = { name: "Alice", age: 30 };
const address = { city: "New York", country: "USA" };
const merged = mergeObjects(person, address);
console.log(merged); // Output: { name: "Alice", age: 30, city: "New York", country: "USA" }

// generic interface
interface KeyValuePair<K, V> {
  key: K;
  value: V;
}
const pair: KeyValuePair<string, number> = { key: "age", value: 30 };
console.log(pair); // Output: { key: "age", value: 30 }
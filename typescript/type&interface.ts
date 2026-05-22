type User = {
  id: number;
  name: string;
};

interface Product {
  id: number;
  name: string;
  price: number;
}

function getUserInfo(user: User): string {
  return `User ID: ${user.id}, Name: ${user.name}`;
}
function getProductInfo(product: Product): string {
  return `Product ID: ${product.id}, Name: ${product.name}, Price: $${product.price}`;
}
const user: User = { id: 1, name: "Alice" };
const product: Product = { id: 101, name: "Laptop", price: 999.99 };

console.log(getUserInfo(user));
console.log(getProductInfo(product));
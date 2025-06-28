export const func = (name: any) => {
  if (!name) {
    throw new Error("Name is required");
  }
  console.log(`Hello, ${name}!`);
  return `Hello, ${name}!`;
};

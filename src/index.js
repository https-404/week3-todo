
console.log("Welcome to Todo CLI! Type something and press enter:");

process.stdin.on("data", (data) => {
  const input = data.toString().trim();
  if (input === "exit") {
    console.log("Goodbye!");
    process.exit(0);
  }
  console.log("You typed:", input);
});

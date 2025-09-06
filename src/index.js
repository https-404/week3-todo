import readline from "readline"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const todo = []
const users = []
let currentUser = null

const userMenu = () => {
    console.log("\nAdd a User")
    console.log("Select a User")
    console.log("Delete a User")
    console.log("Exit")
    rl.question("Choose an option: ", (choice) => {
        handleUserInput(parseInt(choice));
    });
};

const handleUserInput = (choice) => {
    if (choice === 1) {
        rl.question("\nEnter user name:", (user) => {
            users.push(user)
            todo[user] = [];
            console.log("User added", user)
            userMenu()
        })
    }
    if (choice === 2) {
        if (users.length === 0) {
            console.log("\nNo user added")
            userMenu()
        }
        else {
            console.log("\nSelect a User: ")
            users.forEach((user, index) => {
                console.log(`${index + 1}.${user}`)
            })
            rl.question("\nSelect a User number", (num) => {
                const index = parseInt(num) - 1;
                if (index >= 0 && index < users.length) {
                    currentUser = users[index]
                    console.log(`\nUser Selected: ${currentUser}`);
                    taskMenu();
                } else {
                    console.log("\nInvalid selection.");
                    userMenu();
                }
            })
        }
    }
    if (choice === 3){
      if (users.length === 0) {
            console.log("\nNo user to delete")
            userMenu()
        }
        else {
            console.log("\nSelect a User to delete: ")
            users.forEach((user, index) => {
                console.log(`${index + 1}.${user}`)
            })
            rl.question("\nSelect a User number", (num) => {
                const index = parseInt(num) - 1;
                if (index >= 0 && index < users.length) {
                    const deletedUser = users.splice(index, 1);
                    delete todo[deletedUser];
                    console.log(`User "${deletedUser}" deleted.`);
                    userMenu()
                } else {
                    console.log("\nInvalid selection.");
                    userMenu();
                }
            })
        }
    }
    if (choice === 4) {
        console.log("Good Bye")
        rl.close()
    }
}

const taskMenu = () => {
    console.log("\nAdd a Task")
    console.log("Display Task")
    console.log("Delete a Task")
    console.log("Go Back")
    rl.question("Choose an option: ", (option) => {
        handleInput(parseInt(option));
    });
}

const handleInput = (option) => {
    if (option === 1) {
        rl.question("\nEnter the task:", (task) => {
            todo[currentUser].push(task)
            console.log("Task added", task)
            taskMenu()
        })
    }
    if (option === 2) {
        console.log(`\nTodo List for ${currentUser}:`);
        if (todo[currentUser].length === 0) {
            console.log("No tasks added.");
            taskMenu()
        } else {
            todo[currentUser].forEach((task, index) => {
                console.log(`${index + 1}. ${task}`);
            });
            taskMenu()
        }
    }
    if (option === 3) {
        if (todo[currentUser].length === 0) {
            console.log("No task to delete.");
            taskMenu();
        } else {
           console.log("\nSelect a Task to Delete:");
            todo[currentUser].forEach((task, index) => {
                console.log(`${index + 1}. ${task}`);
            });
            rl.question("\nSelect a Task number", (num) => {
                const index = parseInt(num) - 1;
                if (index >= 0 && index < todo[currentUser].length) {
                    const deletedtask = todo[currentUser].splice(index, 1);
                    delete todo[deletedtask];
                    console.log(`Task ${deletedtask} deleted.`);
                    taskMenu()
                } else {
                    console.log("\nInvalid selection.");
                    taskMenu();
                }
            })
        }
    }
    if (option === 4) {
        console.log("\nGoing back to User Menu")
        userMenu()
    }
}

userMenu();

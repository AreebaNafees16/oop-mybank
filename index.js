#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
// Customer class
class Customer {
    firstName;
    lastName;
    gender;
    age;
    mobileNumber;
    constructor(firstName, lastName, gender, age, mobileNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.age = age;
        this.mobileNumber = mobileNumber;
    }
}
// BankAccount class implementing IBankAccount interface
class BankAccount {
    accountNumber;
    customer;
    balance;
    constructor(accountNumber, customer, initialBalance) {
        this.accountNumber = accountNumber;
        this.customer = customer;
        this.balance = initialBalance;
    }
    deposit(amount) {
        if (amount > 100) {
            this.balance += amount - 1; // Deduct $1 if more than $100 is credited
            console.log(chalk.green(`Deposited $${amount} (Fee $1 deduct). New balance: $${this.balance}.`));
        }
        else {
            this.balance += amount;
            console.log(chalk.green(`Deposited $${amount}. New balance: $${this.balance}.`));
        }
    }
    withdraw(amount) {
        if (amount > this.balance) {
            console.log(chalk.red('Insufficient funds. Transaction cancelled.'));
        }
        else {
            this.balance -= amount;
            console.log(chalk.green(`Withdrew $${amount}. New balance: $${this.balance}.`));
        }
    }
    checkBalance() {
        console.log(chalk.blue(`Account balance: $${this.balance}.`));
        return this.balance;
    }
}
// Bank class
class Bank {
    accounts;
    constructor() {
        this.accounts = [];
    }
    createAccount(customer, initialBalance) {
        const accountNumber = "BA" + (this.accounts.length + 1).toString().padStart(4, "0");
        const newAccount = new BankAccount(accountNumber, customer, initialBalance);
        this.accounts.push(newAccount);
        console.log(chalk.green(`Created account ${accountNumber} for ${customer.firstName} ${customer.lastName} with initial balance $${initialBalance}.`));
        return newAccount;
    }
    getAccount(accountNumber) {
        return this.accounts.find(account => account.accountNumber === accountNumber);
    }
}
// Function to ask user for input
async function getUserInput(bank) {
    const actions = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["Create Account", "Deposit", "Withdraw", "Check Balance", "Exit"],
        }
    ]);
    switch (actions.action) {
        case "Create Account":
            const accountInfo = await inquirer.prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "First name:",
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "Last name:",
                },
                {
                    type: "input",
                    name: "gender",
                    message: "Gender:",
                },
                {
                    type: "number",
                    name: "age",
                    message: "Age:",
                },
                {
                    type: "input",
                    name: "mobileNumber",
                    message: "Mobile number:",
                },
                {
                    type: "number",
                    name: "initialBalance",
                    message: "Initial balance:",
                }
            ]);
            const customer = new Customer(accountInfo.firstName, accountInfo.lastName, accountInfo.gender, accountInfo.age, accountInfo.mobileNumber);
            bank.createAccount(customer, accountInfo.initialBalance);
            break;
        case "Deposit":
            const depositInfo = await inquirer.prompt([
                {
                    type: "input",
                    name: "accountNumber",
                    message: "Account number:",
                },
                {
                    type: "number",
                    name: "amount",
                    message: "Amount to deposit:",
                }
            ]);
            const accountToDeposit = bank.getAccount(depositInfo.accountNumber);
            if (accountToDeposit) {
                accountToDeposit.deposit(depositInfo.amount);
            }
            else {
                console.log(chalk.red("Account not found."));
            }
            break;
        case "Withdraw":
            const withdrawInfo = await inquirer.prompt([
                {
                    type: "input",
                    name: "accountNumber",
                    message: "Account number:",
                },
                {
                    type: "number",
                    name: "amount",
                    message: "Amount to withdraw:",
                }
            ]);
            const accountToWithdraw = bank.getAccount(withdrawInfo.accountNumber);
            if (accountToWithdraw) {
                accountToWithdraw.withdraw(withdrawInfo.amount);
            }
            else {
                console.log(chalk.red("Account not found."));
            }
            break;
        case "Check Balance":
            const balanceInfo = await inquirer.prompt([
                {
                    type: "input",
                    name: "accountNumber",
                    message: "Account number:",
                }
            ]);
            const accountToCheck = bank.getAccount(balanceInfo.accountNumber);
            if (accountToCheck) {
                accountToCheck.checkBalance();
            }
            else {
                console.log(chalk.red("Account not found."));
            }
            break;
        case "Exit":
            console.log(chalk.yellow("Goodbye!"));
            process.exit();
    }
    // Prompt again
    await getUserInput(bank);
}
// Main function to run the program
async function main() {
    const bank = new Bank();
    console.log(chalk.blue("Welcome to MyBank!"));
    await getUserInput(bank);
}
main();

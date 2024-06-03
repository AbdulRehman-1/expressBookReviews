const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//only registered users can login
const isValid = (username) => {
    const user = users.find(user => user.username === username);
    return user ? true : false;
};

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }
//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    if(!isValid(username)) {
        return res.status(400).json({ message: "Customer not exists!" });
    }
  
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: '1h' });
  
      req.session.authorization = { accessToken, username };
      return res.status(200).send("Customer successfully logged in");
    } else {
      return res.status(401).json({ message: "Invalid login. Check username and password" });
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    
    // Check if user is authenticated
    if (!req.session.authorization) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    const username = req.session.authorization.username;
  
    // Check if the book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Add or update the review
    books[isbn].reviews[username] = review;
  
    return res.status(200).send(`Review for the book with ISBN ${isbn} has been added/updated`);
  });

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
  
    // Check if user is authenticated
    if (!req.session.authorization) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    const username = req.session.authorization.username;
  
    // Check if the book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the review by the user exists
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found" });
    }
  
    // Delete the review
    delete books[isbn].reviews[username];
  
    return res.status(200).send(`Reviews for the ISBN ${isbn} posted by the user ${username} deleted`);
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(!username || !password)
    return res.status(404).json({message: "Username/Password not provided."});
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "Customer successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "Customer already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register customer."});
  });

  const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send({books});
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const keys = Object.keys(books);
    const filtered_books = keys.filter(key => books[key].author.toLowerCase() === author).map(key => books[key]);

    if (filtered_books.length > 0) {
        return res.status(200).json({booksByAuthor:filtered_books});
    } else {
        return res.status(404).json({ message: "Books by this author not found" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const keys = Object.keys(books);
    const filtered_books = keys.filter(key => books[key].title.toLowerCase() === title).map(key => books[key]);

    if (filtered_books.length > 0) {
        return res.status(200).json({booksbytitle: filtered_books});
    } else {
        return res.status(404).json({ message: "Books with this title not found" });
    }
});
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

//10- get all books using async await
async function getBooks() {
    try {
      const response = await axios.get('https://abdulrehma48-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

//11- get books details by isbn with async await
async function getBookDetails(isbn) {
    try {
      const response = await axios.get(`https://abdulrehma48-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

//12- get books details by author with async await
async function getBookDetails(author) {
    try {
      const response = await axios.get(`https://abdulrehma48-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

//13- get books details by author with async await
async function getBookDetails(title) {
    try {
      const response = await axios.get(`https://abdulrehma48-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

module.exports.general = public_users;

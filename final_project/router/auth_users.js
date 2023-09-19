const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ return !users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{
    return users.some((user) => user.username === username && user.password === password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Please submit your username and password!"});
    }
    if(authenticatedUser(username, password)) {
        let token = jwt.sign({
            data: password,
            
        },
        'aVeryVeryverysecretString', { expiresIn: 60 * 60 });
         req.session.authorization = {token, username};
         return res.status(200).send("User "+username+" successfully logged in");
    } else {
        return res.status(208).json({message: "Incorrect username or password."});
      }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization['username']
  
  books[isbn].reviews[username] = review
    
  res.status(200).send('The review by '+username+' of the book with ISBN '+isbn+' has been added/updated.')
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username']

    if(books[isbn].reviews[username]) {
        delete books[isbn].reviews[username]
    }
    else {return res.send('There are no reviews.')}

    console.log(books[isbn].reviews)
    res.status(200).send('The review by '+username+' of the book with ISBN '+isbn+' has been deleted.')
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

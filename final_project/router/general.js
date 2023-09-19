const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const exists = (username) => {
    
  };

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User "+username+" has been successfully registered. You can now login."});
      } else {
        return res.status(404).json({message: "The username is already used!"});
      }
    } else if (username && !password) {return res.status(404).json({message: "Please choose a password."});} else if 
        (!username && password) {return res.status(404).json({message: "Please provide a username."})}
        else if (!username && !password) {return res.status(404).json({message: "Please provide a username and a password."})}
    
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let theBook = books[isbn];
  res.send(JSON.stringify(theBook,null,4))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let theBooks = {"booksbyauthor" : []}
  for(let key in books) {
      if(books[key].author === author) {
          let newBook = {
              "isbn":key,
              "title":books[key].title,
              "reviews":books[key].reviews
          }
          
          theBooks["booksbyauthor"].push(newBook)
      }
  }
  res.send(JSON.stringify(theBooks,null,4))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let theBooks = {"booksbytitle" : []}
    for(let key in books) {
        if(books[key].title === title) {
            let newBook = {
                "isbn":key,
                "author":books[key].author,
                "reviews":books[key].reviews
            }
            
            theBooks["booksbytitle"].push(newBook)
        }
    }
    res.send(JSON.stringify(theBooks,null,4))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;

  res.send(JSON.stringify(books[isbn].reviews,null,4))
});

module.exports.general = public_users;

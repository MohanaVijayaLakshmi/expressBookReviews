const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

function getAllBooks(){
    return new Promise((resolve,reject)=>{
        resolve(books);
    })
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  getAllBooks().then(
      (book) => res.send(JSON.stringify(book, null, 4)),
      (error) => res.send(error)
  );
  
  //res.send(JSON.stringify(books,null,4));
});

function getBookBasedOnISBN(isbn){
    let book = books[isbn];  
    return new Promise((resolve,reject)=>{
      if (book) {
        resolve(book);
      }else{
        reject("Book not found!");
      }    
    })
  }

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    // res.send(books[isbn]);
    getBookBasedOnISBN(isbn).then(
        (book) => res.send(JSON.stringify(book,null,4)),
        (error) => res.send(error)
    )
 });

 function getBookBasedOnAuthor(author){
    let output = [];
    return new Promise((resolve,reject)=>{
        Object.entries(books).forEach(value=>{
            const cur = value[1];
            if(cur.author===author){
                output.push(cur);
            }   
          })
      resolve(output);  
    })
  }
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  getBookBasedOnAuthor(author).then(
    result =>res.send(JSON.stringify(result, null, 4))
  )
  
  //res.status(200).json(book);

});


function getBookBasedOnTitle(title){
    let book = [];
    return new Promise((resolve,reject)=>{
        Object.entries(books).forEach(value=>{
            const cur = value[1];
            if(cur.title===title){
                book=cur;
            }
                
          })
      resolve(book);  
    })
  }

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  getBookBasedOnTitle(title).then(
    result =>res.send(JSON.stringify(result, null, 4))
  )
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  res.status(200).json(book.reviews);
});

module.exports.general = public_users;

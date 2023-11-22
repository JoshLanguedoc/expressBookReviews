const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();






public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password){
        if(isValid(username)){
            users.push({"username":username,"password":password});
            return res.status(201).json({message: "User successfully registered. Now you can login"});
        }else{
            return res.status(409).json({message: "User already exists"});
        }
    }else{
        return res.status(400).json({message:"Please provide a username and a password to register new user"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let listProm = new Promise((res, rej)=>{
        res(JSON.stringify(books))
    })
    
    listProm.then((booklist)=>{
        return res.status(200).send(booklist)
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let isbnProm = new Promise((res,rej)=>{
        res(JSON.stringify(books[isbn]))
    })

    isbnProm.then((book)=>{
        if(book){
            return res.status(200).send(book);
        }else{
            return res.status(404).send("Book with isbn "+isbn+" not found in database");
        }
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = new String(req.params.author);
    
    let authorProm = new Promise((res,rej)=>{
        let filteredBooks = [];
        let j = 0;
        for(i = 0; i < Object.keys(books).length; i++){
            if(author == books[i+1].author){
                filteredBooks[j] = books[i+1];
                j++;
            }
        }
        res(filteredBooks);
    });
    
    authorProm.then((filteredBooks)=>{
        if (filteredBooks.length>0){
            return res.status(200).send(JSON.stringify(filteredBooks))
        }else{
            return res.status(400).send("Book by author "+author+" not found in database\n(Tip: Author lookup is case sensitive)")
        }
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = new String(req.params.title);
    
    let titleProm= new Promise((res,rej)=>{
        let filteredBooks = [];
        let j = 0;
        for(i = 0; i < Object.keys(books).length; i++){
            if(title == books[i+1].title){
                filteredBooks[j] = books[i+1];
                j++;
            }
        }
        res(filteredBooks);
    });

    titleProm.then((filteredBooks)=>{
        if (filteredBooks.length>0){
            return res.status(200).send(JSON.stringify(filteredBooks))
        }else{
            return res.status(404).send("Book with title "+title+" not found in database\n(Tip: Author lookup is case sensitive)")
        }
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    reviews = books[isbn].reviews;
    console.log(JSON.stringify(reviews));
    if (Object.keys(reviews).length < 1){
        return res.status(404).send("Book with isbn "+isbn+" currently has no reviews.")
    }else{
        return res.status(200).send("Reviews for book with isbn: "+isbn+" Titled: "+books[isbn].title+"\n"+JSON.stringify(reviews))
    }
});

module.exports.general = public_users;

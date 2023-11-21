const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    let response = "";

    if(username && password){
        if(isValid(username)){
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        }else{
            return res.status(404).json({message: "User already exists"});
        }
    }else{
        return res.status(200).json({message:"Please provide a username and a password to register new user"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let response = JSON.stringify(books);
    console.log("Responding with:\n"+response)
    res.send(response)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let response = JSON.stringify(books[isbn]);
    console.log("Responding with:\n"+response)
    res.send(response)
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = new String(req.params.author);
    let filteredBooks = [];
    let j = 0;

    for(i = 0; i < Object.keys(books).length; i++){
        if(author == books[i+1].author){
            filteredBooks[j] = books[i+1];
            j++;
        }
    }

    if (filteredBooks.length>0){
        let response = JSON.stringify(filteredBooks);
        console.log("Responding with:\n"+response)
        res.send(response)
    }else{
        let response = ("Unable to find book by the Author "+author);
        console.log("Responding with:\n"+response)
        res.send(response)
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = new String(req.params.title);
    let filteredBooks = [];
    let j = 0;

    for(i = 0; i < Object.keys(books).length; i++){
        if(title == books[i+1].title){
            filteredBooks[j] = books[i+1];
            j++;
        }
    }

    if (filteredBooks.length>0){
        let response = JSON.stringify(filteredBooks);
        console.log("Responding with:\n"+response)
        res.send(response)
    }else{
        let response = ("Unable to find book by the title "+title);
        console.log("Responding with:\n"+response)
        res.send(response)
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    reviews = books[isbn].reviews;
    let response = ("Reviews for book with isbn: "+isbn+" Titled: "+books[isbn].title+"\n\n")
    for (i = 0; i < Object.keys(reviews).length; i++){
        console.log(reviews[i])
        response = response+'"'+reviews[i+1]+'"';
        if(i+1 < Object.keys(reviews).length){
            response = response+"\n\n"
        }
    }
    console.log("Responding with:\n"+response)
    res.send(response)
});

module.exports.general = public_users;

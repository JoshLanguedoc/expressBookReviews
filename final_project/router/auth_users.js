const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username:"John", password:"1234!"}];

function isValid (username){ //returns boolean
    
    let usersWithSameName = users.filter((user)=>{return user.username === username});

    if(usersWithSameName.length > 0){
        return false;
    }else{
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{return(user.username === username && user.password === password)});

    if(validusers.length > 0){
        return true;
    }else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password){
      return res.status(404).json({message:"Username and Password required for login"})
  }

  if(authenticatedUser(username, password)){
      let accessToken = jwt.sign({
          data: password
        }, 'access', {expiresIn: 60*60});

        req.session.authorization = {accessToken,username}
        return res.status(200).send("User successfully logged in");
  }else{
      return res.status(208).json({message: "Invalid login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const user = req.session.authorization.username;
    const isbn = req.params.isbn;
    const currentReviews = books[isbn].reviews;
    const currentLenght = Object.keys(currentReviews).length;
    let review = {username:user,review:req.query.review};
    let updated = false;

    console.log("currentReviews length is "+currentLenght);

    for(i=0; i < currentLenght; i++){
        if(currentReviews[i+1].username == user){
            console.log("Current reviews has a matching user");
            currentReviews[i+1] = review;
            books[isbn].reviews = currentReviews;
            updated = true;
            console.log(review);
            return res.status (200).send("Review for book with isbn# "+isbn+" from user "+user+" Has been updated successfully");
        }

    }
    
    if(!updated){
        console.log("!updated was true");
        currentReviews[currentLenght] = review
    }
    return res.status(200).json({message:"Request recieved"})
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req,res)=>{
    const isbn = req.params.isbn;
    const user = req.session.authorization.username;
    const currentReviews = books[isbn].reviews;
    const currentLength = Object.keys(currentReviews).length;
    let deleted = false;

    for(i=0; i < currentLength; i++){
        if(currentReviews[i+1].username == user){
            console.log(currentReviews);
            delete currentReviews[i+1];
            console.log(currentReviews);
        }
    }
    return res.status(200).json({message:"Request recieved"})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

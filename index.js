// require dependencies
var pg = require("pg");
var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

// set routing
app.set("view engine", "pug");
app.use(require("express").static(__dirname + "/public"));
http.listen(process.env.PORT || 6000, function() {
  console.log("listening on " + (process.env.PORT || 6000));
});

// socket.io stuff
var sessid = 0;
io.on("connection", function(socket) {
  console.log("a user connected");
  // sign in / sign up code
  socket.on("signin", function(username, password) {
    username = username.trim().toLowerCase();
    password = password.trim();
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query("select * from users where username='" + username + "' and password='" + password + "';", function(err, result) {
        if(result.rows.length == 0)
          socket.emit("signinerror");
        else {
          socket.emit("signinsuccess", ++sessid);

          // INSERT SESSION ID INTO DATABASE???

        }
      });
    });
  });
  socket.on("signup", function(username, password) {
    username = username.trim().toLowerCase();
    password = password.trim();
    var error = false;
    if(usernameVal.length < 8)
      error = "Username must be longer than eight characters.";
    else if(passwordVal.length < 8)
      error = "Password must be longer than eight characters.";
    else if(/[^a-zA-Z0-9_\.]/.test(usernameVal))
      error = "Username must only consist of letters, numbers, underscores, or periods";
    if(error)
      socket.emit("signuperror", error);
    else
      socket.emit("signupsuccess");
  });
  socket.on("disconnect", function(socket) {
    console.log("a user disconnected");
  });
});

// db stuff
app.get("/db", function(request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("select * from test_table;", function(err, result) {
      done();
      if(err) {
        console.error(err);
        response.send("Error " + err);
      } else
        response.render("db.jade", {results: result.rows} );
    });
  });
});

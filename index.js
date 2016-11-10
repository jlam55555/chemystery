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
io.on("connection", function(socket) {
  console.log("a user connected");
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

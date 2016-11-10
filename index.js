var pg = require("pg");
var app = require("express")();
var http = require("http").Server(app);

app.get("/", function(req, res) {
  res.send("<h1>hello world</h1>");
});

http.listen(process.env.PORT || 5000, function() {
  console.log("listening on " + process.env.PORT || 5000);
});

app.get("/db", function(request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("SELECT * FROM test_table", function(err, result) {
      done();
      if(err) {
        console.error(err);
        response.send("Error " + err);
      } else {
        response.render("pages/db", {results: result.rows} );
      }
    });
  });
});

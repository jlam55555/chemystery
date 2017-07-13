$(function() {

  // connect to socket.io
  var socket = io.connect();

  // signing in
  var username = $("#username");
  var password = $("#password");
  var signin = $("#signin");
  signin.click(function() {
    socket.emit("signin", username.val(), password.val());
  });
  socket.on("signinerror", function() {
    alert("Username or password is incorrect.");
  });
  socket.on("signinsuccess", function(id) {
    alert("Successfully signed in!");
    Cookies.set("user", id);
  });

});

//Grabbing the articles and taking them in as a JSON object
$.getJSON("/articles", function(data) {console.log(data);
  // For each, append the Title, Summary, URL, Picture to the #article div
  for(var i=0; i < data.length; i++) {
    //p tag in articles
    $("#articles").append("<div class='card'><img src='" + data[i].image + "'> <p style='margin: auto' data-id='" + data[i]._id + 
    //Title
    "'> <strong> <u>Title</u> <br />" + data[i].title + "</strong> <br />" + 
    //Summary - ONLY ONE AVAILABLE SO ONLY ONE WILL SHOW FOR ALL!!!
    // "<strong> <u>Summary</u> </strong> <br />" + data[i].summary + "<br />" + 
    //Image
    "<br />" +
    //Link
    "<strong> <u><i>Link</i></u> </strong> <br />" + data[i].link + "</p></div>");
    
  }
});

//Clicking a p tag
$(document).on("click", "p", function() {
  //Create a border around the notes section otherwise it would have
  //a border around nothing before it's clicked
  $("#notes").css({
    "border-style": "groove"
  });
  //Empty the notes
  $("#notes").empty();
  //save the id from the p tag as thisId
  var thisId = $(this).attr("data-id");

  //Ajax call for the article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
  //Add note info to the page
  .then(function(data) {
    console.log(data);
    //Append the article title with data.title
    $("#notes").append("<h3>" + data.title + "</h3>");
    //Append a new title
    $("#notes").append("<input id='titleinput' name='title' >");
    //Append a body with data.body
    $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    //Add a submit button tied to the article id to save the note
    $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save this Note</button");

    //Get rid of the border afterwards, otherwise it looks weird
    $("#notes").css({
      "border-style": "none"
    });

    //If there's a note in the article
    if (data.note) {
      //Put the title of the note in title input
      $("#titleinput").val(data.note.title);
      //Put the body of the note in the textarea
      $("#bodyinput").val(data.note.body);
    }
  });
});

//Save note button mechanics
$(document).on("click", "#savenote", function() {
  //Grab the id of the article id tied to the submit button
  var thisId = $(this).attr("data-id");

  //Run a POST request to change the note, updating it with the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // value from title input
      title: $("#titleinput").val(),
      // value from note textarea
      body: $("#bodyinput").val()
    }
  })
  //log the response
  .then(function(data) {
    console.log(data);
    //empty out the notes section
    $("#notes").empty();
  });

  //Remove values entered in the input and textarea in the notes
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
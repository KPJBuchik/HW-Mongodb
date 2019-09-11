

// Grab the articles as a json
$.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
        $("#articles").append("<button data-id='" + data[i]._id + "' class='save'>SAVE</button>")
    }
});



// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            console.log(data);
            $("#notes").append("<h2>" + data.title + "</h2>");
            $("#notes").append("<input id='titleinput' name='title' >");
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            if (data.note) {
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        });
});

// When you click the save note button
$(document).on("click", "#savenote", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .then(function (data) {
            console.log(data);
            $("#notes").empty();
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});

//delete button
$(document).on("click", ".clear", function () {
    $.ajax({
        method: "DELETE",
        url: "/articles/"
    }).then(function (data) {
        console.log(data)

    })
    location.reload();
})

//scrap new articles button
$(document).on("click", ".scrape-new", function () {
    $.ajax({
        method: "GET",
        url: "/articles/"
    }).then(function (data) {
        console.log(data)


    })
    location.reload();
})

$(document).on("click", ".save", function () {
    var saveArticle = $(this).attr("data-id");
    console.log(saveArticle)
    saveArticle.saved = true;
    $.ajax({
        method: "PATCH",
        url: "/articles/" + saveArticle,
        data: { saved: true }
    })
        .then(function (data) {
            console.log(data)
        })
})



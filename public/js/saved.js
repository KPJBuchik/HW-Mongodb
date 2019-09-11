$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
        $("#articles").append("<button data-id='" + data[i]._id + "' class='delete'>Delete</button>")
    
if (data[i]._id.saved===false){
$("#articles").clear()

}
    }
})

$(document).on("click", ".delete", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "DELETE",
        url: "/articles/"+ thisId,
        
    }).then(function (data) {
        console.log(data)

    })
    location.reload();
})


$(document).on("click", "p", function () {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            console.log(data);
            $("#notes").append("<h3>" + data.title + "</h2>");
            $("#notes").append("<h3 id='titleinput' name='title' >");
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            if (data.note) {
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        });
});

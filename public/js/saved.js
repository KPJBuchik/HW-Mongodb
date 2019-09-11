$.getJSON("/articles", function (data) {

    for (var i = 0; i < data.length; i++) {
        $(".caption").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
        $(".caption").append("<button data-id='" + data[i]._id + "' class='delete'>Delete</button>")
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
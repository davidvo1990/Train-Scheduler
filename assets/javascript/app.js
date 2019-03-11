var apiKey = "Khll4GtC4J8q6tXZl96C97GzmgOPgSiv"

var queryURL;
var topics = ["Ironman", "Captain America", "Spiderman", "Thanos", "Black Widow",
    "Deadpool", "Hulk", "Black Panther", "Thor", "Jean Grey", "Loki", "Groot",
    "Cable", "Juggernaut", "Star-Lord", "Ant-Man", "Wolverine", "Nick Fury",
    "Rocket Raccoon", "Nebula"
];
var currentChar;
var limit;
///////////////////////////
//Global function call
renderButtons();
animateImage();
downloadImage();
////////////////////////

function renderButtons() {

    // Deleting the character buttons prior to adding new buttons
    // (this is necessary otherwise we will have repeat buttons)
    $(".button-view").empty();

    // Looping through the array of chars
    for (var i = 0; i < topics.length; i++) {

        // Then dynamicaly generating buttons for each char in the array.
        // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
        var button = $("<button>");
        // buttondding button class
        button.addClass("character btn  text-light");
        // Adding a data-attribute with a value of the char at index i
        button.attr("data-name", topics[i]);
        // Providing the button's text with a value of the char at index i
        button.text(topics[i]);
        // Adding the button to the HTML
        $(".button-view").append(button);
    }
}

// This function handles events where one button is clicked
$(".add-char").on("click", function (event) {
    // event.preventDefault() prevents the form from trying to submit itself.
    // We're using a form so that the user can hit enter instead of clicking the button if they want
    // event.preventDefault();

    // This line will grab the text from the input box
    var currentButton = $(".input").val().trim();

    // Clear the textbox when done
    $(".input").val("");

    // The character from the textbox is then added to our array
    topics.push(currentButton);

    // calling renderButtons which handles the processing of our char array
    renderButtons();
});

//function to add image when click character button
$(document).on("click", ".character", function (event) {
    $(".image-view").empty();
    //API for giphy
    var moreImage = $("<button class='btn text-light more-image'>Add more!</button>")
    $(".extra").html(moreImage);

    currentChar = $(this).attr("data-name");
    console.log("You click: " + currentChar);
    limit = 10;

    queryURL = "https://api.giphy.com/v1/gifs/search?limit=" + limit + "&q=marvel+" + currentChar + "&api_key=" + apiKey;


    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(updatePage);

    //second API for movie 
    var movieKey = "5195b749"
    var movieURL = "https://www.omdbapi.com/?t=" + currentChar + "&y=&plot=short&apikey=" + movieKey;

    $.ajax({
        url: movieURL,
        method: "GET"
    }).then(function (response) {

        console.log(response);
        var title = response.Title;
        var rating = response.Ratings[0].Value;
        var actor = response.Actors;
        var rated = response.Rated;
        var poster = response.Poster;
        var titleDiv = $("<div>Title: <span>" + title + "</span></div>");
        var ratingDiv = $("<div>Rating: <span>" + rating + "</span></div>");
        var actorDiv = $("<div>Actor: <span>" + actor + "</span></div>");
        var ratedDiv = $("<div>Rated: <span>" + rated + "</span></div>");
        var imgDiv = $("<div><img src='" + poster + "'></div>");
        console.log(title);
        console.log(rating);
        console.log(actor);
        console.log(rated);
        console.log(poster);

        $(".movie-box").html(titleDiv).append(ratedDiv).append(ratingDiv).append(actorDiv).append(imgDiv);
    });



    //END on click
});

//function to add 10 more images, 20 total
$(document).on("click", ".more-image", function (event) {
    $(".image-view").empty();

    limit = 20;
    queryURL = "https://api.giphy.com/v1/gifs/search?limit=" + limit + "&q=marvel+" + currentChar + "&api_key=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(updatePage);
    //END on click
})

//function allow download on click download button
function downloadImage() {
    $(document).on("click", ".download", function () {
        // forceDownload(url, fileName);
        var url = $(this).parent().find(".imageDiv").find(".gif").attr("data-animate");
        var fileName = $(this).parent().find(".title").attr("imgtitle");
        console.log("Link to download: " + url);
        console.log("File name to download: " + fileName);
        forceDownload(url, fileName);
    })
}
//function for giphy ajax
function updatePage(response) {
    console.log(response);
    var datas = response.data;

    for (var i = 0; i < datas.length; i++) {
        var img = $("<img>");
        img.attr("src", datas[i].images.fixed_height_small_still.url);
        img.addClass("gif");
        img.attr("data-still", datas[i].images.fixed_height_small_still.url)
        img.attr("data-animate", datas[i].images.fixed_height_small.url)
        img.attr("data-state", "still");
        var imageDiv = $("<div class='imageDiv'></div>")
        imageDiv.html(img);

        var rating = $("<div class='rating'>Rating: <span>" + datas[i].rating + "</span></div>");
        var title = $("<div class='title' imgtitle='" + datas[i].title + "'>Topic: <span >" + datas[i].title + "</span></div>");
        // var source = $("<div>Source: <span>"+datas[i].source+"</span></div>");
        var import_datetime = $("<div>Import date: <span>" + datas[i].import_datetime + "</span></div>");
        //var download = $("<a href=" + datas[i].images.fixed_height_small.url + " download><button class='bnt'>Download!</button></a>")

        var download = $("<button class='btn download text-light mr-1'>Download</button>")
        var favorite = $("<button class='btn favorite text-light'>Favorite</button>")
        url = datas[i].images.fixed_height_small.url;
        fileName = datas[i].title;




        var imgDiv = $("<div>").append(title).append(import_datetime).append(rating).append(download).append(favorite).append(imageDiv);
        imgDiv.addClass("img-box");


        $(".image-view").append(imgDiv);
    }
    //END updatePage()
};

//add favorite and more favorite item to the favorite box
$(document).on("click", ".favorite", function () {
    $(".favorite-box").html($(this).parent());
    console.log($(this).parent())

})

// $(document).on("click", ".download", function (event) {
//     forceDownload(url, fileName)
// })

//could not cross-origin have to force download cross origin new update
function forceDownload(url, fileName) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = fileName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }
    xhr.send();
}


//this is for the still and animate image when click
function animateImage() {
    $(document).on("click", ".gif", function () {
        var state = $(this).attr("data-state");
        // If the clicked image's state is still, update its src attribute to what its data-animate value is.
        // Then, set the image's data-state to animate
        // Else set src to the data-still value
        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }

    })
    //END animateImage()
};

// sound for fun
var audio = new Audio("assets/sound/bensound-cute.mp3");
setInterval(function () {
    audio.play();
}, 1000);
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDT8asGcI4g15O0-qNBXu0Vfy2296G1Mzk",
    authDomain: "trainscheduler-eb955.firebaseapp.com",
    databaseURL: "https://trainscheduler-eb955.firebaseio.com",
    projectId: "trainscheduler-eb955",
    storageBucket: "trainscheduler-eb955.appspot.com",
    messagingSenderId: "954629056200"
};
firebase.initializeApp(config);

var database = firebase.database();

///////////////////////////
//all funtion run here
tabledisplay();
remove();
update();
updateTable()
autorun();
////////////////////////////
//all variable is here
var trainName;
var trainDestination;
var trainStart;
var trainFrequency;

var nextArrival;
var tMinutesTillTrainArrive;
var trainId = "";
////////////////////////////
//Button for adding new train information
$(document).on("click", "#add-train-btn", function (event) {
    event.preventDefault();

    // Get user input
    var trainNameIn = $("#trainname-input").val().trim();
    var trainDestinationIn = $("#destination-input").val().trim();
    var trainStartIn = $("#start-input").val().trim();
    var trainFrequencyIn = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainNameIn,
        destination: trainDestinationIn,
        start: trainStartIn,
        frequency: trainFrequencyIn
    };

    // Uploads train data to the database
    database.ref().push(newTrain);
    // database.ref().set(newTrain);

    // Logs everything to console
    console.log("New Train Name is: " + newTrain.name);
    console.log("New Train Destination is: " + newTrain.destination);
    console.log("New Train Start Time at: " + newTrain.start);
    console.log("New Train Frequency is: " + newTrain.frequency);

    alert("New train information successfully added");

    // Clears all of the text-boxes
    $("#trainname-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
    //update table 
    tabledisplay();

    //END of input value
});

//Create calculation formula for next Arrival and until train arrival time
function calculate() {

    // Calculate
    console.log("------------");
    var format = "HH:mm";
    //Train start time
    var trainStartValue = moment().format(trainStart, format);
    console.log("START TIME: " + trainStartValue);

    // Current Time
    var now = moment().format("HH:mm");
    console.log("CURRENT TIME: " + now);

    // Difference between the times
    var diffTime = moment().diff(moment(trainStartValue, "X"), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // var displayedDate = -(convertedDate.diff(moment(), "months"));

    // Time apart (remainder)
    var tRemainder = diffTime % trainFrequency;
    console.log("Time apart: " + tRemainder);

    // Minute Until Train
    tMinutesTillTrainArrive = trainFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN ARRIVE: " + tMinutesTillTrainArrive);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrainArrive, "minutes");
    nextArrival = moment(nextTrain).format("hh:mm A");

    console.log("ARRIVAL TIME: " + nextArrival);
    console.log("------------");
    //END calculate()
};



// Create Firebase event for adding new train to the database and a row in the html when a user adds an entry
function trainUpdate() {
    database.ref().on("child_added", function (childSnapshot) {
        // database.ref().on("value", function (childSnapshot) {

        console.log(childSnapshot.val());

        // Store everything into a variable.
        trainName = childSnapshot.val().name;
        trainDestination = childSnapshot.val().destination;
        trainStart = childSnapshot.val().start;
        trainFrequency = childSnapshot.val().frequency;

        // Employee Info
        console.log("Firebase pull, Employee Name Info: " + trainName);
        console.log("Firebase pull, Employee Destination Info: " + trainDestination);
        console.log("Firebase pull, Employee Start Time Info: " + trainStart);
        console.log("Firebase pull, Employee Frequency Info: " + trainFrequency);

        calculate();

        // Create the new row of train data
        var FireTrainName = $("<td></td>").text(trainName);
        var FireTrainDestination = $("<td>").text(trainDestination);
        var FireTrainFrequency = $("<td>").text(trainFrequency);
        var FireNextArrivall = $("<td>").text(nextArrival);
        var FireTMinutesTillTrainArrive = $("<td>").text(tMinutesTillTrainArrive);

        var FireButton = $("<td></td>");
        var updateBtn = $("<button class='btn updateBtn ml-2 text-light'>Update</button>")
        var removeBtn = $("<button class='btn removeBtn ml-2 text-light'>Remove</button>")
        FireButton.prepend(removeBtn).prepend(updateBtn);

        var newRow = $("<tr>").append(
            FireButton,
            FireTrainName,
            FireTrainDestination,
            FireTrainFrequency,
            FireNextArrivall,
            FireTMinutesTillTrainArrive
        );

        var keys = childSnapshot.key;
        newRow.attr('id', keys);

        // Append the new row to the table
        $(".train-display").append(newRow);
    })

    //END trainUpdate()
};

// add remove button
function remove() {
    $(document).on('click', '.removeBtn', function () {
        // desertRef = parseInt($(this).parent().attr("id"));
        // var desertRef = $(this).closest('tr')
        //get the key of object set in id
        var trainId = $(this).parent().parent().attr("id");
        console.log(trainId);

        database.ref().child(trainId).remove();
        tabledisplay();
    })
    //END remove()
};



function update() {
    $(document).on('click', '.updateBtn', function () {
        // desertRef = parseInt($(this).parent().attr("id"));
        // var desertRef = $(this).closest('tr')
        //get the key of object set in id, will use this key in updateTable() function
        trainId = JSON.parse(JSON.stringify($(this).parent().parent().attr("id")));
        console.log(trainId);
        //create update form dynamicly, before the table
        //create all the html
        var update = $('<div class="jumbotron add"></div>')
        var head = $('<div class="head">Update Train</div>')
        var input = $('<div class="input"></div>')
        var form = $('<form class="train-input"></form>')

        var formgroupName = $('<div class="form-group"><div>')
        var lableName = $('<label class="header" for="trainName-update">Train Name</label>')
        var updateName = $('<input class="form-control" id = "trainName-update"  type = "text">')

        var formgroupDestination = $('<div class="form-group"><div>')
        var lableDestination = $('<label class="header" for="trainDestination-update">Destination</label>')
        var updateDestination = $('<input class="form-control" id = "trainDestination-update"  type = "text">')

        var formgroupStart = $('<div class="form-group"><div>')
        var lableStart = $('<label class="header" for="trainStart-update">First Train Time(HH:mm - military time)</label>')
        var updateStart = $('<input class="form-control" id = "trainStart-update"  type = "text">')

        var formgroupFrequency = $('<div class="form-group"><div>')
        var lableFrequency = $('<label class="header" for="trainFrequency-update">Frequency</label>')
        var updateFrequency = $('<input class="form-control" id = "trainFrequency-update"  type = "text">')

        var submitUpdate = $('<button class="btn text-light" id="update-train-btn">Submit</button>')

        //assign all html to where it belong
        $(".update-form").html(update);
        update.append(head).append(input);
        input.append(form);

        form.append(formgroupName);
        formgroupName.append(lableName).append(updateName);

        form.append(formgroupDestination);
        formgroupDestination.append(lableDestination).append(updateDestination);

        form.append(formgroupStart);
        formgroupStart.append(lableStart).append(updateStart);

        form.append(formgroupFrequency);
        formgroupFrequency.append(lableFrequency).append(updateFrequency);

        form.append(submitUpdate);


        //var table = database.ref().child(trainId).update({ name: "New trainer" });
        //console.log(table);
        // tabledisplay();

    })

};

function updateTable() {
    $(document).on('click', '#update-train-btn', function (event) {
        event.preventDefault();
        //get all value of input
        var upNam = $("#trainName-update").val();
        var upDes = $("#trainDestination-update").val();
        var upSta = $("#trainStart-update").val();
        var upFre = $("#trainFrequency-update").val();

        //check condition, update only if something fill in, if empty on all input don't update
        if (upNam !== "" || upDes !== "" || upSta !== "" || upFre !== "") {
            //if only one input fill, then only update that input
            if (upNam !== "") {
                database.ref().child(trainId).update({ name: upNam });
                // database.ref().child(trainId+"/name").set(upNam);
            }
            if (upDes !== "") {
                database.ref().child(trainId).update({ destination: upDes });
            }
            if (upSta !== "") {
                database.ref().child(trainId).update({ start: upSta });
            }
            if (upFre !== "") {
                database.ref().child(trainId).update({ frequency: upFre });
            }
        }


        // Clears all of the text-boxes
        // $("#trainname-update").val("");
        // $("#destination-update").val("");
        // $("#start-update").val("");
        // $("#frequency-update").val("");

        tabledisplay();
        $(".update-form").html("");

        //trainId = "";
        console.log(trainId);
    })
    //END updateTable()
};


// Dynamic created the Table header
function tabledisplay() {
    var table = $("<table class='train-display'></table>");

    var header = $("<tr class='header'></tr>");
    var hButton = $("<th scope='col'> </th>");
    var hName = $("<th scope='col'>Train Name</th>");
    var hDes = $("<th scope='col'>Destination</th>");
    var hFre = $("<th scope='col'>Frequency (min)</th>");
    var hNext = $("<th scope='col'>Next Arrival</th>");
    var hAway = $("<th scope='col'>Minutes Away</th>");

    header.append(
        hButton,
        hName,
        hDes,
        hFre,
        hNext,
        hAway
    );

    table.append(header);
    $(".update").html(table);

    //parse in the rest of the table
    trainUpdate();

    //END tabledisplay()
}




//Update the table information every 60 sec
function autorun() {
    setInterval(function () {
        tabledisplay();
    }, 60 * 1000);
    //END autorun()
};



$(document).ready(function () {
    console.log("ready!");


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAHzNv8UvgEbI5MLzyaBu8e7cOKpfxlLvI",
        authDomain: "train-8b576.firebaseapp.com",
        databaseURL: "https://train-8b576.firebaseio.com",
        projectId: "train-8b576",
        storageBucket: "train-8b576.appspot.com",
        messagingSenderId: "469623046821"
    };
    firebase.initializeApp(config);



    var database = firebase.database();


    $("#button-input").on("click", function (event) {
        event.preventDefault();
        

        $("#empty-form").hide();
        var name = $("#name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var startTime = $("#startTime-input").val();
        var frequency = $("#frequency-input").val().trim();

        
            console.log("name: " + name + " destination: " + destination + " startTime: " + startTime + " frequency: " + frequency);

            database.ref().push({
                name: name,
                destination: destination,
                startTime: startTime,
                frequency: frequency,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });

            $("#train-form")[0].reset();
        // } else {
        //     $("#empty-form").show();
        // }

    });


    database.ref().on("child_added", function (childSnapshot) {

        var childName = childSnapshot.val().name;
        var childDestination = childSnapshot.val().destination;
        var childStartTime = childSnapshot.val().startTime;
        var childFrequency = childSnapshot.val().frequency;

        console.log("this is from the firebase: " + childName);
        console.log("this is from the firebase: " + childDestination);
        console.log("this is from the firebase: " + childStartTime);
        console.log("this is from the firebase: " + childFrequency);

        var newRow = $("<tr>");
        var newName = $("<td>").attr("data-name", childName).text(childName);
        var newDestination = $("<td>").attr("data-name", childDestination).text(childDestination);
        var newRate = $("<td>").attr("data-name", childFrequency).text(childFrequency);


        //moment.js business
        //converting the start time
        var dateFormat = "HH:mm a";
        var convertedTime = moment(childStartTime, dateFormat).subtract(1, "years");
        console.log(convertedTime);

        //logging current time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm a"));

        //getting difference between times
        var timeDiff = moment().diff(moment(convertedTime), "minutes");
        console.log("DIFFERENCE IN TIME: " + timeDiff);

        //check the remainder between the time diff and the frequency
        var timeRemain = timeDiff % childFrequency;
        console.log(timeRemain);

        //subtract the remainder from the frequency to find the time till the next train
        var timeTillTrain = childFrequency - timeRemain;
        console.log("MINUTES TILL TRAIN: " + timeTillTrain);

        // Next Train
        var nextTrain = moment().add(timeTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm a"));
        var nextTrainFormatted = moment(nextTrain).format("hh:mm a");

        //logging the next train time and minutes till train to the console
        var nextArrival = $("<td>").text(nextTrainFormatted);
        var minutesAway = $("<td>").text(timeTillTrain);

        newRow.append(newName, newDestination, newRate, nextArrival, minutesAway);
        $("#table-body").append(newRow);

    });





});
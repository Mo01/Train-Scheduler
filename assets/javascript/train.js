


// Initialize Firebase
var config = {
  apiKey: "AIzaSyAweuuYvDkffV2pPOdq0NYmW_uimmBfgjw",
  authDomain: "train-00000.firebaseapp.com",
  databaseURL: "https://train-00000.firebaseio.com",
  projectId: "train-00000",
  storageBucket: "train-00000.appspot.com",
  messagingSenderId: "724171108848"
};
firebase.initializeApp(config);
var database = firebase.database();

// User input
$("#submit").on("click", function (event) {
  event.preventDefault();
  console.log("hi");
  var name = $("#name").val().trim();
  var destination = $("#destination").val().trim();
  var frequency = $("#frequency").val().trim();
  var firstTrain = $("#firstTrain").val().trim();

  // Push input to the database
  database.ref().push({
    name,
    destination,
    frequency,
    firstTrain
  });


  //cleare inputs
  $("#name").val("");
  $("#destination").val("");
  $("#frequency").val("");
  $("#firstTrain").val("");

});

setInterval(function(){
  $("table > tbody").empty();
database.ref().on("child_added", function (childSnapshot) {
  var id = childSnapshot.key;
  
  // firstTrain time as string
  var firstTrain = childSnapshot.val().firstTrain;
  //convert firstTrain string to HH:MM and object
  var start = moment(firstTrain, "HH:mm").toObject();
  // from the object get total minutes
  var startMin = start.hours * 60 + start.minutes;
  // Frequency as string
  var frequency = childSnapshot.val().frequency;
  // Current time
  var now = moment().toObject();
  // from the curentTime object get the total minutes
  var nowMin = now.hours * 60 + now.minutes;
  // (curent time - start time) / frequency
  var nextStop = (nowMin - startMin) / frequency;
  // frequency * (nextStop as integer) + startTime
  var nextStopMin = frequency * Math.ceil(nextStop) + startMin;
  var minAway = nextStopMin - nowMin;
  // ArraivelTime startfrom midnight then added the nextStopMin in minutes
  var nextArraival = moment().startOf('day').add(nextStopMin, "minutes").format("HH:mm");

// To display in HTML
$("table > tbody").append('<tr id="'+id +'"><td><a href="javascript:deleteMe(\''+ id +'\')">X</a></td><td>'+ childSnapshot.val().name + "</td><td>" + childSnapshot.val().destination + "</td><td>" + frequency + "</td><td>" + firstTrain + "</td><td>" + nextArraival + "</td><td>" + minAway + "</td></tr>")

  

  



}); },1000);
//Delete function
function deleteMe(id) {
  database.ref().child(id).remove();
  $("#"+ id).remove();
}
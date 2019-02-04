


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

database.ref().on("child_added", function (childSnapshot) {
  var id = childSnapshot.key;
  // Current time
  var now = moment().toObject();
  var firstTrain = childSnapshot.val().firstTrain;
  var start = moment(firstTrain, "HH:mm").toObject();
  var startMin = start.hours * 60 + start.minutes;
  var frequency = childSnapshot.val().frequency;
  console.log(startMin);
  var nowMin = now.hours * 60 + now.minutes;
  console.log(nowMin);
  var nextStop = (nowMin - startMin) / frequency;
  var nextStopMin = frequency * Math.ceil(nextStop) + startMin;
  console.log(nextStop, nextStopMin);
  var minAway = nextStopMin - nowMin;
  console.log(minAway);

  var nextArraival = moment().startOf('day').add(nextStopMin, "minutes").format("HH:mm");


  $("table > tbody").append('<tr id="'+id +'"><td><a href="javascript:deleteMe(\''+ id +'\')">X</a></td><td>'+ childSnapshot.val().name + "</td><td>" + childSnapshot.val().destination + "</td><td>" + frequency + "</td><td>" + firstTrain + "</td><td>" + nextArraival + "</td><td>" + minAway + "</td></tr>")



});

function deleteMe(id) {
  database.ref().child(id).remove();
  $("#"+ id).remove();
}
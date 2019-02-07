


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

function calcNextArrival(frequency, startTime) {  
  //convert firstTrain string to HH:MM and object
  var start = moment(startTime, "HH:mm").toObject();
  // from the object get total minutes
  var startMin = start.hours * 60 + start.minutes;
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
  var nextArrival = moment().startOf('day').add(nextStopMin, "minutes").format("HH:mm");
  return [nextArrival, minAway];
};

database.ref().on("child_added", function (childSnapshot) {
  var id = childSnapshot.key;
  
  setInterval(function(){
    var result = calcNextArrival(childSnapshot.val().frequency, childSnapshot.val().firstTrain); 
    $('#' + id + ' > .next-arrival').text(result[0]);
    $('#' + id + ' > .min-away').text(result[1]);
  }, 1000);
  var result = calcNextArrival(childSnapshot.val().frequency, childSnapshot.val().firstTrain);
// To display in HTML
$("table > tbody").append('<tr id="'+id +'"><td><a href="javascript:deleteMe(\''+ id +'\')">X</a></td><td>'+ childSnapshot.val().name + "</td><td>" + childSnapshot.val().destination + "</td><td>" + childSnapshot.val().frequency + "</td><td>" + childSnapshot.val().firstTrain + '</td><td class="next-arrival">' + result[0] + '</td><td class="min-away">' + result[1] + "</td></tr>")

});


//Delete function
function deleteMe(id) {
  database.ref().child(id).remove();
  $("#"+ id).remove();
}
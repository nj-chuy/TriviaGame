
// loads full DOM before staring the function / javascript
$(document).ready(function () {

  // jquery .hide consists of number and string, determines how long something will be displayed
  $("#timeLeft").hide();
  // #start refers to the html with ID=start, .on refers to the action click, the call is function trivia.startGame
  $("#start").on('click', trivia.startGame)
  // {
  //   $('body').css('background-image', '#2727FF');
  // });
  $(document).on('click', '.option', trivia.guessChecker);

  //  just adding a clock with time to keep track, practing setting a timer with a stop button
  var myVar = setInterval(myTimer, 1000);

  function myTimer() {
    var d = new Date();
    var t = d.toLocaleTimeString();
    document.getElementById("currentTime").innerHTML = t;
  }

  // function myStopFunction() {
  //   clearInterval(myVar);
  // }

})

  // function myFunction() {
  //   var txt;
  //   var question1 = prompt("what does the komodo eat?");
  //   if (question1 == "fish" || question1 == "rats" || question1 == "dogs") {
  //       txt = "Wrong answer.";
  //   } else {
  //       txt = "correct answer" + question1;

  //   }
  //   document.getElementById("q1").innerHTML = txt;
  // }


//  code for the questions and answers, 
// function name followed by propert, a method is an object inside a function
var trivia = {
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 20,
  timerOn: false,
  timerId: '',

    // objects under trivia
  questions: {
    q1: 'What does a komodo dragon eat?',
    q2: 'How do komodo dragons attack?',
    q3: 'How long does a komodo dragon live?',
    q4: 'How does a baby komodo dragon survive?',
    q5: 'Where does the komodo dragon live?',
    q6: 'How long does a komodo dragon get?',
    q7: 'What is the deadliest part of the komodo dragon?',
    q8: 'How fast can a Komdo dragon run?',
  },
   // more objects under trivia, this time with arrays for choices
  options: {
    q1: ['boars', 'deer', 'mice', 'goats', 'all of the above'],
    q2: ['ambush', 'chase', 'fall from trees', 'dig a hole'],
    q3: ['15 years', '1 year', '100 years', '30 years'],
    q4: ['hide in a hole','climb a tree','build a nest','swim to safety'],
    q5: ['Austrailia','Indonesia Islands','Montana','Africa'],
    q6: ['2ft','10ft','100ft','6inches'],
    q7: ['bite','saliva','claws','tackling abilities'],
    q8: ['6mph','8mph','12mph','15mph'],
  },
   // more objects under trivia
  answers: {
    q1: 'all of the above',
    q2: 'ambush',
    q3: '30 years',
    q4: 'climb a tree',
    q5: 'Indonesia Islands',
    q6: '10ft',
    q7: 'saliva',
    q8: '12mph'
  },





  // start game
  startGame: function () {
    // reset results to zero for game start
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);
    $('#questionHead').remove();

    // show game section
    $('#game').show();

    //  empty last results
    $('#results').html('');

    // show timer
    $('#timer').text(trivia.timer);

    // remove start button
    $('#start').hide();

    $('#timeLeft').show();

    // ask first question
    trivia.nextQuestion();

  },



  nextQuestion: function () {

    // set timer to 10 seconds each question
    trivia.timer = 10;
    $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);

    // to prevent timer speed up
    if (!trivia.timerOn) {
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }

    // gets all the questions then indexes the current questions (listed above in the var trivia with questions q1-q8)
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);

    // an array of all the user options for the current question (listed above in the var trivia with options listing array of choices)
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];

    // creates all the trivia guess options in the html
    $.each(questionOptions, function (index, key) {
      $('#options').append($('<button class="option btn btn-info btn-lg">' + key + '</button>'));
    })

  },
  // method to decrement counter and count unanswered if timer runs out
  timerRunning: function () {
    // if timer still has time left and there are still questions left to ask
    if (trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length) {
      $('#timer').text(trivia.timer);
      trivia.timer--;
      if (trivia.timer === 4) {
        $('#timer').addClass('last-seconds');
      }
    }
    // the time has run out and increment unanswered, run result
    else if (trivia.timer === -1) {
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Out of time! The answer was ' + Object.values(trivia.answers)[trivia.currentSet] + '</h3>');
    }
    else if (trivia.currentSet === Object.keys(trivia.questions).length) {

      // id results is used to write the trivia variables first declared.
      $('#results')
        .html('<h3>I hope you enjoyed playing!</h3>' +
          '<p>Correct Answers: ' + trivia.correct + '</p>' +
          '<p>Incorrect Answers: ' + trivia.incorrect + '</p>' +
          '<p>Unaswered: ' + trivia.unanswered + '</p>' +
          '<p>Please play again!</p>'
          // ('#start')
          );

      // hide game sction
      $('#game').hide();

      // show start button to begin a new game
      $('#start').show();
    }

  },
  // method to evaluate the option clicked
  guessChecker: function () {

    // timer ID for gameResult setTimeout
    var resultId;

    // the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];

    // if the text of the option picked matches the answer of the current question, increment correct
    if ($(this).text() === currentAnswer) {
      // turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');

      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Correct Answer!</h3>');
    }
    // else the user picked the wrong option, increment incorrect
    else {
      // turn button clicked red for incorrect
      $(this).addClass('btn-danger').removeClass('btn-info');

      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Sorry, wrong answer. ' + currentAnswer + '</h3>');
    }

  },
  // method to remove previous question results and options
  guessResult: function () {

    // increment to next question set
    trivia.currentSet++;

    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();


    // begin next question
    trivia.nextQuestion();

  }

}
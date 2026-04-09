let data = [];
let current = {};

fetch("verbs.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    newQuestion();
  });

function newQuestion() {
  const verbObj = data[0];
  const pronoun = Object.keys(verbObj.forms)[0];

  current = {
    verb: verbObj.verb,
    tense: verbObj.tense,
    pronoun: pronoun,
    answer: verbObj.forms[pronoun]
  };

  document.getElementById("question").innerText =
    `${current.verb} (${current.pronoun}, ${current.tense})`;
}

function checkAnswer() {
  const user = document.getElementById("answer").value.trim().toLowerCase();

  if (user === current.answer) {
    document.getElementById("feedback").innerText = "Correct!";
  } else {
    document.getElementById("feedback").innerText =
      `Wrong! Correct: ${current.answer}`;
  }
}

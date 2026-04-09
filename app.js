let data = [];
let current = {};

const tenseLabels = {
  present: "настоящее",
  past: "прошедшее",
  future: "будущее"
};

fetch("verbs.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    newQuestion();
  });

function newQuestion() {
  const verbObj = data[Math.floor(Math.random() * data.length)];
  const pronouns = Object.keys(verbObj.forms);
  const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];

  current = {
    verb: verbObj.verb,
    tense: verbObj.tense,
    pronoun: pronoun,
    answer: verbObj.forms[pronoun]
  };

  document.getElementById("question").innerText =
    `${current.verb} (${current.pronoun}, ${tenseLabels[current.tense]})`;

  document.getElementById("answer").value = "";
  document.getElementById("feedback").innerText = "";
}

function checkAnswer() {
  const user = document.getElementById("answer").value.trim().toLowerCase();

  const normalize = (str) =>
  str.trim().toLowerCase();

  if (normalize(user) === current.answer) {
    document.getElementById("feedback").innerText = "Correct!";
  } else {
    document.getElementById("feedback").innerText =
      `Wrong! Correct: ${current.answer}`;
  }

  setTimeout(newQuestion, 1500);
}

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
    populateVerbList();
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

function populateVerbList() {
  const select = document.getElementById("verbSelect");
  select.innerHTML = "";

  data.forEach((v, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = v.verb;
    select.appendChild(option);
  });
}

document.getElementById("answer")
  .addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      checkAnswer();
    }
  })

function showSection(section) {
  document.getElementById("home").style.display = "none";
  document.getElementById("trainer").style.display = "none";
  document.getElementById("tableTrainer").style.display = "none";

  document.getElementById(section).style.display = "block";
};

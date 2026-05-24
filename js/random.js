//========= Function to generate new question in random mode =========
function newQuestion() {
  if (data.length === 0) return;
  
  const verbObj = data[Math.floor(Math.random() * data.length)];

  const possibleTenses = verbObj.type === "perfective" ? ["future"] : ["present","future"];

  const tense = possibleTenses[Math.floor(Math.random() * possibleTenses.length)];
  
  const forms = verbObj?.tenses?.[tense];
  if (!forms) return;
    
  const pronouns = Object.keys(forms);
  const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];

  current = {
    verb: verbObj.verb,
    tense: tense,
    pronoun: pronoun,
    answer: forms[pronoun]
  };

  document.getElementById("question").innerText =
    `${current.verb} (${current.pronoun}, ${tenseLabels[current.tense]})`;

  document.getElementById("answer").value = "";
  document.getElementById("feedback").innerText = "";
}

//========= Function to check answer in random mode =========
function checkAnswer() {
  const user = document.getElementById("answer").value.trim().toLowerCase();

  const normalize = (str) =>
  str.trim().toLowerCase();

  if (normalize(user) === normalize(current.answer)) {
    document.getElementById("feedback").innerText = "Correct!";
  } else {
    document.getElementById("feedback").innerText =
      `Wrong! Correct: ${current.answer}`;
  }

  setTimeout(newQuestion, 1500);
}

let data = [];
let current = {};
let currentTable = {};

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

  const tense = "present";
  const forms = verbObj.tenses[tense];
    
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

function loadTable() {
  const index = document.getElementById("verbSelect").value;
  const verbObj = data[index];

  currentTable = verbObj;

  let html = `<h2>${verbObj.verb}</h2>`;
  html += `<table border="1">`;

  // Header
  html += `
    <tr>
      <th>Present</th>
      <th>Future</th>
      <th>Past</th>
      <th>Imperative</th>
    </tr>
  `;

  const pronouns = ["я", "ты", "он", "она", "оно", "мы", "вы", "они"];
  const pastForms = ["masculine", "feminine", "neuter", "plural"];
  const imperativeForms = ["singular", "plural"];

  const maxRows = 8; // longest column

  for (let i = 0; i < maxRows; i++) {
    html += "<tr>";

    // PRESENT
    if (i < pronouns.length) {
      const p = pronouns[i];
      html += `
        <td>
          ${p}<br>
          <input data-tense="present" data-pronoun="${p}">
        </td>
      `;
    } else {
      html += "<td></td>";
    }

    // FUTURE
    if (i < pronouns.length) {
      const p = pronouns[i];
      html += `
        <td>
          ${p}<br>
          <input data-tense="future" data-pronoun="${p}">
        </td>
      `;
    } else {
      html += "<td></td>";
    }

    // PAST
    if (i < pastForms.length) {
      const form = pastForms[i];
      html += `
        <td>
          ${form}<br>
          <input data-tense="past" data-pronoun="${form}">
        </td>
      `;
    } else {
      html += "<td></td>";
    }

    // IMPERATIVE
    if (i < imperativeForms.length) {
      const form = imperativeForms[i];
      html += `
        <td>
          ${form}<br>
          <input data-tense="imperative" data-pronoun="${form}">
        </td>
      `;
    } else {
      html += "<td></td>";
    }

    html += "</tr>";
  }

  html += "</table>";

  document.getElementById("tableContainer").innerHTML = html;
}

function checkTable() {

  const inputs = document.querySelectorAll("#tableContainer input");

  let correct = 0;
  // let total = inputs.length;
  let total = 0;

  inputs.forEach(input => {
    const tense = input.dataset.tense;
    const pronoun = input.dataset.pronoun;

    const user = input.value.trim().toLowerCase();
    const correctAnswer = currentTable.tenses[tense][pronoun]?.toLowerCase();

    if (!correctAnswer) return;

    total++;

    if (user === correctAnswer) {
      input.style.backgroundColor = "#c8f7c5";
      correct++;
    } else {
      input.style.backgroundColor = "#f7c5c5";
      input.value = `${input.value} (${correctAnswer})`;
    }
  });

    const percentage = Math.round((correct/total)*100);

    document.getElementById("tableResult").innerText = 
      `Score: ${percentage}% (${correct}/${total})`;
}

document.getElementById("answer")
  .addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      checkAnswer();
    }
  })

// function showSection(section) {
//   document.getElementById("home").style.display = "none";
//   document.getElementById("trainer").style.display = "none";
//   document.getElementById("tableTrainer").style.display = "none";

//   document.getElementById(section).style.display = "block";
// };

function resetTrainer() {
  document.getElementById("answer").value = "";
  document.getElementById("feedback").innerText = "";

  if (data.length > 0) {
    newQuestion();
  }
}

function resetTableTrainer(){
  document.getElementById("tableContainer").innerHTML = "";
  document.getElementById("tableResult").innerText = "";

  currentTable = {};
}

function resetHome() {
  // nothing for now
}

function showSectionFromHash() {
  const hash = window.location.hash.substring(1);

  const sections = ["home","trainer","tableTrainer"];

  // Hide all
  sections.forEach(id => {
    // document.getElementById(id).style.display = "none";
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  // if (!hash || !sections.includes(hash)) {
  //   document.getElementById("home").style.display = "block";
  //   return;
  // };
  // decide which to show
  let active = "home";
  if (hash && sections.includes(hash)) {
    active = hash;
  }
  
  // Show selected
  document.getElementById(active).style.display = "block";

  // Reset
  if (active == "trainer") {
    resetTrainer();
  }

  if (active == "tableTrainer") {
    resetTableTrainer();
  }

  if (active == "home") {
    resetHome();
  }
}

// Run on page load
window.addEventListener("load", showSectionFromHash);

// Run when hash changes
window.addEventListener("hashchange", showSectionFromHash);
;

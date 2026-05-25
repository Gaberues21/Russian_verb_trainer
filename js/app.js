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
    loadStateFromURL();

    initializeListeners();
    
    renderApp();
    
    newQuestion();
  });

//========= Function to initialize listeners =========
function initializeListeners() {

  document.getElementById("aspectFilter")
    .addEventListener("change", e => {

      appState.aspect = e.target.value;

      updateURL();
      renderApp();
    });

  document.getElementById("conjugationFilter")
    .addEventListener("change", e => {

      appState.conjugation = e.target.value;

      updateURL();
      renderApp();
    });

  document.getElementById("stemFilter")
    .addEventListener("change", e => {

      appState.stem = e.target.value;

      updateURL();
      renderApp();
    });

  document.getElementById("classFilter")
    .addEventListener("change", e => {

      appState.v_class = e.target.value;

      updateURL();
      renderApp();
    });

  document.getElementById("searchFilter")
    .addEventListener("input", e => {

      appState.search = e.target.value;

      updateURL();
      renderApp();
    });
}

//========= Function to normalise Russian characters =========
function normalizeRussian(str) {

  return str
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е");
}

//========= Function to check answers in table in full mode =========
function checkTable() {

  const inputs = document.querySelectorAll("#tableContainer input");

  let correct = 0;
  // let total = inputs.length;
  let total = 0;

  inputs.forEach(input => {
    const tense = input.dataset.tense;
    const pronoun = input.dataset.pronoun;

    // const user = input.value.trim().toLowerCase();
    // const correctAnswer = currentTable?.tenses?.[tense]?.[pronoun]?.toLowerCase();
    const user = normalizeRussian(input.value);
    const correctAnswer = normalizeRussian(currentTable?.tenses?.[tense]?.[pronoun] || "");

    if (!correctAnswer) return;

    total++;

    if (user === correctAnswer) {
      input.style.backgroundColor = "#c8f7c5";
      correct++;
    } else {
      input.style.backgroundColor = "#f7c5c5";
      // input.value = `${input.value} (${correctAnswer})`;
      if (!input.value.includes("(")) {
        input.value = `${input.value} (${correctAnswer})`;
      }
    }
  });

    // const percentage = Math.round((correct/total)*100);
  const percentage = total > 0
    ? Math.round((correct/total)*100)
    : 0;

    document.getElementById("tableResult").innerText = 
      `Score: ${percentage}% (${correct}/${total})`;
}

window.addEventListener("load", () => {
  const answerInput = document.getElementById("answer");
  if (answerInput) {
    answerInput.addEventListener("keypress",function(e) {
      if (e.key === "Enter") {
        checkAnswer();
      }
    });
  }
});

//========= Back button for 3-step mode in table trainer =========
function goToCategories() {
  // window.location.hash = "tableTrainer";
  appState.selectedVerb = null;
  updateURL();
  renderApp();
}

//========= Function to reset random mode when exiting =========
function resetTrainer() {
  document.getElementById("answer").value = "";
  document.getElementById("feedback").innerText = "";

  if (data.length > 0) {
    newQuestion();
  }
}

//========= Function to reset table trainer mode when exiting =========
function resetTableTrainer(){
  document.getElementById("tableContainer").innerHTML = "";
  document.getElementById("tableResult").innerText = "";

  currentTable = {};
}

//========= Function to reset home when exiting =========
function resetHome() {
  // nothing for now
}

window.addEventListener("hashchange", () => {
  loadStateFromURL();
  renderApp();
});

function goToSection(section) {

  appState.section = section;

  updateURL();
  renderApp();
}

//========= Function to show URL of each section =========
// function showSectionFromHash() {
//   const hashFull = window.location.hash.substring(1);
//   const [section] = hashFull.split("?");
//   const params = getQueryParams();

//   const sections = ["home","trainer","tableTrainer"];

//   // Hide all main sections
//   sections.forEach(id => {
//     const el = document.getElementById(id);
//     if (el) el.style.display = "none";
//   });

//   // decide which to show
//   let active = "home";
//   if (section && sections.includes(section)) {
//     active = section;
//   }
  
//   // Show selected
//   document.getElementById(active).style.display = "block";

//   // Reset
//   if (active === "trainer") resetTrainer();
//   if (active === "home") resetHome();

//   if (active === "tableTrainer") {
//     handleTableRoutine(params);
//   }
// }

// // Run when hash changes
// window.addEventListener("hashchange", showSectionFromHash);
// ;

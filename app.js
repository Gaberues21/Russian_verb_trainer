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

//========= Function to generate new question in random mode =========
function newQuestion() {
  if (data.length === 0) return;
  
  const verbObj = data[Math.floor(Math.random() * data.length)];

  const tense = "present";
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

//========= Function to render categories in full mode =========
function renderCategories(selected = "all") {
  const categories = ["all","top100","motion","imperfective","perfective"];

  const container = document.getElementById("categoryBar");
  container.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.style.marginRight = "8px";

    if (cat === selected) {
      btn.style.background = "#1abc9c";
    }

    btn.onclick = () => {
      renderCategories(cat);
      showVerbList(cat);
    };

    container.appendChild(btn);
  });
}

//========= Function to populate verb list in full mode =========
function populateVerbList() {
  const select = document.getElementById("verbSelect");
  if (!select) return;
  
  select.innerHTML = "";

  data.forEach((v, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = v.verb;
    select.appendChild(option);
  });
}

//========= Function to load table in full mode =========
function generateTable(verbObj) {
  
  // const index = document.getElementById("verbSelect").value;
  // const verbObj = data[index];

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
  document.getElementById("tableResult").innerText = "";
  
  enableTableNavigation();

  setTimeout(() => {
    const firstInput = document.querySelector("#tableContainer input");
    if (firstInput) firstInput.focus();
  }, 0);
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

    const user = input.value.trim().toLowerCase();
    const correctAnswer = currentTable?.tenses?.[tense]?.[pronoun]?.toLowerCase();

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

// document.getElementById("answer")
//   .addEventListener("keypress", function(e) {
//     if (e.key === "Enter") {
//       checkAnswer();
//     }
//   })
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

//========= Function to enable keyboard navigation in table =========
function enableTableNavigation() {
  const inputs = document.querySelectorAll("#tableContainer input");

  inputs.forEach((input, index) => {
    input.addEventListener("keydown", (e) => {
      const cols = 4; // number of columns

      if (e.key === "ArrowRight") {
        inputs[index + 1]?.focus();
      }

      if (e.key === "ArrowLeft") {
        inputs[index - 1]?.focus();
      }

      if (e.key === "ArrowDown") {
        inputs[index + cols]?.focus();
      }

      if (e.key === "ArrowUp") {
        inputs[index - cols]?.focus();
      }
    });
  });
}

//========= Function for 3-step flow in table trainer =========
function handleTableRoutine(params) {
  const categoryView = document.getElementById("categoryView");
  const listView = document.getElementById("verbListView");
  const tableView = document.getElementById("tableView");

  // Hide all subviews
  if (categoryView) categoryView.style.display = "none";
  if (listView) listView.style.display = "none";
  if (tableView) tableView.style.display = "none";

  // Direct verb (highest priority)
  if (params.verb) {
    const verbParam = decodeURIComponent(params.verb);
    const verbObj = data.find(v => v.verb === verbParam);

    if (verbObj) {
      resetTableTrainer();
      generateTable(verbObj);
      if (tableView) tableView.style.display = "block";
      return;
    }
  }

  // Category selected
  if (params.cat) {
    showVerbListFromCategory(params.cat);
    listView.style.display = "block";
    return;
  }

  // Default -> categories
  categoryView.style.display = "block";
}

//========= Function to build verb list from category in full mode =========
function showVerbListFromCategory(category) {
  let filtered;

  if (category === "all") {
    filtered = data;
  } else if (category === "imperfective") {
    filtered = data.filter(v => v.type === "imperfective");
  } else if (category === "perfective") {
    filtered = data.filter(v => v.type === "perfective");
  } else {
    filtered = data.filter(v => 
      Array.isArray(v.category) && v.category.includes(category));
  }

  const container = document.getElementById("verbList");
  container.innerHTML = "";

  filtered.forEach( v => {
    const item = document.createElement("div");

    item.innerHTML = `
      <div style="font-weight: bold;">${v.verb}</div>
      <div style="font-size: 0.9rem; color: #666;">${v.translation || ""}</div>
    `;

    item.style.cursor = "pointer";
    item.style.padding = "10px";
    item.style.borderBottom = "1px solid #ddd";

    item.onclick = () => {
      openTable(v)
    };

    container.appendChild(item);
  });
}

// function showVerbListFromCategory(category) {
//   let filtered;

//   if (category === "all") {
//     filtered = data;
//   } else if (category === "imperfective") {
//     filtered = data.filter(v => v.type === "imperfective");
//   } else if (category === "perfective") {
//     filtered = data.filter(v => v.type === "perfective");
//   } else {
//     filtered = data.filter(v => v.category?.includes(category));
//   }

//   const container = document.getElementById("verbList");
//   container.innerHTML = "";

//   filtered.forEach( v => {
//     const item = document.createElement("div");
//     item.textContent = v.verb;
//     item.style.cursor = "pointer";
//     item.style.padding = "5px";

//     item.onclick = () => {
//       window.location.hash = `tableTrainer?verb=${encodeURIComponent(v.verb)}`;
//     };

//     container.appendChild(item);
//   });
// }

//========= Helper function for 3-step mode in table trainer =========
function getQueryParams() {
  // const query = window.location.hash.split("?")[1];
  // const params = new URLSearchParams(query);
  // return Object.fromEntries(params.entries());
  const parts = window.location.hash.split("?");
  if (parts.length > 2) return {};

  const params = new URLSearchParams(parts[1]);
  return Object.fromEntries(params.entries());
}

//========= Back button for 3-step mode in table trainer =========
function goToCategories() {
  window.location.hash = "tableTrainer";
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

//========= Function to show URL of each section =========
function showSectionFromHash() {
  const hashFull = window.location.hash.substring(1);
  const [section] = hashFull.split("?");
  const params = getQueryParams();

  const sections = ["home","trainer","tableTrainer"];

  // Hide all main sections
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  // if (!hash || !sections.includes(hash)) {
  //   document.getElementById("home").style.display = "block";
  //   return;
  // };
  // decide which to show
  let active = "home";
  if (section && sections.includes(section)) {
    active = section;
  }
  
  // Show selected
  document.getElementById(active).style.display = "block";

  // Reset
  if (active === "trainer") resetTrainer();
  if (active === "home") resetHome();

  if (active === "tableTrainer") {
    handleTableRoutine(params);
  }
}

// Run on page load
window.addEventListener("load", showSectionFromHash);

// Run when hash changes
window.addEventListener("hashchange", showSectionFromHash);
;

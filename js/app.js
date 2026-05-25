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
    // populateVerbList();
    renderCategories();
    newQuestion();
    showSectionFromHash();

    document.getElementById("aspectFilter").addEventListener("change", () => {
      updateFilters({aspect:document.getElementById("aspectFilter").value});
    });
    document.getElementById("conjugationFilter").addEventListener("change", () => {
      updateFilters({conjugation:document.getElementById("conjugationFilter").value});
    });
    document.getElementById("stemFilter").addEventListener("change", () => {
      updateFilters({stem:document.getElementById("stemFilter").value});
    });
    document.getElementById("classFilter").addEventListener("change", () => {
      updateFilters({class:document.getElementById("classFilter").value});
    });
    document.getElementById("searchFilter").addEventListener("input", () => {
      updateFilters({search:document.getElementById("searchFilter").value});
    });
  });

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
      if (categoryView) categoryView.style.display = "none";
      if (listView) listView.style.display = "none";
      if (tableView) {
        tableView.style.display = "block";
      }
      return;
    }
  }

  // Category selected
  const selectedCategory = params.cat || "all";
  const selectedAspect = params.aspect || "any";
  const selectedConjugation = params.conjugation || "any";
  const selectedStem = params.stem || "any";
  const selectedClass = params.class || "any";
  const selectedSearch = params.search || "";

  renderCategories(selectedCategory);

  document.getElementById("aspectFilter").value = 
    selectedAspect;
  document.getElementById("conjugationFilter").value = 
    selectedConjugation;
  document.getElementById("stemFilter").value = 
    selectedStem;
  document.getElementById("classFilter").value = 
    selectedClass;
  document.getElementById("searchFilter").value = 
    selectedSearch;

  showVerbList(selectedCategory, selectedAspect, selectedConjugation, selectedStem , selectedClass, selectedSearch);
  
  if (categoryView) {
    categoryView.style.display = "block";
  }

  if (listView) {
    listView.style.display = "block";
  }
}

//========= Function to build verb list from category in full mode =========
function showVerbList(category, aspect = "any", conjugation = "any", stem = "any", v_class = "any", search = "") {
  
  let filtered = data;

  // Category filtering 
  if (category !== "all") {
    filtered = filtered.filter(v => 
      Array.isArray(v.category) && 
      v.category.includes(category)
    );
  }

  // Aspect filtering
  if (aspect !== "any") {
    filtered = filtered.filter(v => 
      v.type === aspect 
    );
  }

  // Conjugation filtering
  if (conjugation !== "any") {
    filtered = filtered.filter(v => 
      v.conjugation === conjugation 
    );
  }

  // Stem filtering
  if (stem !== "any") {
    filtered = filtered.filter(v => 
      v.stem_pattern === stem 
    );
  }
  
  // Class filtering
  if (v_class !== "any") {
    filtered = filtered.filter(v => 
      v.class === v_class 
    );
  }
  
  if (search.trim() !== "") {
    const searchLower = search.toLowerCase();

    filtered = filtered.filter(v => 
      v.verb.toLowerCase().includes(searchLower) || 
      (v.translation || "").toLowerCase().includes(searchLower));
  }
  
  const container = document.getElementById("verbList");
  container.innerHTML = "";

  filtered.forEach( v => {
    const item = document.createElement("div");

    item.className = "verb-item";

    item.innerHTML = `
      <div class="verb-russian">${v.verb}</div>
      <div class="verb-english">
        ${v.translation || ""}
      </div>
    `;

    item.onclick = () => {
      window.location.hash = 
        `tableTrainer?verb=${encodeURIComponent(v.verb)}`;
    };

    container.appendChild(item);
  });
}

//========= Helper function for 3-step mode in table trainer =========
function getQueryParams() {
  const parts = window.location.hash.split("?");
  if (parts.length > 2) return {};

  const params = new URLSearchParams(parts[1]);
  return Object.fromEntries(params.entries());
}

//========= Helper function to update URL filters =========
function updateFilters(newParams) {

  // Current and new URL params
  const params = {...getQueryParams(),...newParams};

  // Remove empty values
  Object.keys(params).forEach(key => {
    if (params[key] === "" || params[key] === "any") {
      delete params[key];
    }
  });

  // Build query string
  const query = new URLSearchParams(params).toString();

  // Update hash
  window.location.hash = query ? `tableTrainer?${query}` : "tableTrainer";
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

// Run when hash changes
window.addEventListener("hashchange", showSectionFromHash);
;

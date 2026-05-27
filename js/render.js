//========= Function to render categories in full mode =========
function renderCategories() {
  
  const categories = ["all","top100","motion","reflexive"];

  const container = document.getElementById("categoryBar");
  container.innerHTML = "";

  categories.forEach(cat => {
    
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.style.marginRight = "8px";

    if (cat === appState.cat) {
      btn.style.background = "#1abc9c";
    }

    btn.onclick = () => {
      // updateFilters({cat: cat});
      appState.cat = cat;
      updateURL();
      renderApp();
    };
    
    container.appendChild(btn);
  });
}

//========= Function to load table in full mode =========
function generateTable(verbObj) {
  
  currentTable = verbObj;

  const isPerfective = verbObj.type === "perfective";
  
  let html = `<h2>${verbObj.verb}</h2>`;

  html += `
  <div class="table-controls">

    <button onclick="toggleTense('present')">
      Present
    </button>

    <button onclick="toggleTense('future')">
      Future
    </button>

    <button onclick="toggleTense('past')">
      Past
    </button>

    <button onclick="toggleTense('imperative')">
      Imperative
    </button>

  </div>
`;
  
  html += `<table border="1">`;
  
  // Header
  html += `
    <tr>
      <th class="${isPerfective ? "disabled-col" : ""}">Present</th>
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

    // PRESENT (disabled for perfective)
    if (i < pronouns.length) {
      const p = pronouns[i];
      
      html += `
        <td class="${isPerfective ? "disabled-col" : ""}">
          ${p}<br>
          <input 
            data-tense="present" 
            data-pronoun="${p}"
            ${isPerfective ? "disabled" : ""}
          >
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
          <input 
            data-tense="future" 
            data-pronoun="${p}"
          >
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
          <input 
            data-tense="past"
            data-pronoun="${form}"
          >
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
          <input 
            data-tense="imperative" 
            data-pronoun="${form}"
          >
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
    const firstInput = document.querySelector("#tableContainer input:not([disabled])");
    if (firstInput) firstInput.focus();
  }, 0);
}

//========= Function to build verb list from category in full mode =========
function renderVerbList() {

  const filtered = getFilteredVerbs();

  const start =
    (appState.page - 1) * appState.pageSize;
  
  const end =
    start + appState.pageSize;
  
  const paginated =
    filtered.slice(start, end);

  const container = document.getElementById("verbList");

  // Safety check
  if (!container) return;
  
  container.innerHTML = "";

  paginated.forEach( v => {
    const item = document.createElement("div");

    item.className = "verb-item";

    item.innerHTML = `
      <div class="verb-russian">${v.verb}</div>
      <div class="verb-english">
        ${v.translation || ""}
      </div>
    `;

    item.onclick = () => {
      // appState.selectedVerb = v.verb;
      appState.selectedVerb = v.id;
      updateURL();
      renderApp();
    };

    container.appendChild(item);
  });

  const totalPages =
    Math.ceil(filtered.length / appState.pageSize);
  
  const pagination =
    document.getElementById("pagination");
  
  pagination.innerHTML = `
    <button
      ${appState.page === 1 ? "disabled" : ""}
      onclick="changePage(-1)"
    >
      ← Prev
    </button>
  
    <span>
      Page ${appState.page} of ${totalPages}
    </span>
  
    <button
      ${appState.page === totalPages ? "disabled" : ""}
      onclick="changePage(1)"
    >
      Next →
    </button>
  `;
}

//========= Function to toggle tenses on and off =========
function toggleTense(tense) {

  const index =
    appState.hiddenTenses.indexOf(tense);

  if (index === -1) {

    appState.hiddenTenses.push(tense);

  } else {

    appState.hiddenTenses.splice(index, 1);
  }

  if (currentTable) {
    generateTable(currentTable);
  }
}

//========= Function to change page =========
function changePage(direction) {
  
  appState.page += direction;

  if (appState.page < 1) {
    appState.page = 1;
  }

  updateURL();
}

//========= Function to render verb list from categories =========
function renderApp() {

  const sections = ["home", "trainer", "tableTrainer"];

  sections.forEach(id => {
    const el = document.getElementById(id);
  
    if (el) {
      el.style.display =
        id === appState.section
          ? "block"
          : "none";
    }
  });
  
  renderCategories();

  document.getElementById("aspectFilter").value =
    appState.aspect;

  document.getElementById("conjugationFilter").value =
    appState.conjugation;

  document.getElementById("stemFilter").value =
    appState.stem;

  document.getElementById("classFilter").value =
    appState.v_class;

  document.getElementById("searchFilter").value =
    appState.search;

  const categoryView =
    document.getElementById("categoryView");

  const listView =
    document.getElementById("verbListView");

  const tableView =
    document.getElementById("tableView");

  if (appState.selectedVerb) {

    const verbObj = data.find(v =>
      // v.verb === appState.selectedVerb
      String(v.id) === String(appState.selectedVerb)
    );

    if (verbObj) {

      categoryView.style.display = "none";
      listView.style.display = "none";

      tableView.style.display = "block";

      generateTable(verbObj);
    }

  } else {

    categoryView.style.display = "block";
    listView.style.display = "block";

    tableView.style.display = "none";

    renderVerbList();
  }
}

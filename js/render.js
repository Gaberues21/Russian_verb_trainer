//========= Function to render categories in full mode =========
function renderCategories(selected = "all") {
  
  const categories = ["all","top100","motion","reflexive"];

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
      updateFilters({cat: cat});
    };
    
    container.appendChild(btn);
  });
}

//========= Function to load table in full mode =========
function generateTable(verbObj) {
  
  currentTable = verbObj;

  const isPerfective = verbObj.type === "perfective";

  let html = `<h2>${verbObj.verb}</h2>`;
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

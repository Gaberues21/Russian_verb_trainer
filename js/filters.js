function getFilteredVerbs() {

  let filtered = data;

  // Category
  if (appState.cat !== "all") {
    filtered = filtered.filter(v =>
      Array.isArray(v.category) && 
      v.category.includes(appState.cat)
    );
  }

  // Aspect
  if (appState.aspect !== "any") {
    filtered = filtered.filter(v =>
      v.type === appState.aspect
    );
  }

  // Conjugation
  if (appState.conjugation !== "any") {
    filtered = filtered.filter(v =>
      v.conjugation === appState.conjugation
    );
  }

  // Stem
  if (appState.stem !== "any") {
    filtered = filtered.filter(v =>
      v.stem_pattern === appState.stem
    );
  }

  // Imperative
  if (appState.imperative !== "any") {
    filtered = filtered.filter(v =>
      v.imperative === appState.imperative
    );
  }

  // Class
  if (appState.v_class !== "any") {
    filtered = filtered.filter(v =>
      v.class === appState.v_class
    );
  }

  // Search 
  if (appState.search.trim() !== "") {

    const searchLower = appState.search.toLowerCase();

    filtered = filtered.filter(v => 
      v.verb.toLowerCase().includes(searchLower) ||
      (v.translation || "").toLowerCase().includes(searchLower)
    );
  }

  return filtered
}

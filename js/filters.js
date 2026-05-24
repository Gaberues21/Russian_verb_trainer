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

function updateURL() {

  const params = new URLSearchParams();

  if (appState.cat !== "all") {
    params.set("cat", appState.cat);
  }
  
  if (appState.aspect !== "any") {
    params.set("aspect", appState.aspect);
  }
  
  if (appState.conjugation !== "any") {
    params.set("conjugation", appState.conjugation);
  }
  
  if (appState.stem !== "any") {
    params.set("stem", appState.stem);
  }
  
  if (appState.v_class !== "any") {
    params.set("v_class", appState.v_class);
  }
  
  if (appState.search !== "") {
    params.set("search", appState.search);
  }

  if (appState.selectedVerb) {
    params.set("verb", appState.selectedVerb);
  }
  
  const query = params.toString();

  window.location.hash =
    query
      ? `tableTrainer?${query}`
      : "tableTrainer";
}

function loadStateFromURL() {

  const hash = window.location.hash;

  const parts = hash.split("?");

  const params = new URLSearchParams(parts[1] || "");

  appState.cat =
    params.get("cat") || "all";

  appState.aspect =
    params.get("aspect") || "any";

  appState.conjugation =
    params.get("conjugation") || "any";

  appState.stem =
    params.get("stem") || "any";

  appState.v_class =
    params.get("v_class") || "any";
  
  appState.search =
    params.get("search") || "";

  appState.selectedVerb =
    params.get("verb");

  renderApp?.();
}

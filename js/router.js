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
  
  if (appState.class !== "any") {
    params.set("class", appState.class);
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

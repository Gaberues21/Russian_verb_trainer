//========= Function to enable keyboard navigation in table =========
function enableTableNavigation() {
  
  const inputs = document.querySelectorAll("#tableContainer input");

  inputs.forEach((input, index) => {
    input.addEventListener("keydown", (e) => {

      const currentCell = input.closest("td");
      const currentRow = currentCell.parentElement;

      const rowIndex = currentRow.rowIndex;
      const cellIndex = currentCell.cellIndex;

      const table = currentRow.closest("table");

      // LEFT
      if (e.key === "ArrowLeft") {
        e.preventDefault();

        const prevCell = currentCell.previousElementSibling;

        if (prevCell) {
          const target = prevCell.querySelector("input:not([disabled])");
          if (target) target.focus();
        }
      }

      // RIGHT
      if (e.key === "ArrowRight") {
        e.preventDefault();

        const nextCell = currentCell.nextElementSibling;

        if (nextCell) {
          const target = nextCell.querySelector("input:not([disabled])");
          if (target) target.focus();
        }
      }
      
      // DOWN
      if (e.key === "ArrowDown") {
        e.preventDefault();

        const nextRow = table.rows[rowIndex + 1];

        if (nextRow) {
          const targetCell = nextRow.cells[cellIndex];
          
          if (targetCell) {
            const target = targetCell.querySelector("input:not([disabled])");
            if (target) target.focus();
          }
        }
      }

      // UP
      if (e.key === "ArrowUp") {
        e.preventDefault();

        const prevRow = table.rows[rowIndex - 1];

        if (prevRow) {
          const targetCell = prevRow.cells[cellIndex];
          
          if (targetCell) {
            const target = targetCell.querySelector("input:not([disabled])");
            if (target) target.focus();
          }
        }
      } 
    });
  });               
}

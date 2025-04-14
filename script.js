
const editor = document.getElementById("editor");
const status = document.getElementById("status");
const fontSize = document.getElementById("fontSize");
const fontFamily = document.getElementById("fontFamily");
const colorPicker = document.getElementById("textColorPicker");
const importFile = document.getElementById("importFile");
const { jsPDF } = window.jspdf;

let history = [];
let redoStack = [];

editor.addEventListener("input", () => {
  history.push(editor.innerHTML);
  if (history.length > 100) history.shift();
  redoStack = [];
});

function undoText() {
  if (history.length > 0) {
    redoStack.push(editor.innerHTML);
    editor.innerHTML = history.pop();
  }
}

function redoText() {
  if (redoStack.length > 0) {
    history.push(editor.innerHTML);
    editor.innerHTML = redoStack.pop();
  }
}

function format(command) {
  document.execCommand(command, false, null);
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function exportPDF() {
  const text = editor.innerText;
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 10, 10);
  doc.save("text.pdf");
}

function downloadText() {
  const text = editor.innerText;
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "texteditor.txt";
  link.click();
}

importFile.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      editor.innerText = e.target.result;
    };
    reader.readAsText(file);
  }
});

colorPicker.addEventListener("input", () => {
  editor.style.color = colorPicker.value;
});

function saveText() {
  localStorage.setItem("textData", editor.innerHTML);
  status.textContent = "✅ Gespeichert!";
  setTimeout(() => status.textContent = "", 2000);
}

window.onload = () => {
  const saved = localStorage.getItem("textData");
  if (saved) editor.innerHTML = saved;

  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
  }

  fontSize.addEventListener("change", () => {
    editor.style.fontSize = fontSize.value;
  });

  fontFamily.addEventListener("change", () => {
    editor.style.fontFamily = fontFamily.value;
  });
};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

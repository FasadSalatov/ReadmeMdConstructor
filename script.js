const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const clearButton = document.getElementById('clearButton');
const saveButton = document.getElementById('saveButton');
const loadButton = document.getElementById('loadButton');
const downloadButton = document.getElementById('downloadButton');
const exportHTMLButton = document.getElementById('exportHTMLButton');
const fullscreenButton = document.getElementById('fullscreenButton');
const themeToggleButton = document.getElementById('themeToggleButton');
const markdownConstructor = document.getElementById('markdownConstructor');

// Load the saved theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.classList.toggle('dark-mode', savedTheme === 'dark');
editor.classList.toggle('dark-mode', savedTheme === 'dark');
preview.classList.toggle('dark-mode', savedTheme === 'dark');
document.querySelector('.toolbar').classList.toggle('dark-mode', savedTheme === 'dark');

editor.value = localStorage.getItem('markdownContent') || '';
preview.innerHTML = marked.parse(editor.value);

editor.addEventListener('input', function () {
    const markdownText = editor.value;
    preview.innerHTML = marked.parse(markdownText);
    localStorage.setItem('markdownContent', markdownText);
});

clearButton.addEventListener('click', function () {
    editor.value = '';
    preview.innerHTML = '';
    localStorage.removeItem('markdownContent');
});

saveButton.addEventListener('click', function () {
    const content = editor.value;
    localStorage.setItem('markdownContent', content);
    alert('Content saved locally!');
});

loadButton.addEventListener('click', function () {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.md';
    fileInput.onchange = function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                editor.value = e.target.result;
                preview.innerHTML = marked.parse(editor.value);
            };
            reader.readAsText(file);
        }
    };
    fileInput.click();
});

downloadButton.addEventListener('click', function () {
    const content = editor.value;
    const blob = new Blob([content], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'markdown.md';
    link.click();
});

exportHTMLButton.addEventListener('click', function () {
    const htmlContent = preview.innerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'markdown.html';
    link.click();
});

fullscreenButton.addEventListener('click', function () {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

themeToggleButton.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    editor.classList.toggle('dark-mode');
    preview.classList.toggle('dark-mode');
    document.querySelector('.toolbar').classList.toggle('dark-mode');

    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
});

markdownConstructor.addEventListener('click', function (event) {
    const button = event.target;
    const markdownSnippet = button.getAttribute('data-markdown');
    if (markdownSnippet) {
        const currentPos = editor.selectionStart;
        const textBefore = editor.value.substring(0, currentPos);
        const textAfter = editor.value.substring(currentPos);
        editor.value = textBefore + markdownSnippet + textAfter;
        preview.innerHTML = marked.parse(editor.value);
    }
});

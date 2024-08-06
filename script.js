document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const summaryForm = document.getElementById('summary-form');
    const summaryList = document.getElementById('summary-list');
    const searchInput = document.getElementById('search');
    const yearSelect = document.getElementById('year-select');
    const contentDiv = document.getElementById('content');
    const authDiv = document.getElementById('auth');
    const loginMessage = document.getElementById('login-message');

    function displaySummaries() {
        const summaries = JSON.parse(localStorage.getItem('summaries')) || [];
        summaryList.innerHTML = '';
        summaries.forEach((summary) => {
            const summaryItem = document.createElement('div');
            summaryItem.classList.add('summary-item');
            
            // Criar link para o arquivo
            let fileLink = '';
            if (summary.file) {
                fileLink = `<p><a href="${summary.file}" target="_blank">Baixe o arquivo</a></p>`;
            }

            summaryItem.innerHTML = `
                <h3>${summary.subject} - ${summary.year}º Ano</h3>
                <p><strong>Descrição do Resumo:</strong> ${summary.summary}</p>
                <p><strong>Nome do Aluno:</strong> ${summary.name}</p>
                ${fileLink}
            `;
            summaryList.appendChild(summaryItem);
        });
    }

    function saveSummary(subject, summary, name, year, file) {
        const summaries = JSON.parse(localStorage.getItem('summaries')) || [];
        summaries.push({ subject, summary, name, year, file });
        localStorage.setItem('summaries', JSON.stringify(summaries));
    }

    function handleLogin(username) {
        localStorage.setItem('username', username);
        authDiv.style.display = 'none';
        contentDiv.style.display = 'block';
        displaySummaries();
    }

    function handleLogout() {
        localStorage.removeItem('username');
        authDiv.style.display = 'block';
        contentDiv.style.display = 'none';
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        if (username) {
            handleLogin(username);
        } else {
            loginMessage.textContent = 'Por favor, insira um nome de usuário.';
        }
    });

    logoutButton.addEventListener('click', handleLogout);

    summaryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const subject = document.getElementById('subject').value.trim();
        const summary = document.getElementById('summary').value.trim();
        const name = document.getElementById('name').value.trim();
        const year = document.getElementById('year').value.trim();
        const fileInput = document.getElementById('file-upload');
        const file = fileInput.files[0] ? URL.createObjectURL(fileInput.files[0]) : '';

        if (subject && summary && name && year) {
            saveSummary(subject, summary, name, year, file);
            displaySummaries();
            summaryForm.reset();
        }
    });

    searchInput.addEventListener('input', () => {
        const filter = searchInput.value.toLowerCase();
        const items = summaryList.getElementsByClassName('summary-item');
        Array.from(items).forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(filter) ? '' : 'none';
        });
    });

    yearSelect.addEventListener('change', () => {
        const year = yearSelect.value;
        const summaries = JSON.parse(localStorage.getItem('summaries')) || [];
        summaryList.innerHTML = '';
        summaries.forEach((summary) => {
            if (summary.year === year) {
                const summaryItem = document.createElement('div');
                summaryItem.classList.add('summary-item');
                
                // Criar link para o arquivo
                let fileLink = '';
                if (summary.file) {
                    fileLink = `<p><a href="${summary.file}" target="_blank">Baixe o arquivo</a></p>`;
                }

                summaryItem.innerHTML = `
                    <h3>${summary.subject} - ${summary.year}º Ano</h3>
                    <p><strong>Descrição do Resumo:</strong> ${summary.summary}</p>
                    <p><strong>Nome do Aluno:</strong> ${summary.name}</p>
                    ${fileLink}
                `;
                summaryList.appendChild(summaryItem);
            }
        });
    });

    // Check if user is already logged in
    if (localStorage.getItem('username')) {
        handleLogin(localStorage.getItem('username'));
    }

    // Load summaries on page load
    displaySummaries();
});

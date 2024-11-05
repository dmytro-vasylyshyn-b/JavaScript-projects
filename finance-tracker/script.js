let expenses = [];
let isEditing = false;

const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalExpensesDisplay = document.getElementById('total-expenses');
const expenseChartCanvas = document.getElementById('expense-chart');
const expensePieChartCanvas = document.getElementById('expense-pie-chart');
const submitButton = document.getElementById('submit-button');

let barChart, pieChart;

expenseForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const id = document.getElementById('expense-id').value;

    if (name && amount) {
        if (isEditing) {
            const editedExpense = expenses.find(expense => expense.id == id);

            const existingExpense = expenses.find(expense => expense.name === name && expense.id != id);

            if (existingExpense) {
                existingExpense.amount += editedExpense.amount;
                expenses = expenses.filter(expense => expense.id != id);
            } else {
                editedExpense.name = name;
                editedExpense.amount = amount;
            }
            isEditing = false;
            submitButton.textContent = "Додати";
            submitButton.style.backgroundColor= "green";
        } else {
            const existingExpense = expenses.find(expense => expense.name === name);

            if (existingExpense) {
                existingExpense.amount += amount;
            } else {
                const expense = { name, amount, id: Date.now() };
                expenses.push(expense);
            }
        }

        updateExpenses();
        expenseForm.reset();
        document.getElementById('expense-id').value = '';
    }
});

function updateExpenses() {
    expenseList.innerHTML = '';
    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${expense.name} - $${expense.amount.toFixed(2)}
            <button class="edit-btn" style="color: red; background-color: gray" data-id="${expense.id}">Edit</button>
            <button class="delete-btn" data-id="${expense.id}">Delete</button>
        `;
        expenseList.appendChild(li);
    });

    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    totalExpensesDisplay.textContent = total.toFixed(2);

    updateCharts();

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            const expense = expenses.find(expense => expense.id == id);
            document.getElementById('expense-name').value = expense.name;
            document.getElementById('expense-amount').value = expense.amount;
            document.getElementById('expense-id').value = expense.id;
            isEditing = true;
            submitButton.textContent = "Оновити дані";
            submitButton.style.backgroundColor = "#ff5733";
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            expenses = expenses.filter(expense => expense.id != id);
            updateExpenses();
        });
    });
}

function updateCharts() {
    const labels = expenses.map(expense => expense.name);
    const data = expenses.map(expense => expense.amount);

    if (barChart) {
        barChart.destroy();
    }

    barChart = new Chart(expenseChartCanvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    if (pieChart) {
        pieChart.destroy();
    }

    pieChart = new Chart(expensePieChartCanvas, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

/* ============================================
   F.I.R.E. CALCULATOR — ENGINE
   Compound interest + 3 scenarios + Charts
   ============================================ */

(() => {
    'use strict';

    // --- DOM ---
    const incomeInput = document.getElementById('incomeInput');
    const expensesInput = document.getElementById('expensesInput');
    const savingsInput = document.getElementById('savingsInput');
    const returnSlider = document.getElementById('returnSlider');
    const inflationSlider = document.getElementById('inflationSlider');
    const withdrawalSlider = document.getElementById('withdrawalSlider');
    const yearsSlider = document.getElementById('yearsSlider');
    const ageInput = document.getElementById('ageInput');

    const returnValue = document.getElementById('returnValue');
    const inflationValue = document.getElementById('inflationValue');
    const withdrawalValue = document.getElementById('withdrawalValue');
    const yearsValue = document.getElementById('yearsValue');
    const savingsRate = document.getElementById('savingsRate');
    const savingsBarFill = document.getElementById('savingsBarFill');

    const statFireNumber = document.getElementById('statFireNumber');
    const statYearsToFire = document.getElementById('statYearsToFire');
    const statRetireAge = document.getElementById('statRetireAge');
    const statMonthlyPassive = document.getElementById('statMonthlyPassive');
    const statTotalInvested = document.getElementById('statTotalInvested');
    const statTotalInterest = document.getElementById('statTotalInterest');

    const fireBanner = document.getElementById('fireBanner');
    const fireHeadline = document.getElementById('fireHeadline');
    const fireSubline = document.getElementById('fireSubline');

    // --- Format ---
    function fmtMoney(n) {
        if (Math.abs(n) >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
        if (Math.abs(n) >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
        return '$' + n.toFixed(0);
    }

    function fmtMoneyFull(n) {
        return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }

    // --- Calculation Engine ---
    function calcProjection(annualReturn, inflationRate, years, monthlySavings, currentSavings, monthlyExpenses) {
        const monthlyReturn = annualReturn / 12;
        const monthlyInflation = inflationRate / 12;
        const swr = parseFloat(withdrawalSlider.value) / 100;

        const labels = [];
        const wealthData = [];
        const passiveIncomeData = [];
        const expensesData = [];

        let wealth = currentSavings;
        let totalContributions = currentSavings;
        let fireYear = null;

        for (let year = 0; year <= years; year++) {
            labels.push('Year ' + year);
            wealthData.push(parseFloat(wealth.toFixed(2)));

            // Passive income = wealth * SWR / 12 (monthly)
            const monthlyPassive = (wealth * swr) / 12;
            passiveIncomeData.push(parseFloat(monthlyPassive.toFixed(2)));

            // Inflation-adjusted expenses
            const adjustedExpenses = monthlyExpenses * Math.pow(1 + inflationRate, year);
            expensesData.push(parseFloat(adjustedExpenses.toFixed(2)));

            // Check FIRE
            if (fireYear === null && monthlyPassive >= adjustedExpenses && year > 0) {
                fireYear = year;
            }

            // Compound for 12 months
            for (let m = 0; m < 12; m++) {
                wealth = wealth * (1 + monthlyReturn) + monthlySavings;
                totalContributions += monthlySavings;
            }
        }

        return { labels, wealthData, passiveIncomeData, expensesData, fireYear, totalContributions, finalWealth: wealthData[wealthData.length - 1] };
    }

    // --- Charts ---
    const chartFont = { family: "'Inter', sans-serif" };
    const monoFont = { family: "'JetBrains Mono', monospace" };

    const commonScales = {
        x: {
            ticks: { color: 'rgba(255,255,255,0.25)', font: { ...monoFont, size: 9 }, maxTicksLimit: 10 },
            grid: { color: 'rgba(255,255,255,0.04)' },
            border: { color: 'rgba(255,255,255,0.08)' },
        },
        y: {
            ticks: {
                color: 'rgba(255,255,255,0.25)',
                font: { ...monoFont, size: 9 },
                callback: (v) => fmtMoney(v),
            },
            grid: { color: 'rgba(255,255,255,0.04)' },
            border: { color: 'rgba(255,255,255,0.08)' },
            beginAtZero: true,
        },
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400, easing: 'easeOutCubic' },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(24, 24, 27, 0.95)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                titleFont: { ...chartFont, size: 12, weight: '600' },
                bodyFont: { ...monoFont, size: 11 },
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${fmtMoneyFull(ctx.parsed.y)}`,
                },
            },
        },
    };

    // Wealth Chart
    const wealthCtx = document.getElementById('wealthChart').getContext('2d');
    const wealthChart = new Chart(wealthCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Optimistic (+2%)',
                    data: [],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.06)',
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3,
                    borderDash: [4, 4],
                },
                {
                    label: 'Realistic',
                    data: [],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.08)',
                    fill: true,
                    borderWidth: 2.5,
                    pointRadius: 0,
                    tension: 0.3,
                },
                {
                    label: 'Pessimistic (-2%)',
                    data: [],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3,
                    borderDash: [4, 4],
                },
            ],
        },
        options: { ...commonOptions, scales: commonScales },
    });

    // Income Chart
    const incomeCtx = document.getElementById('incomeChart').getContext('2d');
    const incomeChart = new Chart(incomeCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Monthly Passive Income',
                    data: [],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    fill: true,
                    borderWidth: 2.5,
                    pointRadius: 0,
                    tension: 0.3,
                },
                {
                    label: 'Monthly Expenses',
                    data: [],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3,
                    borderDash: [6, 4],
                },
            ],
        },
        options: { ...commonOptions, scales: commonScales },
    });

    // Pie Chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['Contributions', 'Compound Interest'],
            datasets: [{
                data: [50, 50],
                backgroundColor: ['rgba(245, 158, 11, 0.7)', 'rgba(16, 185, 129, 0.7)'],
                borderColor: ['rgba(245, 158, 11, 1)', 'rgba(16, 185, 129, 1)'],
                borderWidth: 2,
                hoverOffset: 8,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 400 },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'rgba(255,255,255,0.6)',
                        font: { ...chartFont, size: 11 },
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle',
                    },
                },
                tooltip: {
                    backgroundColor: 'rgba(24, 24, 27, 0.95)',
                    titleFont: { ...chartFont, size: 12 },
                    bodyFont: { ...monoFont, size: 11 },
                    callbacks: {
                        label: (ctx) => ` ${ctx.label}: ${fmtMoneyFull(ctx.parsed)}`,
                    },
                },
            },
            cutout: '65%',
        },
    });

    // Monte Carlo Chart (500 Stochastic Paths + Quantile Fan Bands)
    const mcCtx = document.getElementById('monteCarloChart').getContext('2d');
    const monteCarloChart = new Chart(mcCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: '95th Percentile (Bull Market)',
                    data: [],
                    borderColor: 'rgba(56, 189, 248, 0.6)',
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderDash: [4, 4],
                    pointRadius: 0,
                },
                {
                    label: 'Median Portfolio (50th %)',
                    data: [],
                    borderColor: '#38bdf8',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    fill: '+1',
                    borderWidth: 2.5,
                    pointRadius: 0,
                },
                {
                    label: '5th Percentile (Worst-Case / Bear Market)',
                    data: [],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    fill: false,
                    borderWidth: 2,
                    pointRadius: 0,
                }
            ],
        },
        options: { ...commonOptions, scales: commonScales },
    });

    function runMonteCarlo(years, initialWealth, monthlySavings, annualReturn, volatility = 0.165, nSims = 300) {
        const months = years * 12;
        const monthlyMean = (annualReturn - 0.5 * Math.pow(volatility, 2)) / 12;
        const monthlyStd = volatility / Math.sqrt(12);

        const paths = [];
        let ruinCount = 0;

        for (let s = 0; s < nSims; s++) {
            const path = [initialWealth];
            let w = initialWealth;
            let ruined = false;

            for (let m = 1; m <= months; m++) {
                // Box-Muller standard normal
                const u1 = Math.max(Math.random(), 1e-9);
                const u2 = Math.random();
                const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

                const r = monthlyMean + monthlyStd * z;
                w = w * Math.exp(r) + monthlySavings;

                if (w <= 0) {
                    ruined = true;
                    w = 0;
                }

                if (m % 12 === 0) {
                    path.push(Math.round(w));
                }
            }

            if (ruined) ruinCount++;
            paths.push(path);
        }

        // Calculate 5th, 50th, 95th percentiles per year
        const p5 = [];
        const p50 = [];
        const p95 = [];

        for (let y = 0; y <= years; y++) {
            const vals = paths.map(p => p[y]).sort((a, b) => a - b);
            p5.push(vals[Math.floor(0.05 * vals.length)]);
            p50.push(vals[Math.floor(0.50 * vals.length)]);
            p95.push(vals[Math.floor(0.95 * vals.length)]);
        }

        const ruinRate = (ruinCount / nSims) * 100;
        const survivalRate = 100 - ruinRate;

        return { p5, p50, p95, ruinRate, survivalRate };
    }

    // --- Update All ---
    function updateAll() {
        const income = parseFloat(incomeInput.value) || 0;
        const expenses = parseFloat(expensesInput.value) || 0;
        const currentSavings = parseFloat(savingsInput.value) || 0;
        const annualReturn = parseFloat(returnSlider.value) / 100;
        const inflation = parseFloat(inflationSlider.value) / 100;
        const swr = parseFloat(withdrawalSlider.value) / 100;
        const years = parseInt(yearsSlider.value);
        const age = parseInt(ageInput.value) || 25;

        const monthlySaving = Math.max(income - expenses, 0);
        const rate = income > 0 ? (monthlySaving / income) * 100 : 0;

        // Update display values
        returnValue.textContent = parseFloat(returnSlider.value).toFixed(1) + '%';
        inflationValue.textContent = parseFloat(inflationSlider.value).toFixed(1) + '%';
        withdrawalValue.textContent = parseFloat(withdrawalSlider.value).toFixed(1) + '%';
        yearsValue.textContent = years + ' years';
        savingsRate.textContent = rate.toFixed(0) + '%';
        savingsBarFill.style.width = Math.min(rate, 100) + '%';

        // FIRE number
        const annualExpenses = expenses * 12;
        const fireNumber = annualExpenses / swr;

        // Run 3 scenarios
        const optimistic = calcProjection(annualReturn + 0.02, inflation, years, monthlySaving, currentSavings, expenses);
        const realistic = calcProjection(annualReturn, inflation, years, monthlySaving, currentSavings, expenses);
        const pessimistic = calcProjection(annualReturn - 0.02, inflation, years, monthlySaving, currentSavings, expenses);

        // Wealth Chart
        wealthChart.data.labels = realistic.labels;
        wealthChart.data.datasets[0].data = optimistic.wealthData;
        wealthChart.data.datasets[1].data = realistic.wealthData;
        wealthChart.data.datasets[2].data = pessimistic.wealthData;
        wealthChart.update();

        // Income Chart
        incomeChart.data.labels = realistic.labels;
        incomeChart.data.datasets[0].data = realistic.passiveIncomeData;
        incomeChart.data.datasets[1].data = realistic.expensesData;
        incomeChart.update();

        // Pie Chart — at FIRE year or end
        const targetYear = realistic.fireYear || years;
        const totalContrib = currentSavings + monthlySaving * 12 * targetYear;
        const totalWealth = realistic.wealthData[Math.min(targetYear, realistic.wealthData.length - 1)] || 0;
        const totalInterest = Math.max(totalWealth - totalContrib, 0);

        pieChart.data.datasets[0].data = [totalContrib, totalInterest];
        pieChart.update();

        // Monte Carlo Simulation Run
        const mc = runMonteCarlo(years, currentSavings, monthlySaving, annualReturn, 0.165, 300);
        monteCarloChart.data.labels = realistic.labels;
        monteCarloChart.data.datasets[0].data = mc.p95;
        monteCarloChart.data.datasets[1].data = mc.p50;
        monteCarloChart.data.datasets[2].data = mc.p5;
        monteCarloChart.update();

        const ruinBadge = document.getElementById('ruinRateBadge');
        if (ruinBadge) {
            ruinBadge.textContent = `Capital Survival: ${mc.survivalRate.toFixed(1)}% (Ruin Risk: ${mc.ruinRate.toFixed(1)}%)`;
            ruinBadge.style.color = mc.ruinRate > 15 ? '#ef4444' : '#34d399';
            ruinBadge.style.borderColor = mc.ruinRate > 15 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)';
        }

        // Stats
        statFireNumber.textContent = fmtMoney(fireNumber);
        statTotalInvested.textContent = fmtMoney(totalContrib);
        statTotalInterest.textContent = fmtMoney(totalInterest);

        if (realistic.fireYear !== null) {
            statYearsToFire.textContent = realistic.fireYear + ' yr';
            statRetireAge.textContent = (age + realistic.fireYear) + ' yr';
            const passiveAtFire = realistic.passiveIncomeData[realistic.fireYear];
            statMonthlyPassive.textContent = fmtMoney(passiveAtFire);

            fireBanner.classList.add('achieved');
            fireHeadline.textContent = `🎉 F.I.R.E. in ${realistic.fireYear} years! (Age ${age + realistic.fireYear})`;
            fireSubline.textContent = `You'll need ${fmtMoneyFull(fireNumber)} at a ${(swr * 100).toFixed(1)}% withdrawal rate. Monthly passive: ${fmtMoney(passiveAtFire)}/mo`;
        } else {
            statYearsToFire.textContent = '>' + years + ' yr';
            statRetireAge.textContent = '—';
            const finalPassive = realistic.passiveIncomeData[realistic.passiveIncomeData.length - 1];
            statMonthlyPassive.textContent = fmtMoney(finalPassive);

            fireBanner.classList.remove('achieved');
            fireHeadline.textContent = `Not reached within ${years} years`;
            fireSubline.textContent = `Try increasing savings, return rate, or projection horizon. Target: ${fmtMoneyFull(fireNumber)}`;
        }
    }

    // --- Event Listeners ---
    [incomeInput, expensesInput, savingsInput, ageInput].forEach(el => {
        el.addEventListener('input', updateAll);
    });

    [returnSlider, inflationSlider, withdrawalSlider, yearsSlider].forEach(el => {
        el.addEventListener('input', updateAll);
    });

    // --- Initial ---
    updateAll();

})();

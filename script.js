(() => {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.btn');
  let expr = '';

  function updateDisplay() {
    display.textContent = expr === '' ? '0' : expr;
  }

  function insert(value) {
    const last = expr.slice(-1);
    const operators = ['+', '−', '×', '÷', '*', '/', '-'];

    if (operators.includes(value)) {
      if (expr === '' && value !== '-') return;
      if (operators.includes(last)) {
        if (value === '-' && last !== '-') {
          expr += value;
        } else {
          expr = expr.slice(0, -1) + value;
        }
        updateDisplay();
        return;
      }
    }

    if (value === '.') {
      const parts = expr.split(/[\+\-\×\÷\*\/]/);
      const current = parts[parts.length - 1];
      if (current.includes('.')) return;
      if (current === '') expr += '0';
    }

    expr += value;
    updateDisplay();
  }

  function clearAll() {
    expr = '';
    updateDisplay();
  }

  function backspace() {
    expr = expr.slice(0, -1);
    updateDisplay();
  }

  function flashResult() {
    display.classList.add('result-flash');
    setTimeout(() => display.classList.remove('result-flash'), 600);
  }

  function evaluateExpression() {
    if (!expr) return;

    let toEval = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

    if (!/^[0-9+\-*/().\s]+$/.test(toEval)) {
      display.textContent = 'Error';
      expr = '';
      return;
    }

    try {
      const result = Function('"use strict";return (' + toEval + ')')();

      if (typeof result === 'number' && isFinite(result)) {
        expr = (Math.round(result * 1e12) / 1e12).toString();
        updateDisplay();
        flashResult();
      } else {
        display.textContent = 'Error';
        expr = '';
      }
    } catch (e) {
      display.textContent = 'Error';
      expr = '';
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-value');
      const action = btn.getAttribute('data-action');

      if (action === 'clear') {
        clearAll();
      } else if (action === 'back') {
        backspace();
      } else if (action === 'equals') {
        evaluateExpression();
      } else if (val !== null) {
        insert(val);
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
      insert(e.key);
    } else if (e.key === '.') {
      insert('.');
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      evaluateExpression();
    } else if (e.key === 'Backspace') {
      backspace();
    } else if (e.key === 'Escape') {
      clearAll();
    } else if (['+', '-', '*', '/', '(', ')'].includes(e.key)) {
      const map = { '*': '×', '/': '÷', '-': '−', '+': '+' };
      insert(map[e.key] || e.key);
    }
  });

  updateDisplay();
})();

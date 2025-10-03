
    // 1. klasyczna function
    function square(num) {
      if (typeof num !== 'number' || isNaN(num)) return NaN;
      return num * num;
    }

    document.getElementById('btnSquare').addEventListener('click', () => {
      const val = Number(document.getElementById('numSquare').value);
      const out = document.getElementById('outSquare');
      if (isNaN(val)) {
        out.textContent = 'Podaj prawidłową liczbę.';
        return;
      }
      const result = square(val);
      out.textContent = `Kwadrat liczby ${val} to ${result}.`;
    });

    // 2. const + function
    const greet = function(name) {
      if (!name || typeof name !== 'string') return 'Nie podano imienia.';
      return `Cześć, ${name}! Miło Cię widzieć.`;
    }

    document.getElementById('btnGreet').addEventListener('click', () => {
      const name = document.getElementById('nameGreet').value.trim();
      const out = document.getElementById('outGreet');
      out.textContent = greet(name);
    });

export function setupSearch() {
    const input = document.getElementById('inputSearch');
    input.addEventListener('input', () => {
      const term = input.value.toLowerCase();
      const cards = document.querySelectorAll('.product-card');
  
      cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(term) ? 'block' : 'none';
      });
    });
  }
  
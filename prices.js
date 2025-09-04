document.addEventListener('DOMContentLoaded', () => {
  // Default discount is 15%
  const DEFAULT_DISCOUNT = 0.15;

  // Allow per-page override via <script src="prices.js" data-discount="0.15"></script>
  const currentScript = Array.from(document.getElementsByTagName('script'))
    .find(s => s.src && s.src.includes('prices.js'));
  let discount = DEFAULT_DISCOUNT;
  if (currentScript && currentScript.dataset && currentScript.dataset.discount) {
    const d = parseFloat(currentScript.dataset.discount);
    if (!isNaN(d) && d >= 0 && d <= 1) {
      discount = d;
    }
  }

  // Helpers to parse and format currency in the site's style: "D$ 123,45"
  function parseDSPrice(text) {
    if (!text) return null;
    // Keep digits, comma and dot, then normalize: remove dots (thousands), replace comma with dot
    const cleaned = text
      .replace(/[^0-9.,]/g, '')
      .replace(/\./g, '')
      .replace(/,/g, '.');
    const value = parseFloat(cleaned);
    return isNaN(value) ? null : value;
  }

  function formatDSPrice(value) {
    // Ensure two decimals, Brazilian style with comma
    const fixed = value.toFixed(2);
    const [intPart, decPart] = fixed.split('.');
    // Insert thousands separator as dot
    const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `D$ ${withThousands},${decPart}`;
  }

  const nodes = document.querySelectorAll('.price');
  nodes.forEach(node => {
    const originalText = node.textContent || '';
    const originalValue = parseDSPrice(originalText);
    if (originalValue === null) return;

    const discounted = originalValue * (1 - discount);
    node.textContent = formatDSPrice(discounted);
  });
});

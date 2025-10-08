(function () {
  const THEME_ENDPOINT = 'http://127.0.0.1:3845/mcp';

  function applyCssVariables(variables) {
    if (!variables || typeof variables !== 'object') return;

    Object.entries(variables).forEach(([name, value]) => {
      if (typeof value === 'string' && name.startsWith('--')) {
        document.documentElement.style.setProperty(name, value);
      }
    });
  }

  async function loadRemoteTheme() {
    try {
      const response = await fetch(THEME_ENDPOINT, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Theme endpoint responded with ${response.status}`);
        return;
      }

      const payload = await response.json();
      const possibleSources = [
        payload.cssVariables,
        payload.theme?.cssVariables,
        payload.theme?.variables,
        payload.theme,
      ];

      possibleSources.forEach(applyCssVariables);

      if (payload.typography?.fontFamily) {
        document.body.style.setProperty(
          'font-family',
          `${payload.typography.fontFamily}, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif`,
        );
      }
    } catch (error) {
      console.warn('Unable to load remote theme from MCP server:', error);
    }
  }

  loadRemoteTheme();

  const controls = document.querySelector('.controls');
  if (!controls) {
    return;
  }

  const buttons = Array.from(controls.querySelectorAll('button'));
  if (!buttons.length) {
    return;
  }

  const rows = Array.from(document.querySelectorAll('tbody tr')).map((row) => {
    const cells = Array.from(row.querySelectorAll('td[data-confidence-level]')).map((cell) => {
      const badge = cell.querySelector('.confidence-badge');
      return {
        badge,
        scoreSpan: badge?.querySelector('.confidence-score'),
        valueSpan: badge?.querySelector('.cell-value'),
        level: cell.dataset.confidenceLevel,
        scoreText: cell.dataset.confidenceScore,
        valueText: cell.dataset.valueText,
      };
    });

    return {
      row,
      overallLevel: row.dataset.rowConfidence,
      cells,
    };
  });

  function applyBadgeState(badge, variant) {
    if (!badge) return;
    badge.classList.remove('confidence-high', 'confidence-medium', 'confidence-low', 'confidence-none');
    badge.classList.add(`confidence-${variant}`);
  }

  function setActiveButton(activeButton) {
    buttons.forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function updateConfidence(filter) {
    rows.forEach(({ row, overallLevel, cells }) => {
      const shouldShow = filter === 'all' || filter === 'none' || overallLevel === filter;

      row.hidden = !shouldShow;
      row.setAttribute('aria-hidden', String(!shouldShow));

      cells.forEach(({ badge, scoreSpan, valueSpan, level, scoreText, valueText }) => {
        if (!badge || !scoreSpan || !valueSpan) {
          return;
        }

        if (filter === 'none') {
          applyBadgeState(badge, 'none');
          scoreSpan.textContent = '';
          scoreSpan.hidden = true;
        } else {
          applyBadgeState(badge, level);
          scoreSpan.textContent = scoreText;
          scoreSpan.hidden = false;
        }

        badge.classList.toggle('no-score-active', filter === 'none');
        valueSpan.textContent = valueText;
      });
    });
  }

  controls.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || !buttons.includes(button)) {
      return;
    }

    setActiveButton(button);
    updateConfidence(button.dataset.filter);
  });

  updateConfidence('all');
})();

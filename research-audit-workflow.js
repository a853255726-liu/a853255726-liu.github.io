const tabList = document.querySelector('.step-tabs');
const tabs = [...tabList.querySelectorAll('button')];
const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));

function showStep(activeIndex, moveFocus = false) {
  for (const [index, tab] of tabs.entries()) {
    const active = index === activeIndex;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    panels[index].hidden = !active;
  }
  if (moveFocus) tabs[activeIndex].focus();
}

tabList.setAttribute('role', 'tablist');
for (const [index, tab] of tabs.entries()) {
  tab.setAttribute('role', 'tab');
  const panel = panels[index];
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', tab.id);
  panel.tabIndex = 0;

  tab.addEventListener('click', () => showStep(index));
  tab.addEventListener('keydown', event => {
    const destinations = {
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!Object.hasOwn(destinations, event.key)) return;
    event.preventDefault();
    showStep(destinations[event.key], true);
  });
}

const linkedStep = panels.findIndex(panel => location.hash === '#' + panel.id);
showStep(linkedStep === -1 ? tabs.length - 1 : linkedStep);
tabList.hidden = false;

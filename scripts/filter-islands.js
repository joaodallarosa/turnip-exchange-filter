(function (config) {
  if (!config.config) return;

  const turnipValue = config.config.turnipValue;
  const people = config.config.people;

  filterIslands(turnipValue, people);

  return {
    ok: (ok = true), ok
  };

})(config);

function filterIslands(turnipValue, people) {
  var islandList = document.querySelectorAll('p.ml-2');
  for (let i = 0; i < islandList.length; i++) {
    const island = islandList[i];
    var bells = parseInt(island.innerText);
    if (bells < turnipValue) {
      island.parentElement.parentElement.parentElement.style.display = 'none';
    }
    var waiting = 0;
    waiting = parseInt(island.parentElement.parentElement.nextElementSibling.nextElementSibling.querySelector('p').innerText.split(':')[1].split('/')[0]);
    if (waiting > people) {
      island.parentElement.parentElement.parentElement.style.display = 'none';
    }
  }
  return;
}


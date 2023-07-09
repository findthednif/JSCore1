const searchLine = document.querySelector(".input__searchLine");
const autocomplite = document.querySelector(".input__autocompleete");
const repoList = document.querySelector('.app__repoList');
let repositories;
let timeOutId;
searchLine.addEventListener("keyup", async (event) => {
  clearTimeout(timeOutId);
  timeOutId = setTimeout(async () => {
    if (event.target.value.trim() === "") {
      autocomplite.textContent = "";
      autocomplite.classList.remove('input__autocompleete--active');
      return;
    }
    const response = await fetch(`https://api.github.com/search/repositories?q=${event.target.value}`);
    if (response.status === 200) {
      console.log('response received');
      autocomplite.classList.add('input__autocompleete--active');
      repositories = await response.json();
      autocomplite.textContent = "";
      repositories.items.slice(0, 5).forEach(repo => {
        autocomplite.insertAdjacentHTML("beforeend", `<li class="autocompleete__elem">${repo.name}</li>`);
      });
    }
  }, 500);
});
autocomplite.addEventListener('click', (event) => {
  if (event.target.classList.contains('autocompleete__elem')) {
    autocomplite.textContent = "";
    autocomplite.classList.remove('input__autocompleete--active');
    searchLine.value = '';
    const selectedRepoName = event.target.textContent;
    repoList.insertAdjacentHTML('beforeend', `<li class="repoList__elem">
      <div>Name: ${selectedRepoName}</div>
      <div>Owner: ${repositories.items.find(repo => repo.name === selectedRepoName).owner.login}</div>
      <div>Stars: ${repositories.items.find(repo => repo.name === selectedRepoName).stargazers_count}</div>
      <button class="removeBtn">Delete</button>
    </li>`);
  }
});
repoList.addEventListener("click", (event) => {
  if (event.target.classList.contains("removeBtn")) {
    const repoItem = event.target.closest(".repoList__elem");
    repoItem.remove();
  }
});

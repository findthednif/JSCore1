const searchLine = document.querySelector(".input__searchLine");
const autocomplite = document.querySelector(".input__autocompleete");
const repoList = document.querySelector('.app__repoList');
let repositories;
function debounce (fn, debounceTime) {
  let delay;
  return function(...args){
    clearTimeout(delay);
    delay = setTimeout(()=>{
      fn.apply(this, args)
    }, debounceTime)
  }
};
async function getRepositories(key) {
  try {
    let response = await fetch(`https://api.github.com/search/repositories?q=${key}`);
    if (!response.ok) {
      throw new Error(`Server response failed. Error status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch repositories: ${error.message}`);
  }
}
async function createAutoComplite(searchValue){
  {
    autocomplite.classList.add('input__autocompleete--active');
    repositories = await getRepositories(searchValue);
    autocomplite.textContent = "";
    repositories.items.slice(0, 5).forEach(repo => {
      autocomplite.insertAdjacentHTML("beforeend", `<li class="autocompleete__elem">${repo.name}</li>`);
    });
  }
}
const debouncedAutoComplete = debounce(async (value) => {
  if (value.trim() === "") {
    autocomplite.textContent = "";
    autocomplite.classList.remove('input__autocompleete--active');
    return;
  }
  await createAutoComplite(value);
}, 500);

searchLine.addEventListener("keyup", (event) => {
  debouncedAutoComplete(event.target.value);
});
autocomplite.addEventListener('click', (event) => {
  if (event.target.classList.contains('autocompleete__elem')) {
    autocomplite.textContent = "";
    autocomplite.classList.remove('input__autocompleete--active');
    searchLine.value = '';
    const selectedRepoName = event.target.textContent;
    const repoData = repositories.items.find(repo => repo.name === selectedRepoName);
    repoList.insertAdjacentHTML('beforeend', `<li class="repoList__elem">
      <div>Name: ${selectedRepoName}</div>
      <div>Owner: ${repoData.owner.login}</div>
      <div>Stars: ${repoData.stargazers_count}</div>
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

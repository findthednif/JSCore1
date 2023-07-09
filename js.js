const searchLine = document.querySelector(".input__searchLine");
const autocomplite = document.querySelector(".input__autocompleete");
const repoList = document.querySelector('.app__repoList')
let timeOutId;
searchLine.addEventListener("keyup", async (event) => {
  clearTimeout(timeOutId);
  timeOutId = setTimeout(async ()=> {
    if (event.target.value.trim() === "") {
      autocomplite.textContent = "";
      autocomplite.classList.remove('input__autocompleete--active');
      return;
    }
    let responce = await fetch(
      `https://api.github.com/search/repositories?q=${event.target.value}`
    );
    if(responce.ok)
      autocomplite.classList.add('input__autocompleete--active')
      const repositories = await responce.json();
      autocomplite.textContent = "";
      repositories.items.slice(0, 5).forEach(repo => {
        autocomplite.insertAdjacentHTML("beforeend",`<li class="autocompleete__elem">${repo.name}</li>`);
      });
      autocomplite.addEventListener('click', (event)=>{
        if (event.target.classList.contains('autocompleete__elem')){
            autocomplite.textContent = "";
            autocomplite.classList.remove('input__autocompleete--active');
            searchLine.value = '';
            const selectedRepoName = event.target.textContent;
            const selectedRepo = repositories.items.find(repo => repo.name === selectedRepoName);
            repoList.insertAdjacentHTML('beforeend', `<li class="repoList__elem"
            <div>Name: ${selectedRepoName}</div>
            <div>Owner: ${selectedRepo.owner.login}</div>
            <div>Stars: ${selectedRepo.stargazers_count}</div>
            <button class="removeBtn">Delete</button>`)
        }
            repoList.addEventListener("click", (event) => {
                if (event.target.classList.contains("removeBtn")) {
                const repoItem = event.target.closest(".repoList__elem");
                repoItem.remove();
                }
            });
      })
  }, 500)
});

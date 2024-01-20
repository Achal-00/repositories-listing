const BASE_URL = "https://api.github.com/users/";

let repoCount = 0;
let username = "github";
let perPage = 10;
let currentPage = 1;

var activities = document.getElementById("repository-count");

activities.addEventListener("change", function () {
  switch (activities.value) {
    case "10":
      perPage = 10;
      fetchRepo();
      break;
    case "25":
      perPage = 25;
      fetchRepo();
      break;
    case "50":
      perPage = 50;
      fetchRepo();
      break;
    case "75":
      perPage = 75;
      fetchRepo();
      break;
    case "100":
      perPage = 100;
      fetchRepo();
      break;
    default:
      break;
  }
});

// Initial Fetchng

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    document.querySelector(".overlay").style.display = "flex";
    const response = await fetch(`${BASE_URL}${username}`);
    const data = await response.json();
    repoCount = data.public_repos;
    displayUser(data);
    fetchRepo();
    document.querySelector(".overlay").style.display = "none";
  },
  false
);

// Fetching onSubmit

const onSubmit = async (event) => {
  event.preventDefault();
  document.querySelector(".overlay").style.display = "flex";
  username = document.getElementById("username").value;

  const response = await fetch(`${BASE_URL}${username}`);

  if (response.ok) {
    document
      .querySelector(".search-bar")
      .style.setProperty("--error-disp", "none");
    const data = await response.json();
    repoCount = data.public_repos;
    displayUser(data);
    fetchRepo();
  } else {
    document
      .querySelector(".search-bar")
      .style.setProperty("--error-disp", "block");
  }
  document.querySelector(".overlay").style.display = "none";
};

// Display user details

const displayUser = (data) => {
  document
    .querySelector(".avatar-holder img")
    .setAttribute("src", data.avatar_url);
  document.querySelector(".user-main__info h1").innerText = data.name;
  document.querySelector(".user-main__info p").innerText = data.bio;

  document.querySelector(".user-location span:nth-child(3)").innerText =
    data.location;
  document.querySelector(".user-repo span:nth-child(3)").innerText =
    data.public_repos;
  document.querySelector(".user-follower span:nth-child(3)").innerText =
    data.followers;

  if (data.twitter_username) {
    document.querySelector(".twitter").style.display = "flex";
    document
      .querySelector(".twitter a")
      .setAttribute("href", `https://twitter.com/${data.twitter_username}`);
    document.querySelector(
      ".twitter a"
    ).innerText = `twitter.com/${data.twitter_username}`;
  } else {
    document.querySelector(".twitter").style.display = "none";
  }

  if (data.blog) {
    document.querySelector(".blog").style.display = "flex";
    document.querySelector(".blog a").setAttribute("href", data.blog);
    document.querySelector(".blog a").innerText = data.blog;
  } else {
    document.querySelector(".blog").style.display = "none";
  }
};

// Fetching rhe repository

const fetchRepo = async (action) => {
  const repositoriesClass = document.querySelector(".repositories");
  repositoriesClass.innerHTML = "";
  document.querySelector(".repo-overlay").style.display = "flex";
  document.querySelector(".pagination").style.display = "none";
  if (action === "prev" && currentPage > 1) {
    currentPage--;
  } else if (action === "next") {
    currentPage++;
  }

  const response = await fetch(
    `${BASE_URL}${username}/repos?per_page=${perPage}&page=${currentPage}`,
    {
      headers: {
        Accept: "application/vnd.github.mercy-preview+json",
      },
    }
  );
  const data = await response.json();
  displayRepo(data);
  updatePagination();
  document.querySelector(".repo-overlay").style.display = "none";
  document.querySelector(".pagination").style.display = "flex";
};

// Display the repositories

const displayRepo = (repositories) => {
  const repositoriesClass = document.querySelector(".repositories");
  repositoriesClass.innerHTML = "";

  repositories.forEach((repo) => {
    const repoElement = document.createElement("div");
    const heading = document.createElement("h1");
    const desc = document.createElement("p");
    const topicContainer = document.createElement("div");
    const extraInfo = document.createElement("div");
    const starCount = document.createElement("div");
    const forkCount = document.createElement("div");
    const starIcon = document.createElement("img");
    const starNo = document.createElement("p");
    const forkIcon = document.createElement("img");
    const forkNo = document.createElement("p");
    extraInfo.className = "extra-info";
    heading.textContent = repo.name;
    desc.textContent = repo.description;
    starIcon.src = "./assets/star-icon.svg";
    starNo.textContent = repo.stargazers_count;
    forkIcon.src = "./assets/fork-icon.svg";
    forkNo.textContent = repo.forks_count;

    repo.topics.forEach((item) => {
      const topic = document.createElement("span");
      topic.textContent = item;
      topicContainer.appendChild(topic);
    });

    starCount.appendChild(starIcon);
    starCount.appendChild(starNo);
    forkCount.appendChild(forkIcon);
    forkCount.appendChild(forkNo);

    extraInfo.appendChild(starCount);
    extraInfo.appendChild(forkCount);

    repoElement.appendChild(heading);
    repoElement.appendChild(desc);
    repoElement.appendChild(topicContainer);
    repoElement.appendChild(extraInfo);
    repositoriesClass.appendChild(repoElement);

    repoElement.addEventListener("click", () => {
      window.open(repo.html_url);
    });
  });
};

// Update pagination

const updatePagination = () => {
  const paginationNumbersDiv = document.querySelector(".pagination-numbers");
  paginationNumbersDiv.innerHTML = "";

  const totalPages = Math.ceil(repoCount / perPage);
  const maxButtons = 5;
  const halfMaxButtons = Math.floor(maxButtons / 2);

  let startPage = Math.max(1, currentPage - halfMaxButtons);
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  const previousButton = createPaginationButton("Previous", () => {
    if (currentPage > 1) {
      currentPage--;
      fetchRepo();
    }
  });
  paginationNumbersDiv.appendChild(previousButton);

  for (let i = startPage; i <= endPage; i++) {
    const pageNumberButton = createPaginationButton(i, () => {
      currentPage = i;
      fetchRepo();
    });
    paginationNumbersDiv.appendChild(pageNumberButton);
  }

  const nextButton = createPaginationButton("Next", () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchRepo();
    }
  });
  paginationNumbersDiv.appendChild(nextButton);

  function createPaginationButton(label, onClick) {
    const button = document.createElement("button");
    button.textContent = label;
    button.onclick = onClick;
    return button;
  }
};

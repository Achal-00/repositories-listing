const BASE_URL = "https://api.github.com/users/";

// document.addEventListener(
//   "DOMContentLoaded",
//   async () => {
//     const response = await fetch(`${BASE_URL}github`, {
//       headers: {
//         Authorization: "token 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",
//       },
//     });
//     const data = await response.json();
//     displayUser(data);
//   },
//   false
// );

const onSubmit = async (event) => {
  event.preventDefault();
  document.querySelector(".overlay").style.display = "flex";
  let username = document.getElementById("username").value;

  const response = await fetch(`${BASE_URL}${username}`, {
    headers: {
      Authorization: "token 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",
    },
  });

  if (response.ok) {
    document
      .querySelector(".search-bar")
      .style.setProperty("--error-disp", "none");
    const data = await response.json();
    displayUser(data);
    displayRes(username);
  } else {
    document
      .querySelector(".search-bar")
      .style.setProperty("--error-disp", "block");
  }
  document.querySelector(".overlay").style.display = "none";
};

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
    document
      .querySelector(".blog a")
      .setAttribute("href", `https://${data.blog}`);
    document.querySelector(".blog a").innerText = data.blog;
  } else {
    document.querySelector(".blog").style.display = "none";
  }
};

const displayRes = (user) => {
  const username = user;
  let perPage = 10;
  let currentPage = 1;

  const fetchRepo = async (action) => {
    if (action === "prev" && currentPage > 1) {
      currentPage--;
    } else if (action === "next") {
      currentPage++;
    }

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}`,
      {
        headers: {
          Accept: "application/vnd.github.mercy-preview+json",
          Authorization: "token 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",
        },
      }
    );
    const data = await response.json();
    displayRepo(data);
    updatePagination(data.length);
  };

  const displayRepo = (repositories) => {
    const repositoriesClass = document.querySelector(".repositories");
    repositoriesClass.innerHTML = "";

    repositories.forEach((repo) => {
      const repoElement = document.createElement("div");
      const heading = document.createElement("h1");
      const desc = document.createElement("p");
      const topicContainer = document.createElement("div");
      heading.textContent = repo.name;
      desc.textContent = repo.description;

      repo.topics.forEach((item) => {
        const topic = document.createElement("span");
        topic.textContent = item;
        topicContainer.appendChild(topic);
      });

      repoElement.appendChild(heading);
      repoElement.appendChild(desc);
      repoElement.appendChild(topicContainer);
      repositoriesClass.appendChild(repoElement);
    });
  };

  const updatePagination = (repoCount) => {
    const paginationNumbersDiv = document.querySelector(".pagination-numbers");
    paginationNumbersDiv.innerHTML = "";

    const totalPages = Math.ceil(repoCount / perPage); // 9
    const maxButtons = 5;
    const halfMaxButtons = Math.floor(maxButtons / 2); // 2

    let startPage = Math.max(1, currentPage - halfMaxButtons); // 1
    let endPage = Math.min(totalPages, startPage + maxButtons - 1); // 5

    if (endPage - startPage < maxButtons - 1) {
      // false
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    console.log(startPage, endPage);

    // Previous button
    const previousButton = createPaginationButton("Previous", () => {
      if (currentPage > 1) {
        currentPage--;
        fetchRepo();
      }
    });
    paginationNumbersDiv.appendChild(previousButton);

    // Numbered buttons
    for (let i = startPage; i <= endPage; i++) {
      const pageNumberButton = createPaginationButton(i, () => {
        currentPage = i;
        fetchRepo();
      });
      paginationNumbersDiv.appendChild(pageNumberButton);
    }

    // Next button
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

    // const previousButton = document.createElement("button");
    // previousButton.textContent = "Previous";
    // previousButton.onclick = () => fetchRepo("prev");
    // paginationNumbersDiv.appendChild(previousButton);

    // for (let i = 1; i <= currentPage + 1; i++) {
    //   const pageNumberButton = document.createElement("button");
    //   pageNumberButton.textContent = i;
    //   pageNumberButton.onclick = () => {
    //     currentPage = i;
    //     fetchRepo();
    //   };
    //   paginationNumbersDiv.appendChild(pageNumberButton);
    // }

    // const nextButton = document.createElement("button");
    // nextButton.textContent = "Next";
    // nextButton.onclick = () => fetchRepo("next");
    // paginationNumbersDiv.appendChild(nextButton);
  };

  fetchRepo();
};

// const username = "achal-00";
// const perPage = 10;
// let currentPage = 1;

// function fetchPage(action) {
//   if (action === "prev" && currentPage > 1) {
//     currentPage--;
//   } else if (action === "next") {
//     currentPage++;
//   }

//   const url = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}`;

//   fetch(url, {
//     headers: {
//       Accept: "application/vnd.github.v3+json",
//       Authorization: "token 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",
//     },
//   })
//     .then((response) => response.json())
//     .then((repositories) => {
//       console.log(repositories);
//       displayRepositories(repositories);
//       updatePagination();
//     })
//     .catch((error) => console.error("Error fetching repositories:", error));
// }

// function updatePagination() {
//   const paginationNumbersDiv = document.getElementById("paginationNumbers");
//   paginationNumbersDiv.innerHTML = "";

//   // Add Previous button
//   const previousButton = document.createElement("button");
//   previousButton.textContent = "Previous";
//   previousButton.onclick = () => fetchPage("prev");
//   paginationNumbersDiv.appendChild(previousButton);

//   // Add numbered buttons
//   for (let i = 1; i <= currentPage + 2; i++) {
//     const pageNumberButton = document.createElement("button");
//     pageNumberButton.textContent = i;
//     pageNumberButton.onclick = () => fetchPage(i);
//     paginationNumbersDiv.appendChild(pageNumberButton);
//   }

//   // Add Next button
//   const nextButton = document.createElement("button");
//   nextButton.textContent = "Next";
//   nextButton.onclick = () => fetchPage("next");
//   paginationNumbersDiv.appendChild(nextButton);
// }

// function displayRepositories(repositories) {
//   const repositoriesDiv = document.getElementById("repositories");

//   repositoriesDiv.innerHTML = ""; // Clear previous content

//   repositories.forEach((repo) => {
//     const repoElement = document.createElement("div");
//     repoElement.textContent = repo.name;
//     repositoriesDiv.appendChild(repoElement);
//   });
// }

// // Initial fetch
// fetchPage();

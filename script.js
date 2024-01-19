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
//     displayRes(data);
//   },
//   false
// );

const onSubmit = async (event) => {
  event.preventDefault();
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
    displayRes(data);
  } else {
    document
      .querySelector(".search-bar")
      .style.setProperty("--error-disp", "block");
  }
};

const displayRes = (data) => {
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

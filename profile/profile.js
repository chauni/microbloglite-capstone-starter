const postBtnEl = document.getElementById(`postBtn`);
const createPostInputEl = document.getElementById(`createPostInput`);
const logoutBtn = document.getElementById("logoutBtn");
const displayPostsDivEl = document.getElementById(`DisplayPostsDivs`);
const postDisplayEl = document.getElementById(`postDisplay`);
const userAccount = document.getElementById("userAccount");
const userInfo = document.getElementById("userInfo");
const usernamePosts = document.getElementById("usernamePosts");
const editBtn = document.getElementById("editBtn");
const userBio = document.getElementById(`userBio`);
const loginData = getLoginData();
const bioDiv = document.querySelector(`.bioDiv`);
const doneBtn = document.getElementById(`doneBtn`);
const bioText = document.getElementById(`bioText`);

fetch(`https://microbloglite.herokuapp.com/api/users/${loginData.username}`,{
      method: `GET`,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${loginData.token}`,
      }
    }).then((response) => response.json()) .then(bio =>{
      userBio.innerHTML = bio.bio
    })

editBtn.addEventListener("click", () => {
  userBio.style.display = `none`;
  editBtn.style.display = `none`;
  bioDiv.style.display = `block`;
  bioText.style.display = `flex`;
  doneBtn.style.display = `flex`;

  doneBtn.addEventListener("click", () => {
    fetch(
      `https://microbloglite.herokuapp.com/api/users/${loginData.username}`,
      {
        method: `PUT`,
        body: JSON.stringify({
          bio: bioText.value,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${loginData.token}`,
        },
      }
    );
    userBio.style.display = `flex`;
    editBtn.style.display = `flex`;
    bioDiv.style.display = `none`;
    bioText.style.display = `none`;
    doneBtn.style.display = `none`;

    fetch(`https://microbloglite.herokuapp.com/api/users/${loginData.username}`,{
      method: `GET`,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${loginData.token}`,
      }
    }).then((response) => response.json()) .then(bio =>{
      userBio.innerHTML = bio.bio
    })
  });
});

//------------------------------------------------------------------
logoutBtn.addEventListener("click", () => {
  logout();
});

window.onload = getPosts;

//------------------------------------------------------------------
postBtnEl.addEventListener(`click`, (e) => {
  //console.log(`click`); works
  //console.log(createPostInputEl.value);
  e.preventDefault();
  const options = {
    method: "POST",
    body: JSON.stringify({
      text: createPostInputEl.value,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${loginData.token}`,
    },
  };

  const url = `https://microbloglite.herokuapp.com/api/posts`;
  fetch(url, options)
    .then((response) => response.json())
    .then((posts) => {
      console.log(posts);
    });
  getPosts();
  // window.location.assign(`profile.html`);
});
//----------------------------------------------------------------------------------

function getPosts() {
  const userNameUrl = `https://microbloglite.herokuapp.com/api/posts?limit=100&offset=0&username=${loginData.username}`;
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  };
  fetch(userNameUrl, options)
    .then((response) => response.json())
    .then((data) => {
      userAccount.innerHTML = loginData.username;

      userInfo.innerHTML = `${loginData.username}'s Profile`;

      usernamePosts.innerHTML = `${loginData.username}'s Posts`;

      usernamePosts.innerHTML = `${loginData.username}'s Posts`

      let template;

      template = document.getElementById("postDisplay");

      data.forEach((post) => {
        if ("content" in document.createElement("template")) {
          const postEl = template.content.cloneNode(true);

          const username = postEl.querySelector("h3");
          username.textContent = post.username;

          const postText = postEl.querySelector("p");
          postText.textContent = post.text;

          const timeStamp = postEl.querySelector("small");
          timeStamp.textContent = new Date(post.createdAt).toLocaleString();

          const trashBtnEl = postEl.getElementById(`trashBtn`);

          const deleteBtnEl = postEl.getElementById("deleteBtn");

          deleteBtnEl.addEventListener("click", () => {

            console.log('post deleted?')
            fetch(`https://microbloglite.herokuapp.com/api/posts/${post._id}`, {
              method: "DELETE",

              headers: {
                Authorization: `Bearer ${loginData.token}`,
                "Content-type": "application/json; charset=utf-8",
              },
            });
            window.location.reload();
          });
          //--------------------------------------------------------------------
          const likeBtn = postEl.querySelector("a");

          likeBtn.addEventListener("click", (e) => {
            e.preventDefault();

            console.log(post._id);
            const heartIcon = likeBtn.querySelector(".heartIcon");
            const filledHeartIcon = likeBtn.querySelector(".filledHeartIcon");

            heartIcon.style.display = "none";
            filledHeartIcon.style.display = "flex";

            const options = {
              method: "POST",
              body: JSON.stringify({
                postId: post._id,
              }),
              headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${loginData.token}`,
              },
            };
            fetch(`https://microbloglite.herokuapp.com/api/likes`, options);
          });

          displayPostsDiv.appendChild(postEl);
        }
      });
    });
}
//------------------------------------------------------------------------------------------

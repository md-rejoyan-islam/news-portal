const bodyHeader = document.getElementById("body-header");
const navItem = document.getElementById("nav-item");
const category_post = document.getElementById("category_post");
const modal_content = document.getElementById("modal_content");
const foundItem = document.getElementById("foundItem");

// fetch category API
fetch("https://openapi.programming-hero.com/api/news/categories")
  .then((res) => res.json())
  .then((data) => headerNav(data.data.news_category))
  .catch((error) => console.log(error));

//  category item showing function
function headerNav(data) {
  data.forEach((element) => {
    const li = document.createElement("li");
    li.classList.add("nav-item");
    li.innerHTML = `
        <a class="nav-link active"  href="#" categoryNameClass='${element.category_name}' onclick="single_category_post(${element.category_id})">${element.category_name}</a>
        `;
    navItem.appendChild(li);
  });
}

//single category posts showing function
function single_category_post(index = url) {
  loadSpinner(true);
  const url = `https://openapi.programming-hero.com/api/news/category/0${index}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => show_post(data, index))
    .catch((error) => console.log(error));
}

//default category set function
const firstLookItem = () => {
  fetch("https://openapi.programming-hero.com/api/news/category/01")
    .then((res) => res.json())
    .then((data) => show_post(data, (index = 1)))
    .catch((error) => console.log(error));
};

firstLookItem();

//categories name showing function

//find categories name
let newsCategoriesName = "Breaking News";
navItem.onclick = (e) => {
  if (e.target.hasAttribute("categoryNameClass")) {
    const tag = e.target.getAttribute("categoryNameClass");
    newsCategoriesName = tag;
  }
};

const categoriesName = async (index) => {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/news/category/0${index}`
    );
    const data = await res.json();

    foundItem.innerHTML = `<p class="bg-white p-4 rounded-2 ">${data.data.length} items found for category ${newsCategoriesName}</p>`;
  } catch (error) {
    console.log(error);
  }
};
//invoke categoriesName function
categoriesName();

// post showing function
function show_post(value, index) {
  const data = value.data;
  categoriesName(index);
  category_post.innerHTML = "";
  // sorting by view property
  data.sort((a, b) => {
    return b.total_view - a.total_view;
  });
  //data iterate
  data.forEach((element) => {
    const div = document.createElement("div");
    div.classList.add("card", "mb-3", "col-lg-12", "p-2", "shadow");
    div.innerHTML = `
        <div class="row g-0" >
        <div class="col-lg-2">
      <img src="${
        element.thumbnail_url
      }" class="img-thumbnail w-100  rounded-start" alt="">
    </div>
    <div class="col-lg-10">
      <div class="card-body">
        <h5 class="card-title fw-bold p-2">${element.title}</h5>
        <p class="card-text text-secondary p-2">${element.details
          .substring(0, 500)
          .concat(" ...")}</p>  
        <div class="d-flex justify-content-between">
        <div class='d-flex align-items-center'>
        <div>
        <img src="${element.author.img}" style="width:60px;border-radius:50%">
        </div>
        <div class='px-3'>
        <span>${element.author.name || "Not Found"}</span> <br>
        <span>${element.author.published_date || "Not Found"} </span>
        </div>
        </div>
        <div class='pt-3'>
        <i class="fa-solid fa-eye"></i>
        <span>${element.total_view || "Not Found"}</span>
        </div>
        <div class='pt-3'>
        <i class="fa-solid fa-star-half-stroke"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>
        </div>
        <div class='pt-3'>
        <a href="#modalId" data-bs-toggle="modal"><i class="fa-solid fa-arrow-right" onclick="single_post_show('${
          element._id
        }')"></i></a>
        </div>
        </div>
      </div>
    </div>
    </div>
        `;
    category_post.appendChild(div);
    loadSpinner(false);
  });
}

function single_post_show(data) {
  url = `https://openapi.programming-hero.com/api/news/${data}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => show_modal(data.data[0]));
}

//show modal
function show_modal(data) {
  modal_content.innerHTML = `
        <div class="modal-header">
                        <h4 class="modal-title fw-bold">${data.title}</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <img src="${data.thumbnail_url}" class='w-100 h-50 '>
                        <p class='pt-4 text-secondary'>${data.details}</p>
                        <p><span class='fw-bold'>View : </span> ${data.total_view || 'Not Found'}</p>
                        <p> <span class='fw-bold'> Author :</span> ${data.author.name}</p>
                        <p> <span class='fw-bold'> Published Date : </span> ${data.author.published_date}</p>
                        <br>
                    </div>
                    <div class="modal-footer m-0 p-0">
                        <button type="button" class="btn btn-primary w-100" data-bs-dismiss="modal">Close</button>
                    </div>
        `;
}

//spinner function
const loadSpinner = (running) => {
  const spinner = document.getElementById("spinner");
  if (running === true) {
    spinner.classList.remove("d-none");
  } else {
    spinner.classList.add("d-none");
  }
};

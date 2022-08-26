"use strict";

let sorted = false;
let deleteBtn;
class Cat {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  constructor(coords, color, race, photo, comment) {
    this.coords = coords; //[lat, lng]
    this.color = color; //form select
    this.race = race; //form select
    this.photo = photo; //form select
    this.comment = comment; //form select
    this._setDescription();
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.color[0].toUpperCase() + this.color.slice(1)} ${
      this.race ? this.race : "cat"
    } spotted on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()} at ${this.date.getHours()}:${String(
      this.date.getMinutes()
    ).padStart(2, 0)}`;
  }
}

//test
// const test = new Cat([12], "grey", "mixed", "photo", 12);

// console.log(test);
// //////////////////////////////////////////////
// APPLICATION ARCHITECTURE

// DOM
const btnExpand = document.querySelector(".btn_expand");
const btnShrink = document.querySelector(".btn_shrink");
const asideContent = document.querySelector(".aside_content");

const newCatFormContainer = document.querySelector(".add_cat");
const newCatFormBtnClose = document.querySelector(".add_cat_close");
const newCatFormBtnSubmit = document.querySelector(".submit_cat");
const newCatColor = document.querySelector(".color_cat");
const newCatRace = document.querySelector(".cat_race");
const newCatPhoto = document.querySelector(".cat_image");
const newCatComment = document.querySelector(".cat_details");

const filterCatsContainer = document.querySelector(".filters");
const filterBtn = document.querySelector(".btn_save_filter");
const filterDate = document.querySelector(".filters_input_date");
const filterColor = document.querySelector(".filters_input_color");
const filterRace = document.querySelector(".filters_input_race");
const filterResults = document.querySelector(".filter_results");
const mapArea = document.querySelector(".map");

const recentCats = document.querySelector(".recent_cats");
const sideAct = document.querySelector(".side_actions");
const asideAct = document.querySelector(".aside_form");
const catRow = document.querySelector(".recent_cats__row");

// let delBtn;

class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;

  constructor() {
    this.cats = [];
    // 1. Get user position
    this._getPosition();
    // 2. Get data from local storage
    this._getLocalStorage();
    // 3. Attach event handlers
    btnShrink.addEventListener("click", function () {
      btnExpand.classList.remove("hidden");
      btnShrink.classList.add("hidden");
      asideContent.classList.add("hidden");
      asideContent.classList.add("hidden");
    });

    btnExpand.addEventListener("click", function () {
      btnExpand.classList.add("hidden");
      btnShrink.classList.remove("hidden");
      asideContent.classList.remove("hidden");
      asideContent.classList.remove("hidden");
    });

    newCatFormBtnClose.addEventListener("click", this._hideForm.bind(this));
    newCatFormBtnSubmit.addEventListener("click", this._newCat.bind(this));
    sideAct.addEventListener("click", this._moveToPopUp.bind(this));
    asideAct.addEventListener("click", this._moveFilterToPopUp.bind(this));
    filterBtn.addEventListener("click", this._sortCats.bind(this));
    // delBtn.forEach(btn =>
    //   btn.addEventListener("click", this._deleteCat.bind(this))
    // );
  }
  // ///////////////////GET POSITION
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Please activate geolocation");
        }
      );
    }
  }
  // /////////////////LOAD MAP
  _loadMap(position) {
    const {latitude} = position.coords;
    const {longitude} = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map("map").setView(coords, this.#mapZoomLevel);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    // alternative if link doesnt work
    // https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

    // Handling clicks on map
    this.#map.on("click", this._showForm.bind(this));
    // Render cats array on map
    this.cats.forEach(cat => {
      this._renderCatsMarker(cat);
    });
  }
  // ///////////////SHOW FORM
  _showForm(mapE) {
    this.#mapEvent = mapE;
    newCatFormContainer.classList.remove("hidden");
    filterCatsContainer.classList.add("hidden");
    mapArea.style.marginTop = "0";
    newCatColor.focus();
  }
  // //////////////HIDE FORM
  _hideForm() {
    newCatRace.value = newCatPhoto.value = newCatComment.value = "";
    newCatFormContainer.classList.add("hidden");
    filterCatsContainer.classList.remove("hidden");
    mapArea.style.marginTop = "-8rem";
  }
  // /////////////ADD CAT
  _newCat(e) {
    let cat;
    e.preventDefault();
    // form data

    const {lat, lng} = this.#mapEvent.latlng;
    const color = newCatColor.value;
    const race = newCatRace.value;
    const photo = newCatPhoto.value;
    const comment = newCatComment.value;
    // (coords, color, race, photo, comment)
    cat = new Cat([lat, lng], color, race, photo, comment);
    this.cats.push(cat);
    this._hideForm();
    this._renderCatsMarker(cat);
    this._renderCats(cat);

    // Set local storage
    this._setLocalStorage();
  }

  _extendPopUp() {}
  _renderCatsMarker(cat) {
    const iconWhite = L.icon({
      iconUrl: `Cat_logos/white_cat.svg`,
      iconSize: [35, 70],
      iconAnchor: [22, 94],
      popupAnchor: [0, -80],
    });
    const iconOrange = L.icon({
      iconUrl: `Cat_logos/orange_cat.svg`,
      iconSize: [35, 70],
      iconAnchor: [22, 94],
      popupAnchor: [0, -80],
    });
    const iconGrey = L.icon({
      iconUrl: `Cat_logos/gray_cat.svg`,
      iconSize: [35, 70],
      iconAnchor: [22, 94],
      popupAnchor: [0, -80],
    });
    const iconBlack = L.icon({
      iconUrl: `Cat_logos/black_cat.svg`,
      iconSize: [35, 70],
      iconAnchor: [22, 94],
      popupAnchor: [0, -80],
    });
    const iconBlackWhite = L.icon({
      iconUrl: `Cat_logos/black_white_cat.svg`,
      iconSize: [35, 70],
      iconAnchor: [22, 94],
      popupAnchor: [0, -80],
    });
    const iconOthers = L.icon({
      iconUrl: `Cat_logos/white_orange_cat.svg`,
      iconSize: [35, 70],
      iconAnchor: [22, 94],
      popupAnchor: [0, -80],
    });

    L.marker(cat.coords, {
      icon:
        cat.color === "white"
          ? iconWhite
          : cat.color === "black"
          ? iconBlack
          : cat.color === "orange"
          ? iconOrange
          : cat.color === "grey"
          ? iconGrey
          : cat.color === "black&white"
          ? iconBlackWhite
          : cat.color === "colored"
          ? iconOthers
          : "",
    })
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "",
        })
      )
      .setPopupContent(
        `${cat.description} <br> <a class="extend_popup">Click to see details</a> <br> <a class="delete_btn">Delete</a>`
      )
      .openPopup();
    // const deleteBtn = document.querySelector(".delete_btn");

    // L.DomEvent.on(deleteBtn, "click", () => {
    //   alert("toto");
    // });
    // console.log(deleteBtn);

    // deleteBtn.forEach(function (btn, i) {
    //   btn.addEventListener("click", function () {
    //     console.log(cat);
    //   });
    // });

    // .openPopup();
  }
  _sortCats(e, cats) {
    e.preventDefault();
    btnExpand.classList.add("hidden");
    btnShrink.classList.remove("hidden");
    asideContent.classList.remove("hidden");
    asideContent.classList.remove("hidden");
    this.cats.forEach(cat => console.log(cat.color));
    const whiteCats = this.cats.filter(cat => cat.color === "white");
    const blackCats = this.cats.filter(cat => cat.color === "black");
    const orangeCats = this.cats.filter(cat => cat.color === "orange");
    const greyCats = this.cats.filter(cat => cat.color === "grey");
    const blackWhiteCats = this.cats.filter(cat => cat.color === "black&white");
    const otherCats = this.cats.filter(cat => cat.color === "colored");
    const allCats = this.cats;
    let html;

    if (filterColor.value === "white") {
      sorted = true;
      html = whiteCats.map(
        cat =>
          `<p class="filtered_cat" data-id="${cat.id}">${cat.description}</p>`
      );
      console.log(whiteCats);
    } else if (filterColor.value === "black") {
      sorted = true;
      html = blackCats.map(
        cat =>
          `<p class="filtered_cat" data-id="${cat.id}">${cat.description}</p>`
      );
      console.log(blackCats);
    } else if (filterColor.value === "orange") {
      sorted = true;
      html = orangeCats.map(
        cat =>
          `<p class="filtered_cat" data-id="${cat.id}">${cat.description}</p>`
      );
      console.log(orangeCats);
    } else if (filterColor.value === "grey") {
      sorted = true;
      html = greyCats.map(
        cat =>
          `<p class="filtered_cat" data-id="${cat.id}">${cat.description}</p>`
      );
      console.log(greyCats);
    } else if (filterColor.value === "black&white") {
      sorted = true;
      html = blackWhiteCats.map(
        cat =>
          `<p class="filtered_cat" data-id="${cat.id}">${cat.description}</p>`
      );
      console.log(blackWhiteCats);
    } else if (filterColor.value === "colored") {
      sorted = true;
      html = otherCats.map(
        cat =>
          `<p class="filtered_cat" data-id="${cat.id}">${cat.description}</p>`
      );
      console.log(otherCats);
    } else {
      html = allCats.map(
        cat =>
          `<p class="filtered_cat" data-id="${cat.id}">${cat.description}</p>`
      );
    }
    html = String(html).replaceAll(",", "");
    filterResults.innerHTML = html;
  }

  _renderCats(cat) {
    const html = ` 
    <li class="recent_cat recent_cats__row" data-id="${cat.id}">${cat.description} `;
    recentCats.insertAdjacentHTML("afterend", html);
    // delBtn = document.querySelectorAll(".del_btn");
  }
  _moveToPopUp(e) {
    // console.log(e);
    const catListEl = e.target.closest(".recent_cat");
    // console.log(catListEl);
    if (!catListEl) return;
    const cat = this.cats.find(cat => cat.id === catListEl.dataset.id);
    this.#map.setView(cat.coords, this.#mapZoomLevel + 1, {
      animate: true,
      pan: {duration: 1},
    });
    // const delBtn = `<button class="del_btn">delete</button>`;
    // catListEl.insertAdjacentHTML("beforeend", delBtn);
  }

  _moveFilterToPopUp(e) {
    const filterCat = e.target.closest(".filtered_cat");
    // console.log(e.target);
    if (!filterCat) return;
    const cat2 = this.cats.find(cat => cat.id === filterCat.dataset.id);
    this.#map.setView(cat2.coords, this.#mapZoomLevel + 1, {
      animate: true,
      pan: {duration: 1},
    });
  }
  _setLocalStorage() {
    localStorage.setItem("cats", JSON.stringify(this.cats));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("cats"));
    if (!data) return;
    this.cats = data;
    console.log(data);
    this.cats.forEach(cat => this._renderCats(cat));
  }

  // _deleteCat(e) {
  //   console.log(this.cats);
  //   const catListEl = e.target.closest(".recent_cat");
  //   const cat = this.cats.find(cat => cat.id === catListEl.dataset.id);

  //   const catIndex = this.cats.findIndex(
  //     cat => cat.id === catListEl.dataset.id
  //   );
  //   localStorage.removeItem(`${this.cats[catIndex]}`);
  //   // console.log(catIndex);
  //   // this.cats.splice(catIndex, 1);
  //   // console.log(this.cats);
  //   // this.cats.forEach(cat => this._renderCats(cat));
  //   // this.cats.forEach(cat => this._renderCatsMarker(cat));
  // }
}
const app = new App();
// setTimeout(function () {
//   console.log(app.cats);
//   const date = new Date();
//   console.log(
//     `${date.getDate()} at ${date.getHours()}:${String(
//       date.getMinutes()
//     ).padStart(2, 0)}`
//   );
// }, 15000);

// console.log(delBtn);

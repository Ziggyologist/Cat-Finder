"use strict";

class Cat {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  constructor(coords, color, logo, race, photo, comments) {
    this.coords = coords; //[lat, lng]
    this.color = color; //form select
    this.logo = logo; //form select
    this.race = race; //form select
    this.photo = photo; //form select
    this.comments = comments; //form select
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.color} cat spotted on ${
      months[this.date.getMonth()]
    } ${this.date.getDay()}`;
  }
}

//test
const test = new Cat(12, "grey", "logo", "mixed", "photo", 12);
console.log(test);
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

class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  cats = [];
  constructor() {
    // 1. Get user position
    this._getPosition();
    // 2. Get data from local storage
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
    // this.#cats.forEach(cat => {
    //   this._renderCatsMarker(cat);
    // });
  }
  // ///////////////SHOW FORM
  _showForm(mapE) {
    this.#mapEvent = mapE;
    newCatFormContainer.classList.remove("hidden");
    filterCatsContainer.style.opacity = "0";
    newCatColor.focus();
  }
  // //////////////HIDE FORM
  _hideForm() {
    newCatFormContainer.classList.add("hidden");
    filterCatsContainer.style.opacity = "1";
  }
  // /////////////ADD CAT
  _newCat(e) {
    let cat;
    e.preventDefault();
    cat = new Cat();
  }
  _renderCatsMarker(cat) {
    L.marker(cat.coords)
      .addTo(this.#map)
      .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
      .openPopup();
  }
  _renderCats(cat) {}
  _moveToPopUp(e) {}
  _setLocalStorage() {}
  _getLocalStorage() {}
  _deleteCat() {}
}
const app = new App();

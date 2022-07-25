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
  }

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
  }
  _showForm() {}
  _hideForm() {}
  _addCat() {}
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

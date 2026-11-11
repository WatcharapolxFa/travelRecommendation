// Travel Recommendation: fetch data, search by keyword, render cards
let travelData = null;

const searchInput = document.getElementById("searchInput");
const resultsBox = document.getElementById("results");

const timeZones = {
  "Sydney, Australia": "Australia/Sydney",
  "Melbourne, Australia": "Australia/Melbourne",
  "Tokyo, Japan": "Asia/Tokyo",
  "Kyoto, Japan": "Asia/Tokyo",
  "Rio de Janeiro, Brazil": "America/Sao_Paulo",
  "São Paulo, Brazil": "America/Sao_Paulo",
};

// Task 6: load the JSON data
fetch("travel_recommendation_api.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    travelData = data;
  })
  .catch((error) => console.error("Error loading data:", error));

// Task 7: return the places that match the keyword
function findPlaces(keyword) {
  const allCities = travelData.countries.flatMap((c) => c.cities);
  if (keyword === "beach" || keyword === "beaches") return travelData.beaches;
  if (keyword === "temple" || keyword === "temples") return travelData.temples;
  if (keyword === "country" || keyword === "countries") return allCities;
  const country = travelData.countries.find((c) => c.name.toLowerCase() === keyword);
  return country ? country.cities : [];
}

// Task 8: build one card
function createCard(place) {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = place.imageUrl;
  img.alt = place.name;

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("h3");
  title.textContent = place.name;

  const text = document.createElement("p");
  text.textContent = place.description;

  body.append(title, text);

  // Task 10: local time for cities
  const zone = timeZones[place.name];
  if (zone) {
    const time = document.createElement("p");
    time.className = "local-time";
    time.textContent = "Local time: " +
      new Date().toLocaleTimeString("en-US", { timeZone: zone, hour12: true, hour: "numeric", minute: "numeric", second: "numeric" });
    body.append(time);
  }

  const visit = document.createElement("button");
  visit.textContent = "Visit";
  body.append(visit);

  card.append(img, body);
  return card;
}

function search() {
  const keyword = searchInput.value.trim().toLowerCase();
  resultsBox.innerHTML = "";
  if (!keyword || !travelData) return;

  const places = findPlaces(keyword);
  if (places.length === 0) {
    const msg = document.createElement("p");
    msg.className = "no-results";
    msg.textContent = "No results found";
    resultsBox.append(msg);
    return;
  }
  places.forEach((place) => resultsBox.append(createCard(place)));
}

// Task 9: clear input and results
function clearResults() {
  searchInput.value = "";
  resultsBox.innerHTML = "";
}

document.getElementById("btnSearch").addEventListener("click", search);
document.getElementById("btnClear").addEventListener("click", clearResults);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") search();
});

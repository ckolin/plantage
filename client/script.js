const URL = "https://wasstahtufemplan.ga:3000";

const PLACES = [
	"Werkk",
	"Wilma's Kitchen",
	"Subway",
	"Pizza",
	"Migros TakeAway",
	"Manito",
	"Mehdi",
	"BBBRestaurant",
	"BBBistro",
	"Coop Restaurant",
	"Bal's",
	"Little Italy"
];

const LINKS = {
	"Werkk": "http://www.werkkbeiz.ch/",
	"Subway": "https://www.subway.com/de-CH/MenuNutrition/Menu/All",
	"Migros TakeAway": "https://www.migros.ch/de/genossenschaften/migros-aare/angebot/gastronomie/menuplan-und-angebotsplan.html",
	"Manito": "https://www.manito.ch/burger/",
	"BBBRestaurant": "http://bbbaden.sv-restaurant.ch/de/menuplan/restaurant-martinsberg/",
	"BBBistro": "http://bbbaden.sv-restaurant.ch/de/menuplan/bowls-and-rolls/",
	"Coop Restaurant": "https://www.coop-restaurant.ch/de/menueseite.vst2524.restaurant.html"
};

const OVERLAY = document.getElementById("overlay");
const LOGIN = document.getElementById("login");
const NAME_INPUT = document.getElementById("name-input");
const EMAIL_INPUT = document.getElementById("email-input");
const CONFIRM = document.getElementById("confirm");
const NAME = document.getElementById("name");
const MY_VOTE = document.getElementById("my-vote");
const SUGGESTION = document.getElementById("suggestion");
const SOUNDS_GOOD = document.getElementById("sounds-good");
const ALTERNATIVES = document.getElementById("alternatives");
const MY_SUGGESTION = document.getElementById("my-suggestion");
const SUGGEST = document.getElementById("suggest");

let name = "";
let token = "";
let myVote = "";
let suggestion = PLACES[Math.floor(Math.random() * PLACES.length)];

CONFIRM.onclick = () => {
	const name = NAME_INPUT.value;
	const email = EMAIL_INPUT.value;
	
	if (!name || !email)
		return;
	
	fetch(URL + "/user", {
		method: "POST",
		body: JSON.stringify({ email: email,  name: name }),
		headers: { "Content-Type": "application/json" },
	}).then(response => {
		if (response.status == 200)
			LOGIN.innerText = "We've sent you an email with a confirmation link.";
		else
			LOGIN.innerText = "Oops! Something went wrong. Please try again later."
	});
}

EMAIL_INPUT.addEventListener("keydown", (event) => {
	if (event.keyCode == 13)
		CONFIRM.onclick();
});

SOUNDS_GOOD.onclick = () => vote(suggestion);

SUGGEST.onclick = () => {
	vote(MY_SUGGESTION.value);
	MY_SUGGESTION.value = "";
};

MY_SUGGESTION.addEventListener("keydown", (event) => {
	if (event.keyCode == 13)
		SUGGEST.onclick();
});

window.onload = () => {
	loadUser();
	load();
};

function loadUser() {
	if (location.hash) {
		localStorage.setItem("token", location.hash.substr(1));
		location.hash = "";
		history.replaceState("", document.title, window.location.pathname);
	}

	token = localStorage.getItem("token");
	if (!token)
		return showOverlay();

	fetch(URL + "/user?token=" + token)
		.then(response => response.json())
		.then(user => {
			name = user.name;
			NAME.innerText = name;
		});
}

function showOverlay() {
	OVERLAY.classList.remove("hidden");
}

function hideOverlay() {
	OVERLAY.classList.add("hidden");
}

function load() {
	fetch(URL)
		.then(response => response.json())
		.then(votes => show(votes));
}

function clear() {
	myVote = "";
	MY_VOTE.innerText = "";
	SUGGESTION.innerText = "";
	while (ALTERNATIVES.firstChild)
		ALTERNATIVES.removeChild(ALTERNATIVES.firstChild);
}

function show(votes) {
	clear();

	let places = {};
	for (let v of votes) {
		if (!places[v.vote])
			places[v.vote] = [];
		places[v.vote].push(v.name);
		if (v.name == name) myVote = v.vote;
	}

	MY_VOTE.innerText = myVote;

	let max = 0;
	for (let place of Object.keys(places)) {
		const voters = places[place];
		
		if (voters.length >= max) {
			max = voters.length;
			suggestion = place;
		}

		ALTERNATIVES.appendChild(createAlternative(place, voters));
	}

	SUGGESTION.innerText = suggestion;
	if (LINKS[suggestion]) {
		SUGGESTION.classList.add("link");
		SUGGESTION.onclick = () => window.location = LINKS[suggestion];
	} else {
		SUGGESTION.classList.remove("link");
		SUGGESTION.onclick = null;
	}
}

function createAlternative(place, voters) {
	const alt = document.createElement("button");
	alt.classList.add("alternative");
	if (place == myVote)
		alt.classList.add("chosen");
	alt.onclick = () => vote(place);
	
	const placeText = document.createElement("span");
	placeText.innerText = place;
	placeText.classList.add("alternative-place");
	alt.appendChild(placeText);

	const votesText = document.createElement("span");
	votesText.innerText = voters.length;
	votesText.classList.add("alternative-votes");
	alt.appendChild(votesText);

	alt.innerHTMl += "<br>";

	const voterText = document.createElement("span");
	voterText.innerText = voters.join(", ");
	voterText.classList.add("alternative-voters");
	alt.appendChild(voterText);

	return alt;
}

function vote(place) {
	fetch(URL, {
		method: "POST",
		body: JSON.stringify({ vote: place, token: token }),
		headers: { "Content-Type": "application/json" },
	}).then(response => {
		load();
	});
}

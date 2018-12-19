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

const LOGIN = document.getElementById("login");
const USER_INPUT = document.getElementById("user-input");
const CONFIRM = document.getElementById("confirm");
const USER = document.getElementById("user");
const MY_VOTE = document.getElementById("my-vote");
const SUGGESTION = document.getElementById("suggestion");
const SOUNDS_GOOD = document.getElementById("sounds-good");
const ALTERNATIVES = document.getElementById("alternatives");
const MY_SUGGESTION = document.getElementById("my-suggestion");
const SUGGEST = document.getElementById("suggest");

let user = "Not logged in";
let myVote = "No vote yet";
let suggestion = PLACES[Math.floor(Math.random() * PLACES.length)];

CONFIRM.onclick = () => {
	if (!USER_INPUT.value)
		return;
	
	user = USER_INPUT.value;
	localStorage.setItem("user", user);
	LOGIN.classList.add("hidden");
	window.onload();
}

USER_INPUT.addEventListener("keydown", (event) => {
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
	user = localStorage.getItem("user")
	if (!user)
		showLogin();
	
	USER.innerText = user;
}

function showLogin() {
	LOGIN.classList.remove("hidden");
}

function load() {
	fetch(URL)
		.then(response => response.json())
		.then(votes => show(votes));
}

function clear() {
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
		places[v.vote].push(v.user);
		if (v.user == user) myVote = v.vote;
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
		body: JSON.stringify({vote: place, user: user}),
		headers: {"Content-Type": "application/json"}
	}).then(response => {
		load();
	});
}

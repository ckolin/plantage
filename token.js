function small() {
	return Math.random().toString(36).substr(2);
}

function next() {
	return small() + small();
}

module.exports = next;
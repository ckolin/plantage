function small() {
	return Math.random().toString(36).substr(2);
}

function get() {
	return small() + small();
}

module.exports = get;
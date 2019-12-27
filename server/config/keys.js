// determine whether we need production or dev keys
if (process.env.NODE_ENV === 'production') {
	// in prod
	module.exports = require('./prod');
}
else {
	// in dev
	module.exports = require('./dev');
}
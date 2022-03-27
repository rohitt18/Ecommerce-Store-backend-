// And this one is called not-found bec when the user hits the route which does not exist we need this error
const notFound = (req, res) => res.status(404).send('Route does not exist')

module.exports = notFound;

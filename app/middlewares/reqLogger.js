let reqCount = 0;

module.exports = async (req, res, next) => {

    reqCount++;

    console.log(`${reqCount} requests received.`);
    next();
}

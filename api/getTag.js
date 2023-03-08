const fetch = require("node-fetch");
const { parseString } = require("xml2js");

export default async function getTag(req, res) {
  const apiRequest = await fetch(
    "https://www.barbershoptags.com/api.php?id=" +
      encodeURIComponent(req.query.id)
  );
  parseString(await apiRequest.text(), function parse(err, result) {
    err
      ? res.status(500).send({ error: err })
      : res.status(200).send({ response: result });
  });
}

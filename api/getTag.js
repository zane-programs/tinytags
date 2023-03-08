const fetch = require("node-fetch");

export default async function getTag(req, res) {
  const apiRequest = await fetch(
    "https://www.barbershoptags.com/api.php?id=" +
      encodeURIComponent(req.query.id)
  );
  const apiResponse = await apiRequest.text();
  res.status(200).send({ text: apiResponse });
}

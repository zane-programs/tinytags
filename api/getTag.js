const fetch = require("node-fetch");
const { parseString } = require("xml2js");

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

async function getTag(req, res) {
  const apiRequest = await fetch(
    "https://www.barbershoptags.com/api.php?id=" +
      encodeURIComponent(req.query.id)
  );
  parseString(await apiRequest.text(), function parse(err, result) {
    const tag = result.tags.tag[0];

    err
      ? res.status(500).send({ error: err })
      : res
          .status(200)
          .send({
            id: tag.id[0],
            name: tag.Title[0],
            sheetMusic: {
              url: tag.SheetMusicAlt[0],
              fileType: tag.SheetMusic[0].$.type,
            },
          });
  });
}

export default allowCors(getTag);
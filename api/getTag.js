const fetch = require("node-fetch");
const { parseString } = require("xml2js");

export default async function getTag(req, res) {
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
            name: tag.Title[0],
            sheetMusic: {
              url: tag.SheetMusicAlt[0],
              fileType: tag.SheetMusic[0].$.type,
            },
          });
  });
}

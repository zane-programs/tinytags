const fetch = require("node-fetch");
const { parseString } = require("xml2js");

export default async function getTag(req, res) {
  try {
    const apiRequest = await fetch(
      "https://www.barbershoptags.com/api.php?id=" +
        encodeURIComponent(req.query.id)
    );
    parseString(await apiRequest.text(), function parse(err, result) {
      // Parse error => 500
      if (err) {
        return res.status(500).send({ error: err });
      }

      // No tags available => 404
      if (parseInt(result.tags.$.available) === 0) {
        return res.status(404).send({ error: "Tag not found" });
      }

      // Otherwise => Parse tag and 200 w/ results
      const tag = result.tags.tag[0];
      res.status(200).send({
        id: tag.id[0],
        name: tag.Title[0],
        sheetMusic: {
          url: tag.SheetMusicAlt[0],
          fileType: tag.SheetMusic[0].$.type,
        },
      });
    });
  } catch (e) {
    res.status(500).send({ error: e?.message || e });
  }
}

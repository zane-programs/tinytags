const fetch = require("node-fetch");
const { pdf } = require("pdf-to-img");

module.exports = async function convertPDFToImageURLs(url) {
  const response = await fetch(url, {
    responseType: "arraybuffer",
  });

  const pdfPages = await pdf(Buffer.from(await response.buffer(), "binary"), {
    scale: 2,
  });

  let imageURLs = [];
  for await (const page of pdfPages) {
    imageURLs.push("data:img/png;base64," + page.toString("base64"));
  }

  return imageURLs;
};

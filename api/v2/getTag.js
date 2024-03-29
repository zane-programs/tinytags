// const fetch = require("node-fetch")
// const { parseString } = require("xml2js");
// const { pdf } = require("pdf-to-img");

// async function convertPDF(url) {
//   const response = await fetch(url, {
//     responseType: "arraybuffer",
//   });

//   const pdfPages = await pdf(Buffer.from(await response.buffer(), "binary"), {
//     scale: 2,
//   });

//   let imageURLs = [];
//   for await (const page of pdfPages) {
//     imageURLs.push("data:img/png;base64," + page.toString("base64"));
//   }

//   return imageURLs;
// };


// function handleError(res, e) {
//   res.status(500).send({ error: e?.message || e });
// }

// export default async function getTag(req, res) {
//   try {
//     const apiRequest = await fetch(
//       "https://www.barbershoptags.com/api.php?id=" +
//         encodeURIComponent(req.query.id)
//     );
//     parseString(await apiRequest.text(), async function parse(err, result) {
//       // Parse error => 500
//       if (err) {
//         return res.status(500).send({ error: err });
//       }

//       try {
//         // Server error on BarbershopTags.com API side
//         if (!("tags" in result) && result?.pre) {
//           return res.status(500).send({
//             error:
//               "BarbershopTags.com API: " +
//               (result.pre?._.trim() || "Unknown error"),
//           });
//         }

//         // No tags available => 404
//         if (parseInt(result.tags.$.available) === 0) {
//           return res.status(404).send({ error: "Tag not found" });
//         }

//         // Otherwise => Parse tag and 200 w/ results
//         const tag = result.tags.tag[0];
//         const fileType = tag.SheetMusic[0].$.type.toLowerCase();

//         const sheetMusicImageArray =
//           fileType === "pdf"
//             ? await convertPDF(tag.SheetMusicAlt[0])
//             : [tag.SheetMusicAlt[0]];

//         res.status(200).send({
//           id: tag.id[0],
//           name: tag.Title[0],
//           sheetMusic: sheetMusicImageArray,
//         });
//       } catch (e) {
//         handleError(res, e);
//       }
//     });
//   } catch (e) {
//     handleError(res, e);
//   }
// }

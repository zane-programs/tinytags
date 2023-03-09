(function (window, document) {
  // constant config
  const ZOOM_INCREMENT_PERCENT = 0.1;
  const INITIAL_ARROW_KEY_DELTA = 14;

  // selector for #tagView
  let $tagView;

  // - variables zoom and arrow-key
  let zoomFactor = 1;
  let scaledArrowKeyDelta = INITIAL_ARROW_KEY_DELTA;

  // variables - x and y position
  let x = 0;
  let y = 0;

  // update #tagView transform style (scale and translate)
  function updateTransform() {
    $tagView.style.transform = `scale(${zoomFactor}) translate(${x}px,${y}px)`;
  }

  function setZoomFactor(factor) {
    zoomFactor = factor;
    scaledArrowKeyDelta = 14 * (1 / zoomFactor);
    updateTransform();
  }

  function setX(val) {
    x = val;
    updateTransform();
  }
  function setY(val) {
    y = val;
    updateTransform();
  }

  window.addEventListener("keydown", ({ key }) => {
    switch (key) {
      case "ArrowUp":
        // up
        setY(y + scaledArrowKeyDelta);
        break;
      case "ArrowDown":
        // down
        setY(y - scaledArrowKeyDelta);
        break;
      case "ArrowLeft":
        // left
        setX(x + scaledArrowKeyDelta);
        break;
      case "ArrowRight":
        // right
        setX(x - scaledArrowKeyDelta);
        break;

      case "*":
        // zoom out
        setZoomFactor(zoomFactor * (1 / (1 + ZOOM_INCREMENT_PERCENT)));
        break;
      case "#":
        // zoom in
        setZoomFactor(zoomFactor * (1 + ZOOM_INCREMENT_PERCENT));
        break;

      case "0":
        // reset zoom and (x, y)
        setZoomFactor(1);
        setX(0);
        setY(0);
        break;
    }
  });

  document.addEventListener("DOMContentLoaded", async function () {
    $tagView = document.getElementById("tagView");

    // api request
    const req = await fetch("/api/getTag" + window.location.search);
    const res = await req.json();

    // haha error handling
    if (res.error) {
      alert("error\n\n" + JSON.stringify(res.error));
      return;
    }

    let sheetMusicElement;
    if (res.sheetMusic.fileType.toLowerCase() === "pdf") {
      // pdf - embed as google drive pdf embed
      sheetMusicElement = document.createElement("embed");
      embed.src =
        "https://drive.google.com/viewerng/viewer?embedded=true&chrome=false&url=" +
        encodeURIComponent(res.sheetMusic.url);
    } else {
      // otherwise - embed as html image
      sheetMusicElement = document.createElement("img");
      sheetMusicElement.src = res.sheetMusic.url;
    }

    // make it untabbable & add to #tagView
    sheetMusicElement.tabIndex = -1;
    $tagView.appendChild(sheetMusicElement);
  });
})(window, document);

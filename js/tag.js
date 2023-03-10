(function (window, document) {
  // constant config
  const ZOOM_INCREMENT_PERCENT = 0.1;
  const INITIAL_ARROW_KEY_DELTA = 14;

  // selectors
  let $tagView;
  let $messageModal;

  // container for api response
  let tagData;

  // - variables zoom and arrow-key
  let zoomFactor = 1;
  let scaledArrowKeyDelta = INITIAL_ARROW_KEY_DELTA;

  // variables - x and y position
  let x = 0;
  let y = 0;

  let messageModalHideTimeout = -1;
  function showModalMessage(
    message,
    backgroundColor = "#f00",
    textColor = "#000",
    duration = 1000
  ) {
    // clear hiding timeout
    clearTimeout(messageModalHideTimeout);

    // stage modal
    $messageModal.style.backgroundColor = backgroundColor;
    $messageModal.style.color = textColor;
    $messageModal.innerHTML = message;

    // show modal
    $messageModal.style.display = null;

    // set hiding timeout with given duration
    messageModalHideTimeout = setTimeout(function () {
      $messageModal.style.display = "none";
    }, duration);
  }

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

  //showModalMessage("ur mom", "#00f", "#fff", 5000);

  function getFaves() {
    return JSON.parse(localStorage.getItem("faves"));
  }
  function setFaves(faves) {
    localStorage.setItem("faves", JSON.stringify(faves));
  }

  function isInFaves() {
    let faves = getFaves();
    return (
      faves.find(function (fave) {
        return fave[0] === tagData.id;
      }) !== undefined
    );
  }
  function addToFaves() {
    let faves = getFaves();
    // add it
    faves.push([tagData.id, tagData.name]);
    // set it
    setFaves(faves);
  }
  function removeFromFaves() {
    let faves = getFaves();
    // filter out this id
    faves = faves.filter(function (fave) {
      return fave[0] !== tagData.id;
    });
    // set it
    setFaves(faves);
  }

  function toggleFave() {
    // don't allow until loaded
    if (!tagData || "error" in tagData) return;

    let inFaves = isInFaves();
    inFaves ? removeFromFaves() : addToFaves();
    showModalMessage(inFaves ? "unfaved" : "faved", "#ff4be8", "#fff", 1500);
  }

  window.addEventListener("keydown", function (e) {
    const key = e.key;

    e.preventDefault();

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

      case "2":
        // toggle favorite on tag
        toggleFave();
    }
  });

  document.addEventListener("DOMContentLoaded", async function () {
    $tagView = document.getElementById("tagView");
    $messageModal = document.getElementById("messageModal");

    // api request
    const req = await fetch("/api/getTag" + window.location.search);
    const res = await req.json();

    // add response data to container variable
    tagData = res;

    // haha error handling
    if (res.error) {
      alert("error\n\n" + JSON.stringify(res.error));
      return;
    }

    let sheetMusicElement;
    if (res.sheetMusic.fileType.toLowerCase() === "pdf") {
      // pdf - embed as google drive pdf embed
      sheetMusicElement = document.createElement("embed");
      sheetMusicElement.src =
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

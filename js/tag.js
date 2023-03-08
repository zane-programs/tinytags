(function (window, document) {
  let $tagView;

  let zoomFactor = 1;

  let x = 0;
  let y = 0;

  function updateTransform() {
    $tagView.style.transform = `scale(${zoomFactor}) translate(${x}px,${y}px)`;
  }

  function setZoomFactor(factor) {
    zoomFactor = factor;
    updateTransform();
    console.log(factor);
  }

  function setX(val) {
    x = val;
    updateTransform();
  }
  function setY(val) {
    y = val;
    updateTransform();
  }

  function getScaledArrowKeyDelta() {
    return 14 * (1 / zoomFactor);
  }

  window.addEventListener("keydown", ({ key }) => {
    switch (key) {
      case "ArrowUp":
        setY(y + getScaledArrowKeyDelta());
        break;
      case "ArrowDown":
        setY(y - getScaledArrowKeyDelta());
        break;
      case "ArrowRight":
        setX(x - getScaledArrowKeyDelta());
        break;
      case "ArrowLeft":
        setX(x + getScaledArrowKeyDelta());
        break;

      case "*":
        setZoomFactor(zoomFactor * (1 / 1.1));
        break;
      case "#":
        setZoomFactor(zoomFactor * 1.1);
        break;
    }
    console.log(key);
  });

  document.addEventListener("DOMContentLoaded", async function () {
    $tagView = document.getElementById("tagView");

    // api request
    const req = await fetch(
      "/api/getTag" + window.location.search
    );
    const res = await req.json();

    if (res.error) {
      alert("error", JSON.stringify(res.error));
      return;
    }

    if (res.sheetMusic.fileType.toLowerCase() === "pdf") {
      const embed = document.createElement("embed");
      embed.tabIndex = -1;
      embed.src =
        "https://drive.google.com/viewerng/viewer?embedded=true&chrome=false&url=" +
        encodeURIComponent(res.sheetMusic.url);
      $tagView.appendChild(embed);
    } else {
      const img = document.createElement("img");
      img.tabIndex = -1;
      img.src = res.sheetMusic.url;
      $tagView.appendChild(img);
    }
  });
})(window, document);

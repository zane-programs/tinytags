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

  window.addEventListener("keydown", ({ key }) => {
    switch (key) {
      case "ArrowUp":
        setY(y + 10);
        break;
      case "ArrowDown":
        setY(y - 10);
        break;
      case "ArrowRight":
        setX(x - 10);
        break;
      case "ArrowLeft":
        setX(x + 10);
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

  document.addEventListener("DOMContentLoaded", () => {
    $tagView = document.getElementById("tagView");
  });
})(window, document);

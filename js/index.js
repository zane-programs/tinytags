(function (window, document) {
  const EMPTY_FAVE = { index: -1, value: "-1" };

  let $tagNumber;
  let currentTagNumber = "";
  let currentFave = EMPTY_FAVE;
  let isViewingFave = false;

  function setCurrentTagNumber(num) {
    currentTagNumber = num;
    $tagNumber.innerHTML =
      (isViewingFave ? "#" + (currentFave.index + 1) + ": " : "") +
      currentTagNumber;
  }

  function viewTag(num) {
    if (num || num !== "") {
      window.location.href = "/tag.html?id=" + num;
    }
  }

  function resetCurrentFave() {
    isViewingFave = false;
    currentFave = EMPTY_FAVE;
    $tagNumber.classList.remove("fave");
  }
  function setCurrentFave(index, value) {
    isViewingFave = true;
    currentFave = { index: index, value: value };
    setCurrentTagNumber(currentFave.value[0]);
    // add fave styling depending
    $tagNumber.classList.add("fave");
  }

  function getFaves() {
    return JSON.parse(localStorage.getItem("faves"));
  }
  function nextFave(faves) {
    const nextIndex = (currentFave.index + 1) % faves.length;
    console.log(nextIndex, faves[nextIndex]);
    setCurrentFave(nextIndex, faves[nextIndex]);
  }
  function prevFave(faves) {
    const prevIndex =
      currentFave.index === 0 ? faves.length - 1 : currentFave.index - 1;
    console.log(prevIndex, faves[prevIndex]);
    setCurrentFave(prevIndex, faves[prevIndex]);
  }

  function handleFaveNavigation(key) {
    let faves = getFaves();
    if (faves.length === 0) return;
    // Navigate
    key === "ArrowUp" ? prevFave(faves) : nextFave(faves);
  }

  window.addEventListener("keydown", ({ key }) => {
    if (/\b[0-9]\b/.test(key)) {
      setCurrentTagNumber(currentTagNumber + key);
    } else {
      switch (key) {
        case "ArrowUp":
        case "ArrowDown":
          handleFaveNavigation(key);
          break;
        case "#":
        case "Backspace":
          resetCurrentFave();
          setCurrentTagNumber(
            currentTagNumber.substring(0, currentTagNumber.length - 1)
          );
          break;
        case "*":
          resetCurrentFave();
          setCurrentTagNumber("");
          break;
        case "Enter":
          viewTag(currentTagNumber);
          break;
      }
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("faves")) {
      localStorage.setItem("faves", "[]");
    }
    $tagNumber = document.getElementById("tagNumber");
  });
})(window, document);

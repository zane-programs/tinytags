(function (window, document) {
  const EMPTY_FAVE = { index: -1, value: "-1" };

  let $tagNumber;
  let $tagTitle;

  let currentTagNumber = "";
  let currentFave = EMPTY_FAVE;
  let isViewingFave = false;

  function setCurrentTagNumber(num) {
    currentTagNumber = num;
    $tagNumber.children[0].innerHTML = currentTagNumber;
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
    // show tag title
    $tagTitle.innerText = currentFave.value[1];
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
      currentFave.index <= 0 ? faves.length - 1 : currentFave.index - 1;
    console.log(prevIndex, faves[prevIndex]);
    setCurrentFave(prevIndex, faves[prevIndex]);
  }

  function repairBrokenFaves() {
    const faves = getFaves();
    localStorage.setItem(
      "faves",
      JSON.stringify(
        faves.filter(function (fave) {
          fave.indexOf(null) === -1;
        })
      )
    );
  }

  function handleFaveNavigation(key) {
    let faves = getFaves();
    if (faves.length === 0) return;
    // Navigate
    console.log("KEY", key);
    key === "ArrowUp" ? prevFave(faves) : nextFave(faves);
  }

  window.addEventListener("keydown", (e) => {
    e.preventDefault();

    const key = e.key;

    if (/\b[0-9]\b/.test(key)) {
      resetCurrentFave();
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

    repairBrokenFaves();

    $tagNumber = document.getElementById("tagNumber");
    $tagTitle = document.getElementById("tagTitle");
  });
})(window, document);

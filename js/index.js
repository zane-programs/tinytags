(function (window, document) {
  let $tagNumber;
  let currentTagNumber = "";

  function setCurrentTagNumber(num) {
    currentTagNumber = num;
    $tagNumber.innerHTML = currentTagNumber;
  }

  function viewTag(num) {
    if (num || num !== "") {
      window.location.href = "/tag.html?id=" + num;
    }
  }

  window.addEventListener("keydown", ({ key }) => {
    if (/\b[0-9]\b/.test(key)) {
      setCurrentTagNumber(currentTagNumber + key);
    } else {
      switch (key) {
        case "#":
        case "Backspace":
          setCurrentTagNumber(
            currentTagNumber.substring(0, currentTagNumber.length - 1)
          );
          break;
        case "Enter":
          viewTag(currentTagNumber);
          break;
        case "*":
          setCurrentTagNumber("");
          break;
      }
    }
    console.log(key);
  });

  document.addEventListener("DOMContentLoaded", () => {
    $tagNumber = document.getElementById("tagNumber");
  });
})(window, document);

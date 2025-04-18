function removeElementsByClass(className, useRankChangeNone = false, insertAfterClass = null) {
  const elements = document.querySelectorAll(className);
  elements.forEach(el => {
    if (useRankChangeNone) {
      const template = document.querySelector(".ranking-page-table__column--rank-change-none");
      if (template) {
        const clone = template.cloneNode(true);
        const parent = el.parentElement;
        const siblings = Array.from(parent.children);
        const insertAfter = siblings.find(sib => sib.matches(insertAfterClass));

        if (insertAfter && insertAfter.nextSibling) {
          insertAfter.parentNode.insertBefore(clone, insertAfter.nextSibling);
        } else {
          parent.appendChild(clone);
        }
      }
    }

    el.remove();
  });
}

function makeProfilePicturesBigger(className) {
  const elements = document.querySelectorAll(className);
  elements.forEach(el => {
    el.style.width = '30px';
    el.style.height = '30px';
  })
}

chrome.storage.sync.get([
  'removeProfilePictures',
  'makeProfilePicturesBigger',
  'removeTeams',
  'removeRankChanges',
  'removeCountry'
], (result) => {
  const shouldRemoveProfilePics = result.removeProfilePictures || false;
  const shouldMakePicsBigger = result.makeProfilePicturesBigger || false;

  const removalOptions = [
    {
      className: ".avatar.avatar--dynamic-size",
      enabled: shouldRemoveProfilePics
    },
    {
      className: ".flag-team",
      enabled: result.removeTeams || false
    },
    {
      className: ".ranking-page-table__column--rank-change",
      enabled: result.removeRankChanges || false,
      useRankChangeNone: true,
      insertAfter: ".ranking-page-table__column--main"
    },
    {
      className: ".flag-country",
      enabled: result.removeCountry || false
    }
  ];

  function runRemovals() {
    removalOptions.forEach(option => {
      if (option.enabled) {
        removeElementsByClass(option.className, option.useRankChangeNone, option.insertAfter);
      }
    });

    if (!shouldRemoveProfilePics && shouldMakePicsBigger) {
      makeProfilePicturesBigger(".avatar.avatar--dynamic-size");
    }
  }

  runRemovals();

  setInterval(runRemovals, 2000);
});

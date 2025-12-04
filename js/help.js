// js/help.js

document.addEventListener("DOMContentLoaded", function () {
  const items = document.querySelectorAll(".help-faq-item");

  items.forEach((item) => {
    const header = item.querySelector(".help-faq-header");
    const answer = item.querySelector(".help-faq-answer");

    header.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // 其他全部收起
      items.forEach((i) => {
        if (i !== item) {
          i.classList.remove("open");
          const a = i.querySelector(".help-faq-answer");
          a.style.maxHeight = "0px";
        }
      });

      // 当前切换展开
      if (isOpen) {
        item.classList.remove("open");
        answer.style.maxHeight = "0px";
      } else {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const faqList = document.getElementById("faqList");
  if (!faqList) return;

  faqList.addEventListener("click", (event) => {
    const btn = event.target.closest(".faq-question");
    if (!btn) return;

    const item = btn.closest(".faq-item");
    if (!item) return;

    // 如果已经展开，就收起；如果是收起状态，就展开
    const isActive = item.classList.contains("active");

    // 也可以选择「单开模式」：收起其它项
    // const allItems = faqList.querySelectorAll(".faq-item");
    // allItems.forEach((it) => it.classList.remove("active"));

    if (isActive) {
      item.classList.remove("active");
    } else {
      item.classList.add("active");
    }
  });
});

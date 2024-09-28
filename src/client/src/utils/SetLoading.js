export const unhideLoading = (container) => {
  container.style.display = "flex";
};

export const hideLoading = (container) => {
  console.log("hideLoading");
  container.style.display = "none";
};

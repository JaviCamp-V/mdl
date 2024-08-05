const scrollToElementByID = (id: string | number) => {
  const htmlElement = document.querySelector(`[id='${id}']`);
  if (htmlElement) {
    setTimeout(() => {
      htmlElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }, 10);
  } else {
    console.error(`Element with ID '${id}' not found.`);
  }
};

export { scrollToElementByID };

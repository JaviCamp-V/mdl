const scrollToElementByID = (id: string | number) => {
  const htmlElement = document.querySelector(`[id='${id}']`);
  if (htmlElement) {
    setTimeout(() => {
      htmlElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }, 0);
  } else {
    console.error(`Element with ID '${id}' not found.`);
  }
};

const scrollToTop = () => {
  try {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  } catch (e) {
    console.error('Error while scrolling to top', e);
  }
};

const scrollToTopById = (id: string | number) => {
  const htmlElement = document.querySelector(`[id='${id}']`);
  if (htmlElement) {
    const elementPosition = htmlElement?.getBoundingClientRect().top + window.scrollY - 70;

    setTimeout(() => {
      window.scrollTo({
        top: elementPosition,
        behavior: 'instant'
      });
    }, 0);
  } else {
    console.error(`Element with ID '${id}' not found.`);
  }
};

export { scrollToElementByID, scrollToTop, scrollToTopById };

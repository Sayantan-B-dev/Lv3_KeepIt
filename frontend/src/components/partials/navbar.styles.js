// navbar.styles.js

export const blackFontStyle = {
  textDecoration: "none",
  color: "black",
  position: "relative",
  display: "inline-block",
};

export const blackFontClass = `
  relative inline-block text-black no-underline
  after:content-[''] after:absolute after:left-0 after:bottom-0
  after:w-full after:h-[1px] after:bg-black
  after:origin-right after:scale-x-0
  after:transition-transform after:duration-300
  hover:after:origin-left hover:after:scale-x-100
`;

export const navbarBaseClass = `
  w-[90%] max-w-full md:max-w-[96%] lg:max-w-[90%]
  mx-auto rounded-2xl md:rounded-3xl lg:rounded-4xl
  py-2 px-2 sm:px-4 md:px-6 lg:px-8 lg:py-4
  sticky top-2 md:top-4 z-50
  transition-colors duration-500
`;

export const navbarScrolledClass = `
  bg-white/20 backdrop-blur-xs
  border border-gray-500 shadow-3xl
`;

export const navbarDefaultClass = `
  bg-black/5
`;

export const navListClass = `
  mt-2 mb-4 flex flex-col gap-2 md:gap-3
  lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6
`;

export const navItemClass = `
  flex items-center gap-x-2 p-1 font-medium
`;

export const brandClass = `
  mr-2 sm:mr-4 cursor-pointer py-1.5
  font-bold text-xl sm:text-2xl
`;

export const profileImageClass = `
  w-10 h-10 md:w-12 md:h-12
  rounded-full object-cover
  border border-black
  transition-all duration-300
  hover:scale-110 active:scale-95
`;

export const hamburgerClass = `
  cursor-pointer flex items-center
  lg:hidden ml-auto
`;

export const mobileContainerClass = `
  container mx-auto flex flex-col gap-4 py-2
`;

import React from 'react';

const Container = ({ children, gradFrom, gradTo, textColor, darkTextColor, ariaLabel }) => {
  return (
    <section
      className={`h-full overflow-y-auto p-5 bg-gradient-to-b
       ${gradFrom || 'from-white dark:from-zinc-700'} 
       ${gradTo || 'to-zinc-700 dark:to-black'} 
       ${textColor || 'text-gray-800 dark:text-gray-100'} 
       ${darkTextColor || ''}`}
      role="region"
      aria-label={ariaLabel || "Content container"}
      aria-live="polite"
    >
      {children}
    </section>
  );
};

export default Container;

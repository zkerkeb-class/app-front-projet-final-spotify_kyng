import React from 'react';

const Container = ({ children, gradFrom, gradTo, textColor, darkTextColor }) => {
  return (
    <section
      className={`h-full w-full rounded-lg overflow-y-auto p-5 bg-gradient-to-b
       ${gradFrom || 'from-white dark:from-zinc-700'} 
       ${gradTo || 'to-zinc-700 dark:to-black'} 
       ${textColor || 'text-gray-800 dark:text-gray-100'} 
       ${darkTextColor || ''}`}
    >
      {children}
    </section>
  );
};

export default Container;

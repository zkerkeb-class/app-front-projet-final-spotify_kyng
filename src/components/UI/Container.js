import React from 'react';

const Container = ({ children, gradFrom, gradTo }) => {
  return (
    <section
      className={`h-full w-full rounded-lg overflow-y-auto py-5 pl-5 bg-gradient-to-b
       ${gradFrom ? gradFrom : 'dark:from-zinc-700 from-white'} ${gradTo ? gradTo : 'dark:to-black to-zinc-700'}`}
    >
      {children}
    </section>
  );
};

export default Container;

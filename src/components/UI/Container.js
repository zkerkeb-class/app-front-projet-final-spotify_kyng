import React from 'react';

const Container = ({ children, gradFrom, gradTo }) => {
  return (
    <section
      className={`h-full w-full overflow-y-auto py-5 pl-5 bg-gradient-to-b
       ${gradFrom ? gradFrom : 'from-zinc-700'} ${gradTo ? gradTo : 'to-black'}`}
    >
      {children}
    </section>
  );
};

export default Container;

import React from 'react';

const Container = ({ children, gradFrom, gradTo }) => {
  return (
    <section
      className={`h-full bg-gradient-to-b
       from-${gradFrom ? gradFrom : 'zinc-700'} to-${gradTo ? gradTo : 'black'}`}
    >
      {children}
    </section>
  );
};

export default Container;

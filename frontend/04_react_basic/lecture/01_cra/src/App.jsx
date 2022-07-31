import React from 'react';

export const App = () => {
  return <div>
    <span>Hello</span>
    <span>Student</span>
  </div>;
};

// export const App = () => {
//   return React.createElement('div', {
//     children: [
//       React.createElement('span', { children: 'Hello' }),
//       React.createElement('span', { children: 'Student' })
//     ]
//   });
// };

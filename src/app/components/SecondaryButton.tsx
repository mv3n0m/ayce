import React from 'react';

const SecondaryButton = ({ text }) => {
  return (
    <button
      className="bg-primary-default font-bold text-white py-2 px-6 w-full flex justify-center noshadow-button"
      type="submit"
    >
      {text}
    </button>
  );
};

export default SecondaryButton;
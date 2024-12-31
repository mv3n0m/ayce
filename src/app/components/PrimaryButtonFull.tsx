import React from 'react';

const PrimaryButton = ({ text }) => {
  return (
    <button
      className="flex items-center justify-center mx-auto w-full bg-primary-button text-white px-10 py-4 font-bold primary-button"
      type="submit"
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
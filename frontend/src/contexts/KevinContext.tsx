import React, { createContext, useState } from 'react';

export const KevinContext = createContext({
    htmlString: '',
    setHtmlString: (htmlString: string) => {},
    cssString: '',
    setCssString: (cssString: string) => {},
    promptString: '',
    setPromptString: (promptString: string) => {},
    nameString: 'Untitled Program',
    setNameString: (nameString: string) => {},
});

export const KevinProvider = ({ children }) => {
  const [htmlString, setHtmlString] = useState('');
  const [cssString, setCssString] = useState('');
  const [promptString, setPromptString] = useState('');
  const [nameString, setNameString] = useState('');

  const value = {
    htmlString,
    setHtmlString,
    cssString,
    setCssString,
    promptString,
    setPromptString,
    nameString,
    setNameString,
  };

  return (
    <KevinContext.Provider value={value}>
      {children}
    </KevinContext.Provider>
  );
};

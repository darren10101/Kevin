import React, { createContext, useState, useRef} from "react";

export const KevinContext = createContext({
  htmlString: "",
  setHtmlString: (htmlString: string) => {},
  cssString: "",
  setCssString: (cssString: string) => {},
  promptString: "",
  setPromptString: (promptString: string) => {},
  nameString: "Untitled Program",
  setNameString: (nameString: string) => {},
  afterVoice: false,
  setAfterVoice: (afterVoice: boolean) => {},
  previewRef: null,
  setPreviewRef: (previewRef: any) => {},
  describe: null,
  setDescribe: (describe: any) => {},
});

export const KevinProvider = ({ children }) => {
  const [htmlString, setHtmlString] = useState("");
  const [cssString, setCssString] = useState("");
  const [promptString, setPromptString] = useState("");
  const [nameString, setNameString] = useState("");
  const [afterVoice, setAfterVoice] = useState(false);
  const previewRef = useRef<HTMLIFrameElement>(null);
  
  const [describe, setDescribe] = useState(() => {});

  const value = {
    htmlString,
    setHtmlString,
    cssString,
    setCssString,
    promptString,
    setPromptString,
    nameString,
    setNameString,
    afterVoice,
    setAfterVoice,
    previewRef,
    describe,
    setDescribe
  };

  return (
    <KevinContext.Provider value={value}>{children}</KevinContext.Provider>
  );
};

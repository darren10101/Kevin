function prettifyHtml(htmlString: string) {
  // Regular expression to match HTML tags and content
  const tagRegex = /(<\/?[\w\s="/.':;#-\/\?]+>)/g;
  let indentLevel = 0;
  const indentSize = 2;
  let prettyHtml = '';

  // Tokenize the input string by splitting around HTML tags
  const tokens = htmlString.split(tagRegex).filter((token) => token.trim() !== '');

  // Function to generate indentation string
  const getIndent = (level: number) => ' '.repeat(level * indentSize);

  // Iterate through the tokens
  tokens.forEach((token) => {
    if (token.match(/^<\//)) {
      // Closing tag - reduce indent level and add the tag
      indentLevel -= 1;
      prettyHtml += getIndent(indentLevel) + token + '\n';
    } else if (token.match(/^<[\w]+/)) {
      // Opening tag - add the tag and increase indent level if it's not self-closing
      prettyHtml += getIndent(indentLevel) + token + '\n';
      if (!token.match(/\/>$/)) {
        indentLevel += 1;
      }
    } else if (token.match(/^</)) {
      // Self-closing tag - no change in indent level
      prettyHtml += getIndent(indentLevel) + token + '\n';
    } else {
      // Content - add with the current level of indentation
      prettyHtml += getIndent(indentLevel) + token.trim() + '\n';
    }
  });

  return prettyHtml.trim();
}
function prettifyCss(cssString: string) {
  let indentLevel = 0;
  const indentSize = 2;
  let prettyCss = '';

  // Split the CSS string into tokens (selectors, braces, and properties)
  const tokens = cssString
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .replace(/}/g, '}\n') // Ensure each closing brace is followed by a newline
    .replace(/{/g, ' {\n') // Ensure each opening brace is followed by a newline
    .replace(/;/g, ';\n') // Ensure each property ends with a newline
    .split('\n') // Split the string by newlines for easier processing
    .map((line: any) => line.trim()) // Trim each line to remove leading/trailing spaces
    .filter((line: any) => line.length > 0); // Remove empty lines

  // Function to generate indentation string
  const getIndent = (level: number) => ' '.repeat(level * indentSize);

  // Iterate through the tokens
  tokens.forEach((token: string) => {
    if (token.endsWith('}')) {
      // Decrease the indent level for closing braces
      indentLevel -= 1;
      prettyCss += getIndent(indentLevel) + token + '\n';
    } else if (token.endsWith('{')) {
      // Add the selector or media query at the current indent level
      prettyCss += getIndent(indentLevel) + token + '\n';
      indentLevel += 1; // Increase the indent level after an opening brace
    } else {
      // Add CSS properties at the current indent level
      prettyCss += getIndent(indentLevel) + token + '\n';
    }
  });

  return prettyCss.trim();
}

export { prettifyHtml, prettifyCss };
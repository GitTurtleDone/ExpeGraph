export function capitalizeFirstLetter(word: string) {
  let capWord = "";
  if (word !== "" && word !== null)
    capWord = word.replace(/^./, word[0].toUpperCase());
  return capWord;
}

export function camelToTitle(str: string) {
  let titleStr = "";
  if (str !== "" && str !== null)
    titleStr = str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, str[0].toUpperCase());
  return titleStr;
}

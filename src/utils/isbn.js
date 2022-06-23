const findISBN = data => {
  let elements = [];
  data.forEach((element, index) => {
    if (index > 0) elements.push(element.description.split("-").join(""));
  });
  elements = elements.join("");
  console.log(elements);
  const isbn = elements.match(/(978\d{10}|979\d{10}|\d{9}X|\d{10})/gi);
  return [...new Set(isbn)];
};

module.exports = findISBN;

let search;
let books;

fetch("/api/books")
  .then(response => response.json())
  .then(data => {
    books = data;
    display();
  });

$(".search").on("keyup", event => {
  search = event.originalEvent.target.value;
  display();
});

function display() {
  $(".books").empty();
  books
    .filter(
      element =>
        !search ||
        element.ocr[0].description.toUpperCase().includes(search.toUpperCase())
    )
    .forEach(element => {
      const { storage, ocr, isbn } = element;
      let isbnString = "";
      if (isbn.length) {
        isbnString = "ISBN " + isbn.join(", ");
      }
      //isbnString = "ISBN " + isbn;

      $(".books").append(
        $(`
            <div>
                <h3>${storage.name} </h3> 
                <p><b>${isbnString}</b></p>
                <div style="display: flex">
                    <img height="100" src='${storage.mediaLink}'/> 
                    <div> ${ocr[0].description.replace(
                      new RegExp("(" + search + ")", "ig"),
                      '<span style="background: yellow">$1</span>'
                    )}</div>
                </div>
            </div>
      `)
      );
    });
}

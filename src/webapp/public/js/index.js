fetch('/api/books')
  .then((response) => response.json())
  .then((data) => {
    data.forEach((element) => {
      const { storage } = element;
      $('.books').append(
        $(`
            <div> ${storage.name} <img height="100" src='${storage.mediaLink}'/></div>
        `)
      );
    });
  });

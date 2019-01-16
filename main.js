$(document).ready(function () {
  $.getJSON({
    url: './data/test.json',
    type: 'json',
    method: 'get',

    success: function (data) {
      initPage(data);

      const sortedItems = data.items.sort((a, b) => {
        return a.position - b.position;
      })

      // if categories enabled
      if (data.enable_multiple_lists) {
        const sortedCategories = data.categories.sort((a, b) => {
          return a.positionNumber - b.positionNumber;
        });

        // appends navbar to page
        $("body").append(`
        <nav class="navbar navbar-expand-sm navbar-dark bg-dark navbar-center">
          <a class="navbar-brand" href="#">Categories</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#tabs" aria-controls="tabs" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="tabs">
          <div class="nav navbar-nav"></div>
          </div>
        </nav>`);

        $("body").append('<div id="tabs-content" class="tab-content"></div>');

        for (const category of sortedCategories) {
          if (category.active) {
            $("#tabs div.navbar-nav").append(`<a id="cat${category.id}-tab" class="nav-item nav-link" data-toggle="tab"` +
              `href="#cat${category.id}" role="tab" aria-controls="cat${category.id}" aria-selected="false">${category.name}</a>`);

            $("#tabs-content").append(`<div id="cat${category.id}" class="tab-pane fade" role="tabpanel" aria-labelledby="cat${category.id}-tab"></div>`)

            for (const item of sortedItems) {
              if (category.items.includes(item.id)) {
                $(`#tabs-content #cat${category.id}`).append(setContent(item));
              }
            }
          } else {
            $("#tabs div.navbar-nav").append(`<a id="cat${category.id}-tab" class="nav-item nav-link disabled" data-toggle="tab"` +
              `href="#cat${category.id}" role="tab" aria-controls="cat${category.id}" aria-selected="false">${category.name}</a>`);

            $("#tabs-content").append(`<div id="cat${category.id}" class="tab-pane fade disabled" role="tabpanel" aria-labelledby="cat${category.id}-tab"></div>`)
          }
        }
        $("#tabs div.navbar-nav a:not(.disabled):first").addClass("show active");
        $("#tabs-content div:not(.disabled):first").addClass("show active");

        // if categories disabled
      } else {
        $("body").append('<div id="tabs-content" class="tab-content"></div>');

        for (const item of sortedItems) {
          $("#tabs-content").append(setContent(item));
        }
      }

      // hide navbar when category was choosed
      $(".nav-item.nav-link:not(.disabled)").click(function () {
        $(".navbar-toggler-icon").click();
      });

      // render modal window
      $(".card .row").click(function () {
        const itemId = parseInt($(this).attr("id").slice(4))
        const item = data.items.find((elem) => {
          return elem.id == itemId;
        });

        $("#modal").modal("show");

        $("#modalTitle")[0].innerText = item.title;
        $("#longDesc")[0].innerHTML = item.long_description.replace(/(http[^\s]+)/g, "<a href='$1'>$1</a>").replace(/(\n)/g, "<br>");

        $(".carousel-indicators")[0].innerHTML = `<li data-target="#carousel" data-slide-to="0" class="active"></li>`;
        $(".carousel-inner")[0].innerHTML = `<div class="carousel-item active">
          <img class="gallery-img" src="${item.gallery_images[0].url}">
        </div>`;

        loadPhotos(item);

        // shows video if exist
        if (item.videoUrl) {
          const url = item.videoUrl.match(/\/\w+$/)[0];

          $(".video").show();
          $("#video")[0].src = "https://www.youtube.com/embed" + url;
        }
      });

      // load all photos into carousel
      function loadPhotos(item) {
        if (item.gallery_images.length > 1) {
          const indicators = $(".carousel-indicators");
          var inner = $(".carousel-inner");

          for (let i = 1; i < item.gallery_images.length; i++) {
            indicators.append(`<li data-target="#carousel" data-slide-to="${i}"></li>`)
            inner.append(`<div class="carousel-item"><img class="gallery-img" src="${item.gallery_images[i].url}"></div>`);
          }

          $(".carousel-control-prev").show();
          $(".carousel-control-next").show();
        } else {
          $(".carousel-control-prev").hide();
          $(".carousel-control-next").hide();
        }
      }

      // unload video when modal closed
      $('#modal').on('hidden.bs.modal', function () {
        $("#video")[0].src = "";
        $(".video").hide();
      })
    }
  });
})

// page main parameters initialization 
function initPage(data) {
  $(document)[0].title = data.name;
  $("body")[0].style.color = "#" + data.accentColor;
  $("body")[0].style.backgroundColor = "#" + data.accentColorSecondary;
  $("#description")[0].innerText = data.description;
  $("#favicon")[0].href = "./img/Home-Icon_thumb.png"
}

// render item with its content
function setContent(item) {
  return `<div class="container-fluid py-3 item">
    <div class="card">
      <div class="row" id="item${item.id}">
        <div class="col-sm-4">
          <img src="${item.gallery_images[0].url}" class="small-img img-thumbnail">
        </div>
        <div class="col-sm-8 px-3">
          <div class="card-block px-3">
            <h4 class="card-title">${item.title}</h4>
            <p class="card-text">${item.description}</p>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

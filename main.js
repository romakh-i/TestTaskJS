$(document).ready(function () {
  $.getJSON({
    url: '/work/TestTaskJS/data/test.json',
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

            //$(`#tabs-content #cat${category.id}`).append(`<div class="container-fluid py-3"></div>`);
            //const contId = "cat" + category.id + "con";
            // $("body").append(`<div id=${contId} class="container"><ul></ul></div>`);
            // $("#" + contId).hide();

            for (const item of sortedItems) {
              if (category.items.includes(item.id)) {
                //showItem(item, contId);
                $(`#tabs-content #cat${category.id}`).append(setContent(item));
              }
            }
          } else {
            $("#tabs div.navbar-nav").append(`<a id="cat${category.id}-tab" class="nav-item nav-link disabled" data-toggle="tab"` +
              `href="#cat${category.id}" role="tab" aria-controls="cat${category.id}" aria-selected="false">${category.name}</a>`);

            $("#tabs-content").append(`<div id="cat${category.id}" class="tab-pane fade disabled" role="tabpanel" aria-labelledby="cat${category.id}-tab"></div>`)
          }
        }
        $("#tabs div.navbar-nav a:not(.disabled):first").addClass("show active"); //.tab("show");
        $("#tabs-content div:not(.disabled):first").addClass("show active");

        // if categories disabled
      } else {
        const contId = "cat0con";
        $("body").append(`<div id="${contId}" class="container"><ul></ul></div>`);
        for (const item of sortedItems) {
          showItem(item, contId);
        }
      }

      // switch category
      $("#tabs li a").click(function () {
        const contId = "#" + $(this).attr("id") + "con";
        if ($(this).hasClass("not-active")) {
          $("#tabs li a").addClass("not-active");
          $(".container").hide();

          $(this).removeClass("not-active");
          $(contId).fadeIn("slow");
        } else {
          $(this).addClass("not-active");
          $(contId).hide()
        }
      });

      // open modal window about item
      $(".container ul li").click(function () {
        const itemId = parseInt($(this).attr("id").slice(3, 6));
        const item = data.items.find((elem) => {
          return elem.id == itemId
        });

        $(".modal")[0].style.display = "block";

        $("#itemTitle")[0].innerText = item.title;
        $("#longDesc")[0].innerHTML = item.long_description.replace(/(http[^\s]+)/g, "<a href='$1'>$1</a>").replace(/(\n)/g, "<br>");
        $(".gallery-img")[0].src = item.gallery_images[0].url;
        const photoPath = getPhotoPath();
        $(".photoNumber")[0].innerText = getPhotoNumber(data, $("#itemTitle")[0].innerText, photoPath);

        // shows video if exist
        if (item.videoUrl) {
          const url = item.videoUrl.match(/\/\w+$/)[0];
          const video = $(".video")[0];

          video.src = "https://www.youtube.com/embed" + url;
          video.style.display = "block";
        }
      })

      // switches to next photo
      $(".next").click(function () {
        const photoPath = getPhotoPath();
        const nextPhoto = getNextPhoto(data, $("#itemTitle")[0].innerText, photoPath);

        $(".gallery-img")[0].src = nextPhoto;
        $(".photoNumber")[0].innerText = getPhotoNumber(data, $("#itemTitle")[0].innerText, nextPhoto);
      });
      // switches to previous photo
      $(".prev").click(function () {
        const photoPath = getPhotoPath();
        const prevPhoto = getPrevPhoto(data, $("#itemTitle")[0].innerText, photoPath);

        $(".gallery-img")[0].src = prevPhoto;
        $(".photoNumber")[0].innerText = getPhotoNumber(data, $("#itemTitle")[0].innerText, prevPhoto);
      });
    }
  });

  // close the modal window by clicking on X button
  $(".close").click(function () {
    $(".modal")[0].style.display = "none";
    const video = $(".video")[0];
    video.src = "";
    video.style.display = "none";
  });
})

// close the modal window by clicking anywhere outside
$(window).click(function (event) {
  let modal = $(".modal")[0];
  if (event.target == modal) {
    modal.style.display = "none";
  }
})

function initPage(data) {
  $(document)[0].title = data.name;
  $("body")[0].style.color = "#" + data.accentColor;
  $("body")[0].style.backgroundColor = "#" + data.accentColorSecondary;
  $("#description")[0].innerText = data.description;
  $("#favicon")[0].href = "./img/Home-Icon_thumb.png"
}

function setContent(item) {
  return `<div class="container-fluid py-3 item-content">
    <div id="item${item.id}" class="card">
      <div class="row ">
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

// shows one item
function showItem(item, contId) {
  const itemId = "cat" + item.id + "item";

  $("#" + contId + " ul").append(`<li id=${itemId}></li>`);

  $("#" + itemId).append(`<img src="${item.gallery_images[0].url}" class="small-img"/>`);
  $("#" + itemId).append(`<h4 class="title">${item.title}</h4>`);
  $("#" + itemId).append(`<p class="desc">${item.description}</p>`);
}
// gets photo path without root directory
function getPhotoPath() {
  return $(".gallery-img")[0].src.match(/img\/items\/.+$/);
}
// get number of current photo from all
function getPhotoNumber(data, title, currPhotoUrl) {
  const images = getItemByTitle(data, title).gallery_images;
  if (images.length == 1)
    return null;

  for (let i = 0; i < images.length; i++) {
    if (images[i].url == currPhotoUrl) {
      return (i + 1) + "/" + images.length;
    }
  }
}
// return url of next photo
function getNextPhoto(data, title, currPhotoUrl) {
  const images = getItemByTitle(data, title).gallery_images;
  if (images.length == 1) return currPhotoUrl;

  for (let i = 0; i < images.length; i++) {
    if (images[i].url == currPhotoUrl) {
      if (i != images.length - 1) {
        return images[i + 1].url;
      } else return images[0].url;
    }
  }
}
// return url of previous photo
function getPrevPhoto(data, title, currPhotoUrl) {
  const images = getItemByTitle(data, title).gallery_images;
  if (images.length == 1) return currPhotoUrl;

  for (let i = 0; i < images.length; i++) {
    if (images[i].url == currPhotoUrl) {
      if (i != 0) {
        return images[i - 1].url;
      } else return images[images.length - 1].url;
    }
  }
}
// retrieve item by its description
function getItemByTitle(data, title) {
  return data.items.find((elem) => {
    return elem.title == title;
  })
}
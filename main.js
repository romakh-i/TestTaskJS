$(document).ready(function () {
  $.ajax({
    url: 'https://api.myjson.com/bins/1g83li',
    success: function (data) {
      initPage(data);

      if (data.enable_multiple_lists) {
        const sortedCategories = data.categories.sort((a, b) => {
          return a.positionNumber - b.positionNumber
        });

        $("body").append(`<ul id="tabs"></ul>`);
        for (const category of sortedCategories) {
          if (category.active) {
            $("#tabs").append(`<li><a id="c${category.id}">${category.name}</a></li>`)
            $("#tabs li a").addClass("not-active");
          }
        }

        $("#tabs li a").click(function () {
          if ($(this).hasClass("not-active")) {
            $("#tabs li a").addClass("not-active");
            $(this).removeClass("not-active");
          } else {
            $(this).addClass("not-active");
          }
        });
      }
    }
  });
})

function initPage(data) {
  document.title = data.name;
  document.body.style.color = "#" + data.accentColor;
  document.body.style.backgroundColor = "#" + data.accentColorSecondary;
  document.getElementById("description").innerText = data.description;
}
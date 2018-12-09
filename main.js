$(document).ready(function () {
  $.ajax({
    url: 'https://api.myjson.com/bins/1g83li',
    success: function (data) {
      initPage(data);

      if (data.enable_multiple_lists) {
        const sortedCategories = data.categories.sort((a, b) => {
          return a.positionNumber - b.positionNumber;
        });

        $("body").append(`<ul id="tabs"></ul>`);
        for (const category of sortedCategories) {
          if (category.active) {
            $("#tabs").append(`<li><a id="cat${category.id}">${category.name}</a></li>`)
            $("#tabs li a").addClass("not-active");

            const contId = "cat" + category.id + "con";
            $("body").append(`<div id=${contId} class="container"><ul></ul></div>`)
            $("#" + contId).hide();

            const sortedItems = data.items.sort((a, b) => {
              return a.position - b.position;
            })
            for (const item of sortedItems) {
              if (category.items.includes(item.id)) {
                $("#" + contId + " ul").append(`<li id="cat${category.id}item">${item.title}</li>`);
              }
            }
          }
        }


        $("#tabs li a").click(function () {
          const id = "#" + $(this).attr("id") + "con";
          if ($(this).hasClass("not-active")) {
            $("#tabs li a").addClass("not-active");
            $(".container").hide();
            $(this).removeClass("not-active");
            $(id).fadeIn("slow");
          } else {
            $(this).addClass("not-active");
            $(id).hide()
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
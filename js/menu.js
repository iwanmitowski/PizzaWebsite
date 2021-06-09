(function () {
  // Also used in cart.js
  // TODO: remove this duplication
  function formatPrice(price) {
    return `${price.toFixed(2)}лв`;
  }

  function attachOrderHandlers() {
    document.querySelectorAll(".order-button").forEach(function (button) {
      button.addEventListener("click", function (e) {
        var parent = e.target.parentElement;
        var rootElement = e.target.parentElement.parentElement.parentElement;
        var pizzaName = rootElement.querySelector(
          ".mobile-pizza-header"
        ).textContent;

        var pizzaImageUrl = rootElement
          .querySelector(".pizza-image")
          .getAttribute("src");
        var pizzaPrice = +rootElement
          .querySelector(".price-accent")
          .textContent.slice(0, -2);
        var pizzaSize = rootElement.querySelector(".size-button.selected");
        if (pizzaSize == null) {
          // No size selected
          iziToast.warning({
            id: "warning",
            title: "Моля изберете размер",
            // message: 'You forgot important data',
            position: "bottomRight",
            transitionIn: "flipInX",
            transitionOut: "flipOutX",
          });
        } else {
          pizzaSize = pizzaSize.textContent;

          // Get current order
          idbKeyval.get("order").then(function (order) {
            if (order == null) order = [];
            var cartMatch = order.find(function (p) {
              return p.name === pizzaName && p.size === pizzaSize;
            });

            if (cartMatch != null) {
              cartMatch.quantity++;
            } else {
              order.push({
                name: pizzaName,
                price: pizzaPrice,
                size: pizzaSize,
                imageUrl: pizzaImageUrl,
                quantity: 1,
              });
            }

            idbKeyval
              .set("order", order)
              .then(function () {
                iziToast.success({
                  id: "success",
                  title: `Добавихте пица ${pizzaName} в количката`,
                  position: "bottomRight",
                  transitionIn: "flipInX",
                  transitionOut: "flipOutX",
                  // iconText: 'star',
                });
              })
              .catch(function (err) {
                iziToast.error({
                  id: "error",
                  title: `Настъпи грешка при добавянето в количката`,
                  position: "bottomRight",
                  transitionIn: "flipInX",
                  transitionOut: "flipOutX",
                  // iconText: 'star',
                });
              });
          });
        }
      });
    });
  }

  function attachSizeHandlers() {
    var sizePriceIncrement = {
      S: 0,
      M: 2,
      L: 4,
    };

    document.querySelectorAll(".size-button").forEach(function (button) {
      button.addEventListener("click", function (e) {
        var rootElement = e.target.parentElement.parentElement.parentElement;
        var basePrice = +rootElement.dataset.basePrice;
        var size = e.target.textContent;

        var otherButtons = rootElement.querySelectorAll(".size-button");
        var priceElement = rootElement.querySelector(".price-accent");

        var newPrice = basePrice + sizePriceIncrement[size];

        priceElement.textContent = formatPrice(newPrice);

        otherButtons.forEach(function (b) {
          b.classList.remove("selected");
        });

        e.target.classList.add("selected");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    attachSizeHandlers();
    attachOrderHandlers();
  });
})();

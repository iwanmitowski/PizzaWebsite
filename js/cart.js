(function () {
  var sizesMap = {
    S: "Малка",
    M: "Средна",
    L: "Голяма",
  };

  var reverseMap = {
    Малка: "S",
    Средна: "M",
    Голяма: "L",
  };

  function attachQuantityButtons() {
    // Since buttons are loaded async, we have to delegate the event handlers

    document
      .querySelector(".cart-table")
      .addEventListener("click", function (e) {
        if (!e.target.matches(".quantity-button")) {
          return;
        }

        var target = e.target;
        var rootElement = e.target;
        while (rootElement.nodeName !== "TR")
          rootElement = rootElement.parentElement;

        var price = +rootElement.dataset.price;
        var totalPriceElement = document.querySelector(".cart-total");
        var priceElement = rootElement.querySelector(".cart-product-price");

        var pizzaName =
          rootElement.querySelector(".cart-product-name").textContent;

        var isMinus = target.matches(".button-minus");
        var quantityElement = rootElement.querySelector(
          ".cart-product-quantity"
        );
        var quantity = +quantityElement.textContent;
        var size =
          reverseMap[
            rootElement.querySelector(".cart-product-size").textContent
          ];

        var shouldRefresh = false;

        idbKeyval.get("order").then(function (products) {
          // Remove from idb and later refresh
          if (isMinus && quantity === 1) {
            products = products.filter((p) => p.name !== pizzaName || p.size !== size);
            shouldRefresh = true;
          } else {
            products = products.map((p) => {
              if (p.name !== pizzaName || p.size !== size) return p;

              var totalPrice = +totalPriceElement.textContent.slice(0, -2);
              var subPrice = +priceElement.textContent.slice(0, -2);
              if (isMinus) {
                p.quantity--;
                totalPrice -= price;
                subPrice -= price;
                quantity--;
              } else {
                p.quantity++;
                totalPrice += price;
                subPrice += price;
                quantity++;
              }

              totalPriceElement.textContent = formatPrice(totalPrice);
              priceElement.textContent = formatPrice(subPrice);
              quantityElement.textContent = quantity;
              return p;
            });
          }

          idbKeyval.set("order", products).then(() => {
            if (shouldRefresh) {
              window.location.reload();
            }

            iziToast.success({
              id: "success",
              title: `Променихте количеството на пица ${pizzaName}`,
              position: "bottomRight",
              transitionIn: "flipInX",
              transitionOut: "flipOutX",
            });
          });
        });
      });
  }

  function setDeliveryTime() {
    var element = document.getElementById("delivery-time");

    var deliveryTimes = [25, 30, 35, 40, 45];

    var randomIndex = Math.floor(Math.random() * deliveryTimes.length);

    element.innerText = deliveryTimes[randomIndex].toString();
  }

  function formatPrice(price) {
    return `${price.toFixed(2)}лв`;
  }

  function onOrder() {
    document
      .querySelector(".delivery-form")
      .addEventListener("submit", function (е) {
        е.preventDefault();
        iziToast.success({
          id: "success",
          title: "Благодарим ви за поръчката!",
          position: "bottomRight",
          transitionIn: "flipInX",
          transitionOut: "flipOutX",
          onClosed: function () {
            function redirectToHome() {
              window.location.href = window.location.href.replace(
                "cart.html",
                ""
              );
            }
            idbKeyval
              .set("order", null)
              .then(redirectToHome)
              .catch(redirectToHome);
          },
        });
      });
  }

  function loadOrder() {
    idbKeyval
      .get("order")
      .then((products) => {
        if (products == null || products.length === 0) {
          document.querySelector(".cart-empty").style.display = "block";
          document.querySelector(".cart-full").style.display = "none";
        } else {
          var template = document.getElementById("cart-template");
          var productsParent = document.querySelector(".cart-products");

          var totalPrice = 0;

          for (var i = 0; i < products.length; i++) {
            var product = products[i];
            var productElement = template.content.cloneNode(true);

            var root = productElement.querySelector(".cart-product-row");
            root.dataset.price = product.price;

            var image = productElement.querySelector(".cart-product-image");
            image.src = product.imageUrl;
            image.alt = product.name;

            var name = productElement.querySelector(".cart-product-name");
            name.innerText = product.name;

            var size = productElement.querySelector(".cart-product-size");
            size.innerText = sizesMap[product.size];

            var quantity = productElement.querySelector(
              ".cart-product-quantity"
            );
            quantity.innerText = product.quantity;

            var price = productElement.querySelector(".cart-product-price");
            var subtotal = product.price * product.quantity;

            price.innerText = formatPrice(subtotal);

            productsParent.appendChild(productElement);

            totalPrice += subtotal;
          }

          document.querySelector(".cart-total").innerText =
            formatPrice(totalPrice);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadOrder();
    setDeliveryTime();
    onOrder();
    attachQuantityButtons();
  });
})();

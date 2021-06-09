(function () {
  var sizesMap = {
    S: "Малка",
    M: "Средна",
    L: "Голяма",
  };

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
            idbKeyval
              .set("order", null)
              .then(() => {
                // Redirect to home page
                window.location.href = window.location.origin;
              })
              .catch(function () {
                // Redirect to home page
                window.location.href = window.location.href.replace('cart.html', '');
              });
          },
        });
      });
  }

  function loadOrder() {
    idbKeyval
      .get("order")
      .then((products) => {
        if (products == null) {
          document.querySelector(".cart-empty").style.display = "block";
          document.querySelector(".cart-full").style.display = "none";
        } else {
          var template = document.getElementById("cart-template");
          var productsParent = document.querySelector(".cart-products");

          var totalPrice = 0;

          for (var i = 0; i < products.length; i++) {
            var product = products[i];
            var productElement = template.content.cloneNode(true);

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
  });
})();

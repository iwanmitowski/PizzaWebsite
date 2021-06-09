window.addEventListener("load", onload);
var phonePattern = /^(\d{4}-\d{3}-\d{3})$/;

function Validate() {
  var nameValue = document.getElementById("fName")?.value;
  var namePattern = /^([A-Я][a-я]+(-[A-я])?[a-я]+)$/;

  var surnameValue = document.getElementById("fSurname")?.value;
  var surnamePattern = /^([A-Я][a-я]+)$/;

  var emailValue = document.getElementById("fEmail")?.value;
  var emailPattern =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  var phoneValue = document.getElementById("phone")?.value;

  var addressValue = document.getElementById("address")?.value;
  var addressPattern = /([A-Я][a-я]{3,}).+\d+/;

  if (nameValue != null && !namePattern.test(nameValue || nameValue.length < 2)) {
    alert("Моля, въведете валидно име!");

    return false;
  }

  if (surnameValue != null && !surnamePattern.test(surnameValue || surnameValue.length < 3)) {
    alert("Моля, въведете валидна фамилия!");

    return false;
  }

  if (emailValue != null && !emailPattern.test(emailValue)) {
    alert("Моля, въведете валиден e-mail!");

    return false;
  }

  if (phoneValue != null && !phonePattern.test(phoneValue)) {
    alert("Моля, въведете телефонен номер!");

    return false;
  }

  if (addressValue != null && !addressPattern.test(addressValue)) {
    alert("Моля, въведете валиден адрес!");

    return false;
  }

  return true;
}

function onload() {
  var dashPositions = [4, 8];
  var phoneElement = document.getElementById("phone");
  var previousValue = phoneElement.value;

  phoneElement.addEventListener("input", function (event) {
    var target = event.target;
    var value = target.value;

    // Do not insert dashes in case of backspace
    if (previousValue.length < value.length) {
      if (dashPositions.indexOf(value.length) >= 0) {
        event.target.value += "-";
      }
    }

    previousValue = value;
  });
}

$(document).ready(function () {

  $('.first-button').on('click', function () {

    $('.animated-icon1').toggleClass('open');
  });
  $('.second-button').on('click', function () {

    $('.animated-icon2').toggleClass('open');
  });
  $('.third-button').on('click', function () {

    $('.animated-icon3').toggleClass('open');
  });
});

import { goods } from "./const.js";

$(document).ready(function () {
   const newProd = $('<p class="product__heading-new accent">new product</p>');
   //ОТКРЫВАЕТ КОРЗИНУ ИЗ МЕНЮ

   $(".btn-busket").click(function () {
      $(".popup-busket").css("visibility", "visible");
      $(".popup-busket").css("opacity", "1");
   });

   //ЗАКРЫВАЕТ POPUP ПО НАЖАТИЮ ВОКРУГ

   $("body").click(function (evt) {
      if (evt.target.classList.contains("overlay")) {
         $(".popup-busket").css("visibility", "hidden");
         $(".popup-busket").css("opacity", "0");
      }
   });

   // Подгружает нужные товары в зависимости от нажатой кнопки
   createCard("headphones", "#catalogue-headphones");

   createCard("speakers", "#catalogue-speakers");

   createCard("earphones", "#catalogue-earphones");

   //Создает карточку товара в каталоге
   function createCard(category, id) {
      let isLeft = true;

      for (let i in goods) {
         if (goods[i].category == category) {
            let newCard = isLeft ? $.parseHTML($(`${id} .template__catalogue-item-left`).clone().html()) : $.parseHTML($(`${id} .template__catalogue-item-right`).clone().html());
            createNewCard(id, newCard, goods[i]);
            isLeft = !isLeft;
         }
      }
   }

   //Записывает выбранный товар в lacalStorage
   $(".btn").on("click", function () {
      localStorage.setItem("currentProduct", $(this).attr("id"));
   });

   function createNewCard(id, template, data, isDetailed = false) {
      $(template).find("img").attr("src", data.categoryImage.desktop);
      $(template).find(".product__name").text(data.name);
      $(template).find(".product__text").text(data.description);
      $(template).find("a").attr("id", data.slug);
      if (data.new == true) {
         $(template).find(".product__description").prepend(newProd);
      }
      if (!isDetailed) {
         $(`${id} .products .container`).append(template);
      } else {
         $(template).find(".product-price").text(data.price);
         $(`${id} .product-details`).append(template);
         $("#product-details").find(".info__text").text(data.features);
      }
   }

   //  Добавляет интерактивность счетчику товаров

   //  Изменяет карточку каждого товара
   function createDetailedCard(id) {
      for (let i in goods) {
         if (goods[i].slug == localStorage.getItem("currentProduct")) {
            let newCard = $.parseHTML($(`${id} .template__product-details`).clone().html());

            createNewCard(id, newCard, goods[i], true);

            //Добавляет комлектующие
            for (let j in goods[i].includes) {
               let complectationUnit = $.parseHTML($(".template-complectation").clone().html());
               $(complectationUnit)
                  .find(".accessory-quant")
                  .text(goods[i].includes[j].quantity + "x");
               $(complectationUnit).find(".accessory-unit").text(goods[i].includes[j].item);
               $(".info__list").append(complectationUnit);
            }

            //Добавляет картинки для галереи
            $(".gallery__1").attr("src", goods[i].gallery.first.desktop);
            $(".gallery__2").attr("src", goods[i].gallery.second.desktop);
            $(".gallery__3").attr("src", goods[i].gallery.third.desktop);

            addRandomCards();
         }
      }
   }

   function addRandomCards() {
      let randIndexes = getRandomNum();

      //Добавляет рандомные карточки

      for (let index of randIndexes) {
         let selectionItem = $.parseHTML($(".template-selection").clone().html());

         $(selectionItem).find(".selection__img").attr("src", goods[index].categoryImage.desktop);
         $(selectionItem).find(".selection__name").text(goods[index].name);
         $(selectionItem).find("a").attr("id", goods[index].slug);

         $(".selection__list").append(selectionItem);
      }
   }

   function getRandomNum() {
      let randNumbArr = [];
      while (randNumbArr.length < 3) {
         let randNumb = Math.floor(Math.random() * goods.length);
         let found = false;
         for (let i = 0; i < randNumbArr.length; i++) {
            if (randNumbArr[i] === randNumb) {
               found = true;
               break;
            }
         }
         if (!found) {
            randNumbArr[randNumbArr.length] = randNumb;
         }
      }
      return randNumbArr;
   }

   createDetailedCard("#product-details");

   //Добавляет в localStorage товар для корзины
   $("#product-details .product .btn").on("click", function (evt) {
      evt.preventDefault();
      let modelName = $(this).attr("id");
      let modelQuantity = $("#detailed__input").attr("value");
      let checkName = "busket-" + $(this).attr("id");

      if (localStorage.getItem(checkName) == null) {
         localStorage.setItem("busket-" + modelName, modelQuantity);
         createBusketItems(true, modelName);
         $("#busket-count").attr("value", getBusketItemSum());
         $("#busket-totalPrice").text(getBusketSum());
      }
   });

   //Добавляет интерактивность каунтеру в detailed card
   $(document).on("click", "#detailed__increment", function () {
      let quantityDetailed = parseFloat($("#detailed__input").attr("value"));
      $("#detailed__input").attr("value", ++quantityDetailed);
   });

   $(document).on("click", "#detailed__decrement", function () {
      let quantityDetailed = parseFloat($("#detailed__input").attr("value"));
      if (quantityDetailed > 0) {
         $("#detailed__input").attr("value", --quantityDetailed);
      }
   });

   //Добавляет слушателей на кнопки количества товаров в корзине
   let totalQuantityBusket = parseFloat($("#busket-count").attr("value"));


   function addListenersToBusketCards(id) {
      $(document).on("click", "#busket__increment-" + id, function () {
         //$(this).parent('.product__counter').children('#busket__input').attr('value')
         let key = $(this).closest(".busket__item").attr("id").replace(/Item/g, "").replace(/__/g, "-");
         let value = parseFloat(localStorage.getItem(key));

         localStorage.setItem(key, ++value);
         $("#busket__input-" + id).attr("value", value);
         $("#busket-count").attr("value", ++totalQuantityBusket);
         $("#busket-totalPrice").text(getBusketSum());
      });

      $(document).on("click", "#busket__decrement-" + id, function () {
         let key = $(this).closest(".busket__item").attr("id").replace(/Item/g, "").replace(/__/g, "-");
         let value = parseFloat(localStorage.getItem(key));

         localStorage.setItem(key, --value);

         if (value > 0) {
            $("#busket__input-" + id).attr("value", value);
            $("#busket-count").attr("value", --totalQuantityBusket);
            $("#busket-totalPrice").text(getBusketSum());
         }
         if (value == 0) {
            $(this).closest(".busket__item").remove();
            localStorage.removeItem($(this).closest(".busket__item").attr("id").replace(/Item/g, "").replace(/__/g, "-"));
            $("#busket-totalPrice").text(getBusketSum());
         }
      });

      let sum = 0;
      // $(document).on("input", "#busket__input-" + id, function () {
      //    let count = localStorage.getItem($(this).closest(".busket__item").attr("id").replace(/Item/g, "").replace(/__/g, "-"));
      //    sum += parseFloat(count);
      //    $(".busket-count").text(sum);
      //    console.log('test')
      // });
   }

   //Считает количество товара в корзине из localStorage
   function getBusketItemSum() {
      totalQuantityBusket = 0;

      for (let i = 0; i < localStorage.length; i++) {
         let key = localStorage.key(i);
         let value = localStorage.getItem(key);

         if ($.isNumeric(value)) {
            totalQuantityBusket += parseFloat(value);
         }
      }
      return totalQuantityBusket;
   }

   // Считает итоговую сумму в корзине
   function getBusketSum() {
      let totalSum = 0;

      for (let i = 0; i < localStorage.length; i++) {
         let modelName = localStorage.key(i).replace(/busket-/g, "");
         let modelQuantity = localStorage.getItem(localStorage.key(i));
         let modelSum = 0;

         for (let i in goods) {
            if (goods[i].slug === modelName) {
               let modelPrice = goods[i].price;
               modelSum = modelPrice * modelQuantity;
               totalSum += modelSum;
            }
         }
      }
      return totalSum;
   }

   //Добавляет элемент в корзину
   function createBusketItems(isUpdate = false, name = null) {
      if (!isUpdate) {
         for (let j = 0; j < localStorage.length; j++) {
            let busketKey = localStorage.key(j).slice(7);
            let busketValue = localStorage.getItem(localStorage.key(j));

            for (let i in goods) {
               if (goods[i].slug === busketKey) {
                  let newBusketItem = $.parseHTML($(".template__busket-item").clone().html());
                  $(newBusketItem).attr("id", `busketItem__${goods[i].slug}`);
                  $(newBusketItem).find(".busket__img").attr("src", goods[i].busketImg.src);
                  $(newBusketItem).find(".busket__name").text(goods[i].busketName);
                  $(newBusketItem).find(".busket-price").text(goods[i].price);
                  $(newBusketItem).find(".product__quantity").attr("value", busketValue);
                  $(newBusketItem).find(".product__increment").attr("id", `busket__increment-${i}`);
                  $(newBusketItem).find(".product__decrement").attr("id", `busket__decrement-${i}`);
                  $(newBusketItem).find(".product__quantity").attr("id", `busket__input-${i}`);
                  $(document).ready(function () {
                     $(".busket__heading").find(".busket-count").text(findTotalQuantity());
                  });

                  $(".busket__list").append(newBusketItem);
                  addListenersToBusketCards(i);
               }
            }
         }
         $("#busket-count").attr("value", getBusketItemSum());
         $("#busket-totalPrice").text(getBusketSum());
      

      } else if (isUpdate) {
         let addedCount = $("#detailed__input").attr("value");
         for (let i in goods) {
            if (goods[i].slug === name) {
               let newBusketItem = $.parseHTML($(".template__busket-item").clone().html());
               $(newBusketItem).attr("id", `busketItem__${goods[i].slug}`);
               $(newBusketItem).find(".busket__img").attr("src", goods[i].busketImg.src);
               $(newBusketItem).find(".busket__name").text(goods[i].busketName);
               $(newBusketItem).find(".busket-price").text(goods[i].price);
               $(newBusketItem).find(".product__quantity").attr("value", addedCount);
               $(newBusketItem).find(".product__increment").attr("id", `busket__increment-${i}`);
               $(newBusketItem).find(".product__decrement").attr("id", `busket__decrement-${i}`);
               $(newBusketItem).find(".product__quantity").attr("id", `busket__input-${i}`);
               $(document).ready(function () {
                  $(".busket__heading").find(".busket-count").text(findTotalQuantity());
               });

               $(".busket__list").append(newBusketItem);
               addListenersToBusketCards(i);
            }
         }
      }
   }

   function findTotalQuantity() {
      let total = 0;
      let inputs = $(".busket__quantity");
      inputs.each(function () {
         total += parseFloat($(this).val());
      });
      return total;
   }

   function findTotalSum() {
      let sum = 0;
      $(".busket-price").each(function () {
         // sum+=parseFloat($(this).text()) * parseFloat($(this).parent('.busket__innerItem').find('.busket__quantity').val())
         $(this).css("background-color", "red");
      });
   }

   //Очищает localStorage по нажатию на кнопку
   $(".busket__remove").on("click", function () {
      localStorage.clear();

      $(".busket__item").each(function () {
         $(this).remove();
      });

      $("#busket-count").attr("value", 0);
      $("#busket-totalPrice").text(getBusketSum());
   });

   createBusketItems();
});

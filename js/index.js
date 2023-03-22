// Записывает данные из json в переменную goods
import { goods } from "./const.js";
console.log(goods);

$(function () {
   //ОТКРЫВАЕТ КОРЗИНУ ИЗ МЕНЮ
   $(".btn-busket").click(function (evt) {
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
      let newProd = $('<p class="product__heading-new accent">new product</p>');
      for (let i in goods) {
         if (goods[i].category == category) {
            if (isLeft == true) {
               let newCardLeft = $.parseHTML($(`${id} .template__catalogue-item-left`).clone().html());
               $(newCardLeft).find("img").attr("src", goods[i].categoryImage.desktop);
               $(newCardLeft).find(".product__name").text(goods[i].name);
               $(newCardLeft).find(".product__text").text(goods[i].description);
               $(newCardLeft).find("a").attr("id", goods[i].slug);

               if (goods[i].new == true) {
                  $(newCardLeft).find(".product__description").prepend(newProd);
               }
               $(`${id} .products .container`).append(newCardLeft);
               isLeft = false;
            } else if (isLeft == false) {
               let newCardRight = $.parseHTML($(`${id} .template__catalogue-item-right`).clone().html());
               $(newCardRight).find("img").attr("src", goods[i].categoryImage.desktop);
               $(newCardRight).find(".product__name").text(goods[i].name);
               $(newCardRight).find(".product__text").text(goods[i].description);
               $(newCardRight).find("a").attr("id", goods[i].slug);

               if (goods[i].new == true) {
                  $(newCardRight).find(".product__description").prepend(newProd);
               }
               $(`${id} .products .container`).append(newCardRight);
               isLeft = true;
            }
         }
      }
   }

   //Записывает выбранный товар в lacalStorage
   $(".btn").on("click", function () {
      localStorage.setItem("currentProduct", $(this).attr("id"));
   });

   //  Изменяет карточку каждого товара
   function createDetailedCard(id) {
      let newProd = $('<p class="product__heading-new accent">new product</p>');
      for (let i in goods) {
         if (goods[i].slug == localStorage.getItem("currentProduct")) {
            let newCard = $.parseHTML($(`${id} .template__product-details`).clone().html());
            $(newCard).find("img").attr("src", goods[i].categoryImage.desktop);
            $(newCard).find(".product__name").text(goods[i].name);
            $(newCard).find(".product__text").text(goods[i].description);
            $(newCard).find(".product-price").text(goods[i].price);
            $(newCard).find("a").attr("id", goods[i].slug);
            if (goods[i].new == true) {
               $(newCard).find(".product__description").prepend(newProd);
            }
            $(`${id} .product-details`).append(newCard);
            $("#product-details").find(".info__text").text(goods[i].features);

            //  Добавляет интерактивность счетчику товаров
            let quantity = parseFloat($(".product__quantity").attr('value'));
            $(".product__increment").on("click", function () {
               $(".product__quantity").attr('value',++quantity);
            });

            $(".product__decrement").on("click", function () {
               if (quantity > 0) {
                  $(".product__quantity").attr('value',--quantity);
               }
            });

            // $('.product__quantity').on("change", function () {
            //    if (quantity === 0) {
            //     console.log(quantity)
            //       $("#product-details .product .btn").css("background-color", "#fbaf85");
            //    }
            //    if (quantity > 0) {
            //       $("#product-details .product .btn").css("background-color", "#D87D4A");
            //    }
            // });
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

            //Генерирует массив из 3 рандомный чисел от 1 до 6
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

            let randIndexes = getRandomNum()

            //Добавляет рандомные карточки

            for (let index of randIndexes) {
               let selectionItem = $.parseHTML($(".template-selection").clone().html());

               $(selectionItem).find(".selection__img").attr("src", goods[index].categoryImage.desktop);
               $(selectionItem).find(".selection__name").text(goods[index].name);
               $(selectionItem).find("a").attr("id", goods[index].slug);

               $(".selection__list").append(selectionItem);
            }
         }
      }
   }
   createDetailedCard("#product-details");

   //Добавляет товары для корзины в localStorage

   //  let busketProduct = [];
   //  let i = 1;
   //  $('#product-details .product .btn').on('click',function(evt){
   //    evt.preventDefault()
   //    let modelName = $(this).attr('id')
   //    let modelPrice = $('.product-price').text()
   //    let modelQuantity = $('.product__quantity').val()
   //   busketProduct.push({ name:modelName,
   //                        quantity:parseFloat(modelQuantity),
   //                        price:parseFloat(modelPrice)
   //                       })

   //    localStorage.setItem('busketProduct-'+i,JSON.stringify(busketProduct));
   //    i+=1
   //  })

   $("#product-details .product .btn").on("click", function (evt) {
      evt.preventDefault();
      let modelName = $(this).attr("id");
      let modelQuantity = $(".product__quantity").attr('value');
      localStorage.setItem("busket-" + modelName, modelQuantity);
   });

   function createBusketItems() {
      for (let j = 0; j < localStorage.length; j++) {
        let busketKey = localStorage.key(j).slice(7);
        let busketValue = localStorage.getItem(localStorage.key(j))
      
         for (let i in goods) {     
            if (goods[i].slug === busketKey) {
              let newBusketItem = $.parseHTML($(".template__busket-item").clone().html());
              $(newBusketItem).find(".busket__img").attr("src",goods[i].busketImg.src );
              $(newBusketItem).find(".busket__name").text(goods[i].busketName)
              $(newBusketItem).find(".busket-price").text(goods[i].price)
              $(newBusketItem).find(".busket__quantity").attr('value',busketValue)
              // $(newBusketItem).find(".busket-count").text()

                //Находит количество товаров в корзине
                function findTotalQuantity (){
                  let total = 0;
                  let inputs = $('.busket__quantity')
                  console.log(inputs)
                }

                function findTotalSum(){
                  let sum = 0;
                  $('.busket-price:visible').each(function(){
                    $(this).css('background-color','red')
                  })

                }

                findTotalSum()
              $(".busket__list").append(newBusketItem)
              
         
            }
         }
      }
   }

   //Очищает localStorage по нажатию на кнопку
   $('.busket__remove').on('click',function(){
    localStorage.clear();
    $(".busket__item").each(function(){
      $(this).remove()
    })

   })

   createBusketItems();
});

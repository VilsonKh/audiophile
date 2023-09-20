import { goods } from "../data.js";
import { getRandomNum, findTotalQuantity, countTotalQuantityFromLocalStorage } from "./helpers.js";

const newProd = $('<p class="product__heading-new accent">new product</p>');
let totalQuantitybasket = parseFloat($("#basket-count").attr("value"));
//open burger menu
export function onBurgerMenuOpen() {
	$("body").toggleClass("scrollLock");
	$(".burger__menu").toggle();
}

//opens basket
export function onbasketOpen() {
	$(".popup-basket").toggle();
}

//closes basket popup
export function onbasketClose(e) {
	if (!e.target.closest(".basket__inner")) {
		$(".popup-basket").hide();
	}
}

//creates catalog of certain category
export function createCard(category, id) {
	$(".skeleton").hide();
	let isLeft = true;

	for (let i in goods) {
		if (goods[i].category == category) {
			let newCard = isLeft ? $.parseHTML($(`${id} .template__catalogue-item-left`).clone().html()) : $.parseHTML($(`${id} .template__catalogue-item-right`).clone().html());
			createNewCard(id, newCard, goods[i]);
			isLeft = !isLeft;
		}
	}
}

//creates catalogue items
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

//creates detailed item card
export function createDetailedCard(id) {
	$(".skeleton").hide();
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

//create random cards in suggestion section
function addRandomCards() {
	let randIndexes = getRandomNum(goods);
	for (let index of randIndexes) {
		let selectionItem = $.parseHTML($(".template-selection").clone().html());

		$(selectionItem).find(".selection__img").attr("src", goods[index].categoryImage.desktop);
		$(selectionItem).find(".selection__name").text(goods[index].name);
		$(selectionItem).find("a").attr("id", goods[index].slug);

		$(".selection__list").append(selectionItem);
	}
}

export function setCurrentProduct() {
	localStorage.setItem("currentProduct", $(this).attr("id"));
}

export function addbasketItemsToLocalStorage(evt) {
	evt.preventDefault();
	let currentModelName = localStorage.getItem("currentProduct");
	let modelQuantity = $("#detailed__input").attr("value");

	let isNew = true;

	localStorage.setItem("basket-" + currentModelName, modelQuantity);
	$(".basket-indicator").css("display", "flex").text(countTotalQuantityFromLocalStorage());

	for (let i = 0; i < $(".basket__list > li").length; i++) {
		if ($(".basket__list > li")[i].id.slice(12) === currentModelName) {
			$(".basket__list > li")[i].children[0].children[2].children[1].value = modelQuantity;
			isNew = false;
			$("#basket-count").attr("value", getbasketItemSum());
			$("#basket-totalPrice").text(getbasketSum());
			console.log("current product");
		}
	}

	if (isNew) {
		createbasketItems(false, currentModelName);
		getbasketSum();
		$("#basket-count").attr("value", getbasketItemSum());
		$("#basket-totalPrice").text(getbasketSum());
		console.log("new");
	} else {
		createbasketItems(true, currentModelName);
		getbasketSum();
		$("#basket-count").attr("value", getbasketItemSum());
		$("#basket-totalPrice").text(getbasketSum());
		console.log("old");
	}

	$(".product__addCard .btn").text("ADDED");

	setTimeout(() => {
		$(".product__addCard .btn").text("ADD TO CARD");
	}, 2000);
}

//increments counter in detailed card
export function itemIncrement() {
	let quantityDetailed = parseFloat($("#detailed__input").attr("value"));
	if (quantityDetailed < 9) $("#detailed__input").attr("value", ++quantityDetailed);
}

//decrements counter in detailed card
export function itemDecrement() {
	let quantityDetailed = parseFloat($("#detailed__input").attr("value"));
	if (quantityDetailed > 1) {
		$("#detailed__input").attr("value", --quantityDetailed);
	}
}

//add items in basket in checkout page
export function createSummaryBasketItem() {
	for (let j = 0; j < localStorage.length; j++) {
		let basketKey = localStorage.key(j).slice(7);
		for (let i in goods) {
			if (goods[i].slug === basketKey) {
				let checkoutItem = $.parseHTML($(".template__checkout-listItem").clone().html());
				$(checkoutItem).find(".basket__img").attr("src", goods[i].basketImg.src);
				$(checkoutItem).find(".basket__name").text(goods[i].basketName);
				$(checkoutItem)
					.find(".basket__price")
					.text("$" + goods[i].price);
				$(checkoutItem)
					.find(".basket__finalNumber")
					.text(localStorage.getItem(`basket-${goods[i].slug}`));

				console.log(goods[i].price);

				$(".basketSummary__list").append(checkoutItem);

				let total = getbasketSum();
				let vat = Math.round(getbasketSum() * 0.2);
				let shipping = parseFloat($(".checkout__shipping").text());
				let grandTotal = total + shipping;

				$(".checkout__sum").text(total);
				$(".checkout__vat").text(vat);
				$(".checkout__grandTotal").text(grandTotal);
				$(".confirmation__grandTotal").text(grandTotal);
				//Добавляет последний выбранный элемент в confirmation
				if (j == localStorage.length - 1 || localStorage.length === 1) {
					$(".confirmation__list").append($(checkoutItem).clone()); //последний элемент не добавляется в конзину перед конфирмэйшн
				}

				$(".confirmation-count").text(getbasketItemSum() - 1);
			}
		}
	}
}

// Считает итоговую сумму в корзине
function getbasketSum() {
	let totalSum = 0;

	for (let i = 0; i < localStorage.length; i++) {
		let modelName = localStorage.key(i).replace(/basket-/g, "");
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

//Считает количество товара в корзине из localStorage
function getbasketItemSum() {
	totalQuantitybasket = 0;

	for (let i = 0; i < localStorage.length; i++) {
		let key = localStorage.key(i);
		let value = localStorage.getItem(key);
		if (key.startsWith("basket")) {
			totalQuantitybasket += parseFloat(value);
		}
	}
	return totalQuantitybasket;
}

export function cleanLocalStorage() {
	// $(".product__increment").off('click', '');
	for (let j = 0; j < localStorage.length; j++) {
		if (localStorage.key(j) !== "currentProduct") {
			localStorage.removeItem(localStorage.key(j));
			cleanLocalStorage();
		}
	}

	$(".basket__item").each(function () {
		$(this).remove();
	});

	$("#basket-count").attr("value", 0);
	$("#basket-totalPrice").text(getbasketSum());
	$(".basket-indicator").hide();
}

//creates basket items
export function createbasketItems(isUpdate = false, name = null) {
	if (countTotalQuantityFromLocalStorage() > 0) {
		$(".basket-indicator").css("display", "flex").text(countTotalQuantityFromLocalStorage());
	} else {
		$(".basket-indicator").css("display", "none");
	}

	if (!isUpdate) {
		for (let j = 0; j < localStorage.length; j++) {
			let basketKey = localStorage.key(j).slice(7);
			let basketValue = localStorage.getItem(localStorage.key(j));

			for (let i in goods) {
				if (goods[i].slug === basketKey) {
					let newbasketItem = $.parseHTML($(".template__basket-item").clone().html());
					$(newbasketItem).attr("id", `basketItem__${goods[i].slug}`);
					$(newbasketItem).find(".basket__img").attr("src", goods[i].basketImg.src);
					$(newbasketItem).find(".basket__name").text(goods[i].basketName);
					$(newbasketItem).find(".basket-price").text(goods[i].price);
					$(newbasketItem).find(".product__quantity").text(basketValue);
					$(newbasketItem).find(".product__increment").attr("id", `basket__increment-${i}`);
					$(newbasketItem).find(".product__decrement").attr("id", `basket__decrement-${i}`);
					$(newbasketItem).find(".product__quantity").attr("id", `basket__input-${i}`);
					$(function () {
						$(".basket__heading").find(".basket-count").attr("value", findTotalQuantity());
					});
					$(".basket__list").append(newbasketItem);
					addListenersTobasketCards(i);
				}
			}
		}

		$("#basket-count").attr("value", getbasketItemSum());
		$("#basket-totalPrice").text(getbasketSum());
	} else if (isUpdate) {
		let addedCount = $("#detailed__input").attr("value");
		for (let i = 0; i < $(".basket__list > li").length; i++) {
			if ($(".basket__list > li")[i].getAttribute("id").slice(12) === name) {
				$(".basket__list > li")[i].querySelector(".product__quantity").textContent = addedCount;
			}
		}
	}
}

function basketIncrement(id, ref) {
	//$(this).parent('.product__counter').children('#basket__input').attr('value')
	let key = ref.target.closest(".basket__item").getAttribute("id").replace(/Item/g, "").replace(/__/g, "-");
	let value = parseFloat(localStorage.getItem(key));

	if (value < 9) {
		totalQuantitybasket += 1;
		localStorage.setItem(key, ++value);
		$("#basket__input-" + id).text(+value);
		$("#basket-totalPrice").text(getbasketSum());
		$(".basket-indicator").text(totalQuantitybasket);
		console.log(value);
	}
	$("#basket-count").attr("value", totalQuantitybasket);
}

//basket item increment
function addListenersTobasketCards(id) {
	console.log("added listener to basket increment " + id);
	$(document).on("click", "#basket__increment-" + id, (e) => basketIncrement(id, e));

	//basket item decrement
	$(document).on("click", "#basket__decrement-" + id, function () {
		let key = $(this).closest(".basket__item").attr("id").replace(/Item/g, "").replace(/__/g, "-");
		let value = parseFloat(localStorage.getItem(key));

		localStorage.setItem(key, --value);

		if (value > 0) {
			console.log(id);
			$("#basket__input-" + id).text(+value);
			$("#basket-count").attr("value", --totalQuantitybasket);
			$("#basket-totalPrice").text(getbasketSum());
			$(".basket-indicator").text(totalQuantitybasket);
		}
		if (value == 0) {
			$(this).closest(".basket__item").remove();
			localStorage.removeItem($(this).closest(".basket__item").attr("id").replace(/Item/g, "").replace(/__/g, "-"));
			$("#basket-totalPrice").text(getbasketSum());
			$("#basket-count").attr("value", --totalQuantitybasket);
			$(".basket-indicator").text(totalQuantitybasket).hide();
		}
	});
}

export function closeConfirmationPopup(e) {
	if (e.target.className === "popup-confirmation") {
		$(".popup-confirmation").css("visibility", "hidden").css("opacity", "0");
	}
}

export function onConfirmClick() {
	if ($(".checkout__form").valid()) {
		$(".popup-confirmation").css("visibility", "visible").css("opacity", "1");
	}
}

export function confirmtionPopupClose(e) {
	if (e.target.className === "overlay") {
		$(".popup-confirmation").css("visibility", "hidden").css("opacity", "0");
	}
}

export function toggleInputs(e) {
	console.log("info");
	if (e.target.getAttribute("for") === "cash") {
		$(".checkout__payment-info").hide();
	} else if (e.target.getAttribute("for") === "eMoney") {
		$(".checkout__payment-info").show();
	}
}

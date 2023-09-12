import { goods } from "../data.js";
import { getRandomNum, findTotalQuantity, countTotalQuantityFromLocalStorage } from "./helpers.js";

const newProd = $('<p class="product__heading-new accent">new product</p>');
let totalQuantityBusket = parseFloat($("#busket-count").attr("value"));
//open burger menu
export function onBurgerMenuOpen() {
	$("body").toggleClass("scrollLock");
	$(".burger__menu").toggle();
}

//opens busket
export function onBusketOpen() {
	$(".popup-busket").toggle();
}

//closes busket popup
export function onBusketClose(e) {
	if (!e.target.closest(".busket__inner")) {
		$(".popup-busket").hide();
	}
}

//creates catalog with items
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

function addRandomCards() {
	let randIndexes = getRandomNum(goods);

	//Добавляет рандомные карточки
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

export function addBusketItemsToLocalStorage(evt) {
	evt.preventDefault();
	let currentModelName = localStorage.getItem("currentProduct"); //undefined
	let modelQuantity = $("#detailed__input").attr("value");

	let isNew = false;

	localStorage.setItem("busket-" + currentModelName, modelQuantity);

	for (let i = 0; i < $(".busket__list > li").length; i++) {
		if ($(".busket__list > li")[i].id.slice(12) === currentModelName) {
			$(".busket__list > li")[i].children[0].children[2].children[1].value = modelQuantity;
			isNew = true;
			$("#busket-count").attr("value", getBusketItemSum());
			$("#busket-totalPrice").text(getBusketSum());
		}
	}

	if (!isNew) {
		createBusketItems(true, currentModelName);
		getBusketSum();
		$("#busket-count").attr("value", getBusketItemSum());
		$("#busket-totalPrice").text(getBusketSum());
	}

	$(".product__addCard .btn").text("ADDED");

	setTimeout(() => {
		$(".product__addCard .btn").text("ADD TO CARD");
	}, 2000);
}

export function itemIncrement() {
	let quantityDetailed = parseFloat($("#detailed__input").attr("value"));
	if (quantityDetailed < 9) $("#detailed__input").attr("value", ++quantityDetailed);
}

export function itemDecrement() {
	let quantityDetailed = parseFloat($("#detailed__input").attr("value"));
	if (quantityDetailed > 0) {
		$("#detailed__input").attr("value", --quantityDetailed);
	}
}

//Добавляет на страницу checkout товары из корзины
export function createSummaryBasketItem() {
	for (let j = 0; j < localStorage.length; j++) {
		let busketKey = localStorage.key(j).slice(7);
		for (let i in goods) {
			if (goods[i].slug === busketKey) {
				let checkoutItem = $.parseHTML($(".template__checkout-listItem").clone().html());
				$(checkoutItem).find(".busket__img").attr("src", goods[i].busketImg.src);
				$(checkoutItem).find(".busket__name").text(goods[i].busketName);
				$(checkoutItem).find(".busket-price").text(goods[i].price);
				$(checkoutItem)
					.find(".busket__finalNumber")
					.text(localStorage.getItem(`busket-${goods[i].slug}`));

				$(".busketSummary__list").append(checkoutItem);

				let total = getBusketSum();
				let vat = Math.round(getBusketSum() * 0.2);
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

				$(".confirmation-count").text(getBusketItemSum() - 1);
			}
		}
	}
}

createSummaryBasketItem();

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

//Считает количество товара в корзине из localStorage
function getBusketItemSum() {
	totalQuantityBusket = 0;

	for (let i = 0; i < localStorage.length; i++) {
		let key = localStorage.key(i);
		let value = localStorage.getItem(key);
		if (key.startsWith("busket")) {
			totalQuantityBusket += parseFloat(value);
		}
	}
	return totalQuantityBusket;
}

export function cleanLocalStorage() {
	for (let j = 0; j < localStorage.length; j++) {
		if (localStorage.key(j) !== "currentProduct") {
			localStorage.removeItem(localStorage.key(j));
		}
	}

	$(".busket__item").each(function () {
		$(this).remove();
	});

	$("#busket-count").attr("value", 0);
	$("#busket-totalPrice").text(getBusketSum());
	$(".busket-indicator").hide();
}

export function createBusketItems(isUpdate = false, name = null) {
	if (countTotalQuantityFromLocalStorage() > 0) {
		$(".busket-indicator").css("display", "flex").text(countTotalQuantityFromLocalStorage());
	} else {
		$(".busket-indicator").css("display", "none");
	}

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
					$(function () {
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
				$(function () {
					$(".busket__heading").find(".busket-count").text(findTotalQuantity());
				});

				$(".busket__list").append(newBusketItem);
				addListenersToBusketCards(i);
			}
		}
	}
}

//busket item increment
function addListenersToBusketCards(id) {
	$(document).on("click", "#busket__increment-" + id, function () {
		//$(this).parent('.product__counter').children('#busket__input').attr('value')
		let key = $(this).closest(".busket__item").attr("id").replace(/Item/g, "").replace(/__/g, "-");
		let value = parseFloat(localStorage.getItem(key));

		if (value < 9) {
			totalQuantityBusket += 1;
			localStorage.setItem(key, ++value);
			$("#busket__input-" + id).attr("value", +value);
			$("#busket-totalPrice").text(getBusketSum());
			$(".busket-indicator").text(totalQuantityBusket);
		}
		$("#busket-count").attr("value", totalQuantityBusket);
	});

	//busket item decrement
	$(document).on("click", "#busket__decrement-" + id, function () {
		let key = $(this).closest(".busket__item").attr("id").replace(/Item/g, "").replace(/__/g, "-");
		let value = parseFloat(localStorage.getItem(key));

		localStorage.setItem(key, --value);

		if (value > 0) {
			$("#busket__input-" + id).attr("value", +value);
			$("#busket-count").attr("value", --totalQuantityBusket);
			$("#busket-totalPrice").text(getBusketSum());
			$(".busket-indicator").text(totalQuantityBusket);
		}
		if (value == 0) {
			$(this).closest(".busket__item").remove();
			localStorage.removeItem($(this).closest(".busket__item").attr("id").replace(/Item/g, "").replace(/__/g, "-"));
			$("#busket-totalPrice").text(getBusketSum());
			$("#busket-count").attr("value", --totalQuantityBusket);
			$(".busket-indicator").text(totalQuantityBusket).hide();
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

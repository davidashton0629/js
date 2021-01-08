$(function() {
	// Sets cookie instance as JSON oriented, stores cookie
	$.cookie.json = true;
	var shopInstance = $.cookie('shop');
	
	
	if(shopInstance !== null && typeof shopInstance !== 'undefined') {
		if(Object.keys(shopInstance.items).length <= 0) {
			$.removeCookie('shop', {
				path: '/',
				domain: 'rusticharmonycandles.com'
			});
			shopInstance = null;
		}
	}
	
	// Stores page data
	var price = 0;
	var IP = "", currentItem = "";
	var defaultValues = {
		user: '',
		items: []
	};
	
	// Get user IP to log for purchasing
	if(!shopInstance) {
		$.get( "http://rusticharmonycandles.com/get/ip", function(data){
			IP = data; 
			defaultValues['user'] = IP;
		});
	}
	
	// Sets currentItem as $obj
	if(currentItem == "") {
		currentItem = $("#product-title h2").clone();
	}
	
	// Sets page data from body.shop layout
	if($("body.shop").exists()) {
		// Pull price directly from page
		if(price == 0) {
			price = parseFloat($("#product-title h2 span").text().replace("each","").replace("$","")).toFixed(2);
		}
		
		// If you're not on the cart, and you're on a product, update the amount value
		if(shopInstance) {
			if($("#product-cart-options").exists() && !$("body.cart").exists()) {
				var items = shopInstance['items'];
				var item = items[currentItem];
				if(item) {
					$("input.amount").val(item[1]);
				} else {
					$("input.amount").val(1);
				}
			}
		}
		
		// Sets currentItem text as proper title
		currentItem = $("span", currentItem).remove().end().html();
		
		if(shopInstance) {
			var items = shopInstance['items'];
			// If you already have the item you're viewing
			if(items[currentItem]) {
				var curItem = items[currentItem];
				// Set data from cart
				$("input.amount").val(curItem[1]);
				$(".price input").val("$" + parseFloat(price * curItem[1]).toFixed(2));
				$("input.add-to").val("Update Total");
			}
			// Otherwise
		} else {
			// Set a regular value
			$("input.amount").val(1);
			$(".price input").val("$" + price);
		}
	}
	
	// If there is a cookie, delete it and refresh it with a new time stamp.
	if(shopInstance) {
		defaultValues['user'] = shopInstance['user'];
		defaultValues['items'] = shopInstance['items'];
		
		var value = {
			'items': {},
			'user':defaultValues['user']
		};
		value['items'] = defaultValues['items'];
		
		$.removeCookie('shop', {
			path: '/',
			domain: 'rusticharmonycandles.com'
		});
		$.cookie('shop', value, {
			expires: 1,
			path: '/',
			domain: 'rusticharmonycandles.com'
		});
		$.cookie('shop', Object);
		
		$("ul.menu").append("<li class='cart' title='View Your Cart'><a href='/view/cart/' title='View Your Cart'>Cart</a></li>");
	}
	
	// Populate the cart with your stored items
	if($("body.cart").exists()) {
		if(shopInstance !== null && typeof shopInstance !== "undefined") {
			setCartData();
		} else {
			window.location.href = "http://rusticharmonycandles.com/view/shop";
		}
	}
	
	// fast = onPage refresh
	function setCartData(fast = false)
	{
		if(fast) {
			var shopDetails = $.cookie('shop');
			shopInstance = shopDetails;
			$("#cart-item-list, #cart-total").html("");
		} else {
			var shopDetails = shopInstance;
		}
		
		if(shopDetails == null || typeof shopDetails == "undefined") {
			window.location.href = "http://rusticharmonycandles.com/view/shop";
		}
		
		
		// Store your items
		var shopItems = shopDetails['items'];
		var cartPriceTotal = parseFloat(0).toFixed(2);
		// Set a check for the last item
		var lastItem = shopItems[ Object.keys(shopItems)[Object.keys(shopItems).length - 1] ];
		
		// Run a loop for each item in your cart
		$.each(shopItems, function(key, i) {
			// If there's a broken item, remove it to prevent issues.
			if(key == "") {
				delete shopItems[key];
				
				var value = {
					'items': {},
					'user':defaultValues['user']
				};
				for(var i in defaultValues['items']) {
					value['items'][i] = defaultValues['items'][i];
				}
				if(value['items'].length > 0) {
				
					$.cookie('shop', value, {
						expires: 1,
						path: '/',
						domain: 'rusticharmonycandles.com'
					});
					
					$.cookie('shop', Object);
					shopInstance = $.cookie('shop');
					shopDetails = shopInstance;
					lastItem = shopItems[ Object.keys(shopItems).sort().pop() ];
				
					return true;
				} else {
					$.removeCookie('shop', {
						path: '/',
						domain: 'rusticharmonycandles.com'
					});
					
					window.location.href = "http://rusticharmonycandles.com/view/shop";
				}
			}
			
			// Store your current item, make a slug from the title, create a few empty floats, and log the amount requested
			var item = i;
			var itemSlug = convertToSlug(item[0]);
			var itemCount = parseFloat(item[1]);
			var itemData = "";
			var totalItemPrice = storedPrice = parseFloat(0).toFixed(2);
			
			// Send a request to get the information from our database
			$.get("http://rusticharmonycandles.com/get/data/products/" + itemSlug, function(data) {
				var pulledItem = $.parseJSON(data)[key];
				
				// Store the item price, multiply it by the count requested and store that, create a temp storage of overall (price + currentItemPrice)
				var itemPrice = parseFloat(pulledItem['price']).toFixed(2);
				totalItemPrice = parseFloat(parseFloat(itemPrice) * itemCount).toFixed(2);
				storedPrice = parseFloat(parseFloat(cartPriceTotal) + parseFloat(totalItemPrice)).toFixed(2);
				
				
				// Create HTML for each item
				itemData += "<div class='cart-item' id='" + itemSlug + "'>";
					itemData += "<div class='cart-item-image left'>";
						itemData += "<img src='/img/shop/products/" + itemSlug + ".png' />";
					itemData += "</div>";
					itemData += "<div class='cart-item-title right'>";
						itemData += "<div class='cart-item-total right'>";
							itemData += "<span>Amount In Cart: </span>";
							itemData += "<span>" + item[1] + "</span>";
							itemData += "<span id='removeItem'><a href='#' title='Remove \"" + pulledItem['title'] + "\" From Cart'>Remove</a></span>";
						itemData += "</div>";
						itemData += "<h2><a target='_blank' href='/view/shop/categories/" + pulledItem['category'] + "/" + itemSlug + "'>" + item[0] + "</a></h2>";
					itemData += "</div>";
					itemData += "<div class='cart-item-description right'>";
						itemData += "<p>" + pulledItem['short_desc'] + "</p>";
					itemData += "</div>";
					itemData += "<div class='cart-item-price right'>";
						itemData += "<span>Item Total: $" + parseFloat(totalItemPrice).toFixed(2) + "<span class='each'>$" + parseFloat(itemPrice).toFixed(2) + " ea.</span></span>";
					itemData += "</div>";
					itemData += "<div class='cart-item-update-amount right'>";
						itemData += "<div id='product-cart-options' class='right'>";
							itemData += "<div class='buy-amount'>";
								itemData += "<span class='up'></span><span class='down'></span>";
								itemData += "<label for='amount'>Amount</label><input name='amount' value='" + itemCount + "' class='amount' type='number'>";
								itemData += "<div class='price'><input disabled='true' value='$" + parseFloat(parseInt(itemCount).toFixed(2) * parseFloat(itemPrice).toFixed(2)).toFixed(2) + "' type='text'></div>";
								itemData += "<div class='add-to-cart'><input class='add-to' value='Update' type='submit' /></div>";
								itemData += "<div class='error-message hidden'><h2>You must add at least one item.</h2></div>";
							itemData += "</div>";
							itemData += "<div class='clr'></div>";
						itemData += "</div>";
					itemData += "</div>";
					itemData += "<div class='clr'></div>";
				itemData += "</div>";
				$("#cart-item-list").append(itemData);
			}).done(function(){
				// Update cart total
				cartPriceTotal = parseFloat(storedPrice).toFixed(2);
				$("#cart-total p").remove();
				
				if(i == lastItem) {
					$("#cart-total").append("<p>Cart Total: $" + parseFloat(cartPriceTotal).toFixed(2) + "</p>");
					$("#ppAmount").val(parseFloat(cartPriceTotal).toFixed(2));
					var ppItems = "";
					var ppVals = shopItems;
					$.each(ppVals, function() {
						var i = $(this);
						ppItems += i[0] + " - " + i[1] + "\n";
					});
					$("#item_name").val(ppItems);
				}
			});
		});
	}
	
	// Handles + - on product count
	$(document).delegate(".buy-amount > span","click", function() {
		// Store the current requested amount and the total of (item count * price)
		var newVal = parseInt($(this).parent(".buy-amount").find($("input.amount")).val());
		var newTotal = parseFloat($(this).parent(".buy-amount").find($(".price input")).val().replace("$","")).toFixed(2);
		
		// If you're on the cart page
		if($("body.cart").exists()) {
			// Determine which item you're in, and store that data.
			priceText = $(this).parents('.cart-item').find($(".cart-item-price")).children($('.each')).text();
			price = parseFloat(priceText.substr(priceText.lastIndexOf("$") + 1, priceText.lastIndexOf("."))).toFixed(2);
		}
		
		// if clicked +
		if($(this).index() == 0) {
			if(newVal <= 14) {
				++newVal;
				newTotal = parseFloat(parseFloat(newTotal) + parseFloat(price)).toFixed(2);
			}
		// if clicked -
		} else {
			if(newVal >= 1) {
				--newVal;
				newTotal = parseFloat(parseFloat(newTotal).toFixed(2) - parseFloat(price).toFixed(2)).toFixed(2);
			}
		}
		
		// Update data
		$(this).parent(".buy-amount").find($("input.amount")).val(newVal);
		$(this).parent(".buy-amount").find($("div.price input")).val("$"+parseFloat(newTotal).toFixed(2));
	});
	
	$(document).delegate(".add-to-cart > input","click", function(e) {
		var error = false;
		var total;
		var itemTitle = ($(".cart-item-title").exists()) ? $(this).parents('.cart-item').find( $(".cart-item-title h2") ).text() : $("#product-title h2").clone();
		
		if(itemTitle instanceof Object && ($(itemTitle).text().indexOf('<span>') > 0 || $(itemTitle).html().indexOf('span') > 0)) {
			currentItem = $("span", itemTitle).remove().end().html();
		} else {
			currentItem = itemTitle;
		}
		
		var itemsToAdd = $(this).parents(".buy-amount").find($("input.amount")).val();
		
		if( (itemsToAdd > 0 && typeof defaultValues['items'][itemTitle] == "undefined") || (typeof defaultValues['items'][itemTitle] !== "undefined" && defaultValues['items'][itemTitle] !== null && (parseInt(itemsToAdd) !== parseInt(defaultValues['items'][itemTitle][1])))) {
			if(!$(this).parents(".buy-amount").find($(".error-message")).hasClass('hidden')) {
				$(this).parents(".buy-amount").find($(".error-message")).addClass('hidden');
				$(this).parents(".buy-amount").find($("input.amount")).removeAttr("style");
			}
			total = $(this).parents(".buy-amount").find($("input.amount")).val();
		} else {
			error = true;
			if((typeof defaultValues['items'][itemTitle] !== "undefined" && defaultValues['items'][itemTitle] !== null) && parseInt(itemsToAdd) == parseInt(defaultValues['items'][itemTitle][1])) {
				$(this).parents(".buy-amount").find($(".error-message h2")).text('You already have ' + itemsToAdd + ' ' + itemTitle + 's in your cart.');
			} else {
				$(this).parents(".buy-amount").find($(".error-message h2")).text('You must add at least one item.');
			}
			$(this).parents(".buy-amount").find($("input.amount")).attr("style","border-color: red;");
			$(this).parents(".buy-amount").find($(".error-message")).removeClass('hidden');
		}
		
		if(!error) {
			$.removeCookie('shop', {
				path: '/',
				domain: 'rusticharmonycandles.com'
			});
			//console.log(currentItem);
			if(defaultValues['items'][currentItem] == null || (defaultValues['items'][currentItem] !== null && total !== defaultValues['items'][currentItem][1])) {
				defaultValues['items'][currentItem] = [];
				defaultValues['items'][currentItem][0] = currentItem;
				defaultValues['items'][currentItem][1] = total;
			} else {
				//console.log("already added, and the same value.");
			}
			
			var value = {
				'items': {},
				'user':defaultValues['user']
			};
			for(var i in defaultValues['items']) {
				value['items'][i] = defaultValues['items'][i];
			}
			
			//console.log(value);
			
			$.cookie('shop', value, {
				expires: 1,
				path: '/',
				domain: 'rusticharmonycandles.com'
			});
			$.cookie('shop', Object);
			
			shopInstance = $.cookie('shop');
			if(shopInstance) {
				$("body").append("<div id='shadowWrapper'><div id='popup'><h2 class='added-to-cart'>Successfully Added To Cart</h2></div><span class='close'>X</span></div>");
				$("#shadowWrapper").height( $(document).height() ).show("fade",1000).hide("fade",1000,function(){ $(this).remove(); });;
	
				$("#shadowWrapper, .close").click(function() {
					$("#shadowWrapper").hide("fade",1000, function() {
						$(this).remove();
					});
				});
			}
			
			if($("body.cart").exists()) {
				setCartData(true);
			}
			if(!$("ul.menu li.cart").exists()) {
				$("ul.menu").append("<li class='cart' title='View Your Cart'><a href='/view/cart/' title='View Your Cart'>Cart</a></li>");
			}
			
			$(this).val('Update Total');
		} else {
			e.preventDefault();
		}
	});
	
	$(document).delegate('#removeItem a', 'click', function(e) {
		var topLevel = $(this).parents('.cart-item-title').find($('h2')).text();
		console.log(topLevel);

		$("body").append("<div id='shadowWrapper' class='top'><div id='popup'><h2 class='added-to-cart'>Are You Sure You Want To Remove This?</h2><span id='yes'>Yes</span><span id='no'>No</span></div><span class='close'>X</span></div>");
		$("#shadowWrapper").height( $(document).height() ).show("fade",1000);

		$("#yes, #no").click(function() {
			
			if($(this).id() == "yes") {
				defaultValues['user'] = shopInstance['user'];
				defaultValues['items'] = shopInstance['items'];
				
				var value = {
					'items': {},
					'user':defaultValues['user']
				};
				value['items'] = defaultValues['items'];
				
				if(value['items'][topLevel] !== null && typeof value['items'][topLevel] !== "undefined") {
					delete value['items'][topLevel];
				}
				
				$.removeCookie('shop', {
					path: '/',
					domain: 'rusticharmonycandles.com'
				});
				console.log(value.items, value.items.length);
				if(Object.keys(shopInstance.items).length <= 0) {
					window.location.href = "http://rusticharmonycandles.com/view/shop";
				} else {
					$.cookie('shop', value, {
						expires: 1,
						path: '/',
						domain: 'rusticharmonycandles.com'
					});
					$.cookie('shop', Object);
					if($("body.cart").exists()) {
						setCartData(true);
					}
				}
			}
			
			$("#shadowWrapper").hide("fade",1000, function() {
				$(this).remove();
			});
		});
	});
});

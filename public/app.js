var state = {
  	image: ''
  }
var global_items = []
function getProducts() {
  axios.get('/items').then(function({ data, status }) {
    if ( status !== 200) {
    	return alert ('your server is probably not running')
    }
    global_items = data;
    showProducts(data)
    renderLocations();
  })
}

function showProducts(items) {
	var itemsHTML = [];
	items.forEach(function(element) {
		var url = element.url ? element.url : 'http://placehold.it/100x100'
	  itemsHTML.push('<li><div class="item-left" data-product-id="' + element.id + '"><p><span class = "prod-name">' +
	    'Product: ' + element.product + '</p></span><span class="prod-loc">' +
	    'Location: ' + element.location + '</span><span class="qty">' +
	    'Quantity: ' + element.quantity + '</span></div>' +
	    '<div class="item-right"><img src="' + url +
	    '"></div></li>')
	});
	$('.results').html(itemsHTML)
}

function renderLocations() {
	var locationsHTML = [
		'<option>Filter By Location</option>'
	];
	axios.get('/locations').then(function({data}) {
		data.forEach(function(element) {
			locationsHTML.push('<option value="' + element.name + '">' +
			element.name + '</option>' )
		})
		$('#add-location, #search-location, #edit-location').html(locationsHTML)
	})
}

function addProduct() {
	var newProd = {
		product: $('#add-name').val(),
		form: $('#add-form').val(),
		hazardous: $('#add-hazardous').val(),
		location: $('#add-location').val(),
		quantity: $('#add-qty').val(),
		url: state.image
	}; 
	
	axios.post('/items', newProd)
		.then(function(res) {
			$('#add-name').val('')
			$('#add-form').val(null)
			$('#add-hazardous').val(null)
			$('#add-location').val(null)
			$('#add-qty').val(0)
			$('.item-img').attr('src','http://placehold.it/100x100')
			console.log(state.image)
			$('.add-inventory-form').addClass('hidden');
		  $('.search-form').removeClass('hidden');
		  getProducts();
		})
		.catch(function(err){
			console.error(err)
		})

}

function addLocation(locationInput) {
	var newLocation = {
		name: locationInput
	}
	axios.post('/locations', newLocation)
	.then(function(res) {
		renderLocations();
	})
	.catch(function(err){
		console.error(err)
	})
}

function deleteProduct(id) {
	axios.delete('/items/' + id)
	.then(function(res) {
		//$('.item-info').addClass('hidden')
		//$('.search-form').removeClass('.hidden')
		$('.item-img').attr('src','http://placehold.it/100x100')
		getProducts();
	})
	.catch(function(err){
		console.error("delete failed", err)
	})
}

function editProduct(id) {
	var editProd = {
		product: $('#edit-product').val(),
		form: $('#edit-form').val(),
		hazardous: $('#edit-hazardous').val(),
		location: $('#edit-location').val(),
		quantity: $('#edit-quantity').val(),
		url: state.image
	}
	axios.put('/items/' + id, editProd)
		.then(function(res) {
			getProducts();
			$('.item-img').attr('src','http://placehold.it/100x100')
			$('.edit-item-form').addClass('hidden')
			$('.search-form').removeClass('hidden')
		})
		.catch(function(err){
			console.error(err)
		})
}


function init() {
  $('.add-inventory-form').on('submit', function(event) {
  	event.preventDefault();
    addProduct();
  })
   $('.search-form').on('submit', function(event) {
    event.preventDefault();
  })
  $('#add').on('click', function(event) {
    $('.search-form').addClass('hidden')
    $('.add-inventory-form').removeClass('hidden')
  })
  $('.add-inventory-form .back').on('click', function(event) {
    $('.add-inventory-form').addClass('hidden');
    $('.search-form').removeClass('hidden');
    $('.item-img').attr('src','http://placehold.it/100x100')
  })
  $('.edit-item-form .back').on('click', function(event) {
    $('.edit-item-form').addClass('hidden');
    $('.search-form').removeClass('hidden');
    $('.item-img').attr('src','http://placehold.it/100x100')
  })

  $('.add-location-input, .add-location').on('click', function(event) {
  	event.preventDefault();
    var locationInput = prompt("Please enter a location name")
    if(locationInput.length) {
    	addLocation(locationInput)
  		renderLocations()
    } else {
    	alert("you need to enter a location name")
    }
    
  })
  $('#add-image, #edit-image').on('click', function(event) {
    var url = prompt("Please enter an image URL")
    state.image = url;
    var img_url = $('.item-img').attr("src", state.image)
    console.log($('.item-img').attr("src"))
  })
  $('.results').on('click', 'li', function(event) {
		axios.get('/items/'+ $(this).find('.item-left').data('product-id'))
			.then(function({ data }) {		
				state.image = data.url;
		    $('#edit-product').val(data.product)
		    $('#edit-quantity').val(data.quantity)
		    $('#edit-form').val(data.form)
		    $('#edit-hazardous').val(data.hazardous)
		    $('#edit-location').val(data.location)
		    $('.edit-item-form').data('product-id', data.id)
		    $('.add-inventory-form').data('product-id', data.id)
		    $('.search-form').addClass('hidden')
		    $('.edit-item-form').removeClass('hidden')
		    $('.item-img').attr("src", state.image)
			})
	})
  $('#enter').on('click',function(event) {
  	$('.landing-page').addClass('hidden')
  	$('.search-form').removeClass('hidden')
  	event.preventDefault();
  })	
  $('#home').on('click',function(event) {
  	event.preventDefault()
  	$('form').addClass('hidden')
  	$('#land-page').removeClass('hidden')
  })
  $('#search-link').on('click',function(event) {
  	$('form').addClass('hidden')
  	$('.search-form').removeClass('hidden')
  	event.preventDefault()
  })
  $('#add-inventory-link').on('click',function(event) {
  	$('.item-img').attr('src','http://placehold.it/100x100')
  	$('form').addClass('hidden')
  	$('.add-inventory-form').removeClass('hidden')
  })
  $('.edit-item-form').on('submit', function(event) {
  	event.preventDefault()
  })
  $('#edit-item').on('click', function(event) {
  	editProduct($('.edit-item-form').data('product-id'));
  })
  $('#delete').on('click',function(event){
  	deleteProduct($('.edit-item-form').data('product-id'))
  	$('.edit-item-form').addClass('hidden')
	$('.search-form').removeClass('hidden')
  }) 
  $('.search-input').on('keypress', function(event) {
  	var that = this
  	var filtered_items = global_items.filter(function(item){
		  var query = $(that).val()
		  var regex = new RegExp(query, 'gi')
		  return item.product.match(regex)
		})
		if (filtered_items.length) {
			showProducts(filtered_items)
		} else {
			showProducts(global_items)
		}
  })
  $('#search-location').on('change', function(event) {
  	var that = this
  	var query = $(that).val()
  	var filtered_items = global_items.filter(function(item){
  		return item.location === query
  	})
  	if (filtered_items.length) {
			showProducts(filtered_items)
		} else {
			$('.results').html('<div>No Results</div>')
		}

  })
}


$(document).ready(function() {
  init();
  getProducts();
});
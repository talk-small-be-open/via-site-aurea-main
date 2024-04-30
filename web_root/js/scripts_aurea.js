// JavaScript für VIA Aurea Bulla


// PWA Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
		.then(serviceWorker => {
//      console.log("Service Worker registered: ", serviceWorker);
    })
    .catch(error => {
      console.error("Error registering the Service Worker: ", error);
    });
}


// function onMapPairsDrop(dropzone, draggable) {
//   $(dropzone).children('div.rightObject').prepend(draggable);
// 	$(draggable).css({top:0, left:0});
// }

function swapElement(a, b) {
  // create a temporary marker div
  var aNext = $('<div>').insertAfter(a);
  a.insertAfter(b);
  b.insertBefore(aNext);
  // remove marker div
  aNext.remove();
}

function swapContent(a, b) {

	var as = a.children();

	b.children().appendTo(a);
	as.appendTo(b);
	
}

//
// Map Pairs
//

function onMapPairsSelectionResult(correct, exerciseId) {
	var objectPair = $('#'+exerciseId).find('div.objectPair').has('div.leftObject.selected');
	var leftObject = objectPair.find('div.leftObject.selected');

	var rightObject = objectPair.find('div.rightObject');
	var newRightObject = $('#'+exerciseId).find('div.rightObject.selected');

	if (correct) {
		swapContent(rightObject, newRightObject);

		leftObject.addClass('correct');
		rightObject.addClass('correct');
	}
	$("#" + exerciseId + " div.objectPair div.selected").removeClass("selected");
}

function mapPairsCheck(exercise, callbackToCorrect) {
	if ($('#'+exercise).find('div.leftObject.selected, div.rightObject.selected').length == 2) {
		callbackToCorrect();
	}
}

function onMapPairsTapLeft(exercise, element, callbackToCorrect) {
	if (!$(element).hasClass("correct")) {
		$("div.objectPair div.leftObject").removeClass("selected");
		$(element).addClass("selected");
		mapPairsCheck(exercise, callbackToCorrect);
	}
}

function onMapPairsTapRight(exercise, element, callbackToCorrect) {
	if (!$(element).hasClass("correct")) {
		$("div.objectPair div.rightObject").removeClass("selected");
		$(element).addClass("selected");
		mapPairsCheck(exercise, callbackToCorrect);
	}
}


//
// Drag/Drop
//

function onDragDropDrop(dropzone, draggable) {
  $(dropzone).append(draggable);
	$(draggable).css({top:0, left:0});
}


//
// Text input
//

function textinput_markAsEmpty(event, elementId) {
	var element = $('#'+elementId);
	event.stopPropagation();

	element.toggleClass('markedAsEmpty');

	if (element.hasClass('markedAsEmpty')) {
		$(event.target).addClass('active');
		element.val('BLANK')
	} else {
		$(event.target).removeClass('active');
		element.val('')		
	}	
}


//
// Select many
//

function selectmany_preventTooManyChecks(regionId, buttonId, number, message) {
	if ((number > 0) && ($('#'+regionId+' input:checkbox:checked').length > number)) {
		alert(message);
		return false;
	}
	$('#'+buttonId).toggleClass('active');

	return true;
}


/**
 * Element.requestFullScreen() polyfill
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!Element.prototype.requestFullscreen) {
	Element.prototype.requestFullscreen = Element.prototype.mozRequestFullscreen || Element.prototype.webkitRequestFullscreen || Element.prototype.msRequestFullscreen;
	document.fullscreenElement = function () { return document.mozFullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement };
	document.exitFullscreen = document.mozExitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
}
Element.prototype.toggleFullscreen = function () {
	if (document.fullscreenElement) { 
		document.exitFullscreen();
	} else {
		this.requestFullscreen();
	}
};




// function login_custom_oauth() {
// 	var oauth = hello('customoauth');
// 	var url = '/hellojs.html';
	
// 	oauth.login({display: 'popup', redirect_uri: url, scope: 'email'}, function(auth) {
		
// 		oauth.api('me').then(function(json) {
// 			window.location.href = window.location.pathname+"?"+$.param({"access_token": auth.authResponse.access_token, "network": auth.authResponse.network, "first_name": json.first_name, "last_name": json.last_name, "email": json.email});
// 		});
// 	});
// }


// Work globally with some objects in a context. Used globally in the first place,
// but also when content is being loaded partially
function processHtmlDocument(contextElement) {
	$('.popover', contextElement).webuiPopover({trigger:'hover', placement:'auto'});
	$('span.dictionaryEntry', contextElement).webuiPopover({trigger:'hover', placement:'auto-top'});

  $('textarea', contextElement).autosize();

	if ( ! (typeof JoelPurra === 'undefined') ) {
		$('input.clozeTextPlaceholder', contextElement).plusAsTab();
		$('div.textListInput input.textInput', contextElement).plusAsTab();
	}
}

// Scroll a given task title to the nice top position
function scrollToExerciseTask(taskTitleElement) {
	
	const navElement = $(taskTitleElement).closest('div.VIAAurModuleExerciser').find('div.moduleNavigation').get(0);
	const rect = navElement.getBoundingClientRect();
	const targetPosition = rect.top + rect.height + 5;
	const elementPosition = $(taskTitleElement).offset().top;

	window.scroll({behavior: 'smooth', top: (elementPosition - targetPosition) });

}

// function addTextToCursor(text) {

//   const element = document.activeElement;
//   const caretPos = element.selectionStart;
//   const textAreaTxt = element.value;
	
//   element.value = textAreaTxt.substring(0, caretPos) + text + textAreaTxt.substring(caretPos);
// 	element.selectionStart = caretPos + txtToAdd.length
// }


//
// Helpers for VIATextListInputTask
//

function listInput_addText(id, text, isWholeWord) {

	var textToAdd = text;
	const main = document.getElementById(id);
	const element = $(main).data('lastInputElement') || $(main).find("div.textListLines input.textInput")[0];
	const position = $(main).data('lastPosition') || 0;
  const originalText = element.value;

	// Auto add space?
	if ( isWholeWord && (position > 0) && (originalText.at(position-1) != " ") ) {
		textToAdd = ' ' + textToAdd;
	}
	
  element.value = originalText.substring(0, position) + textToAdd + originalText.substring(position);
	element.selectionStart = position + textToAdd.length;
	element.selectionEnd = element.selectionStart;
	$(main).data('lastPosition', element.selectionStart);

	element.focus();
	
}

function listInput_addSpace(id) {
	listInput_addText(id, " ");
}


function listInput_gotoNextLine(id) {

	const main = document.getElementById(id);
	const emptyInputs = $(main).find("div.textListLines input.textInput").filter(function() {
    return !this.value;
	});

	const element = emptyInputs[0];

	if (element) {
		$(main).data('lastInputElement', element);
		$(main).data('lastPosition', 0);
		element.focus();
	}
	
}

//
// Helpers for glossary
//

function glossary_scrollTo(glossary, entry) {
	const glossaryBody = $("div.glossaryBody", glossary).get(0);
	$(glossaryBody).addClass('scrolling');
	glossaryBody.scroll({behavior: 'smooth', top: $(entry).position().top });	
}

function glossary_jumpTo(glossaryId, jumpId) {
	const glossary = document.getElementById(glossaryId);
	const entry = document.getElementById(jumpId);

	glossary_reset(glossaryId);
	$(entry).addClass('internalGoto');

	glossary_scrollTo(glossary, entry);
	
}

function glossary_jumpToReference(clickedElement, jumpId) {
	const entry = document.getElementById(jumpId);

	if (entry) {
		const glossary = $(clickedElement).closest('div.glossary').get(0);
//		const glossaryBody = $("div.glossaryBody", glossary).get(0);
	
		glossary_reset(glossary.id);
		$(entry).addClass('internalGoto');

		glossary_scrollTo(glossary, entry);
	}
}


// function glossary_internalGotoReference(clickedElement, searchReferenceCode) {
// 	const glossary = $(clickedElement).closest('div.glossary').get(0);
// 	const searchText = searchReferenceCode.toLowerCase();

// 	// Search entry by title exact match
// 	// OPTIMIZE: Stop after first hit. jquery cant do that?
// 	const all = $(".glossaryEntry", glossary).filter(function() {

// 		const entry = $(this);
// 		const referenceCode = $(".referenceCode", entry);
		
// 		// Check content
//     return referenceCode.text().toLowerCase() == searchText;
// 	});

// 	const entry = all.first();

// 	if (entry) {
// 		const glossaryBody = $("div.glossaryBody", glossary).get(0);
		
// 		glossary_reset(glossary.id);
// 		entry.addClass('internalGoto');
// 		glossaryBody.scroll({behavior: 'smooth', top: entry.position().top });
// 	}
	
// }


// Put the glossary in the initial state, no filter, no highlight, no scrolling
function glossary_reset(glossaryId) {

	const glossary = document.getElementById(glossaryId);
	const glossaryBody = $("div.glossaryBody", glossary);
	const searchInput = $("input.searchText", glossary);

	$(searchInput).val('');
	$(".glossaryEntry", glossary).removeClass('searchFound searchFoundInTitle searchIsTitle searchNotFound internalGoto');
	glossaryBody.removeClass('scrolling');

	
}

function glossary_liveSearch(glossaryId) {

	const glossary = document.getElementById(glossaryId);
	const searchInput = $("input.searchText", glossary);
	const text = searchInput.val().toLowerCase();
	var fullHitElem;

	// Remove search completely, if empty search text
	if ( !text ) {
		glossary_reset(glossaryId);
		return;
	}

	// Reset scrolling UI, normally not scrolling.
	const glossaryBody = $("div.glossaryBody", glossary);
	glossaryBody.removeClass('scrolling');

	// Search text in all rows
	$(".glossaryEntry", glossary).each(function() {

		const elem = $(this);
		const title = $(".title", elem).text().toLowerCase();
		const simpleTerm = elem.get(0).dataset.simpleTerm.toLowerCase();
		var found = false;

		// Reset attributes from maybe previous search
		elem.removeClass('searchFoundInTitle searchIsTitle internalGoto');
	
		// Check full text content
    if ( elem.text().toLowerCase().indexOf(text) >= 0 ) {
			
			found = true;

			// Sub-check, if hit is in the title
			if ( title.indexOf(text) >= 0 ) {
				elem.addClass('searchFoundInTitle')
			}

		}

		// Check, if hit is = title, either by shown title with accents or by simple term with normalized accents
		// Jump to by scroll
		if ( (title == text) || (simpleTerm == text) ) {
			found = true;
			elem.addClass('searchIsTitle');
			fullHitElem = elem.get(0);
		}

		// Switch visibility down here, for smooth hide/show
		if (found) {
			elem.addClass('searchFound').removeClass('searchNotFound');
		} else {
			elem.addClass('searchNotFound').removeClass('searchFound');
		}


	});

	if (fullHitElem) {
		glossary_scrollTo(glossary, fullHitElem);
	}

}




/* Haupt JS init */
$(document).ready(function(){

	if ( ! (typeof JoelPurra === 'undefined') ) {
		JoelPurra.PlusAsTab.setOptions({
			// Use the enter key as tab keys
			key: [13]
		});
	}

	processHtmlDocument(document);
	
	// Lazy load von Bildern installieren
	// Brauchen wir im Moment nicht im Frontend
	// setLazy();
	// lazyLoad();
	// $(window).on('scroll', lazyLoad);

	preventBackButton(function(){
//TODO nice message		alert('No back function available');
	});

});

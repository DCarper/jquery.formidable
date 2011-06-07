/*
 * jQuery formidable plug-in 0.2
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright (c) 2011 Daniel J Carper
 *
 * $Id: jquery.formidable.js 6403 2011-06-06 14:27:16Z dan.carper $
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

// HIDE ANYTHING IN THE SUBMIT DIV THEN INSERT A SPINNER
// ALSO DISABLE INPUTS BY DEFAULT
//
$.fn.disableSubmission = function(options) {
  
  options = options || {disableInputs: true};			// this is bad

  if (options.disableInputs)
    { this.disableInputs() };						// DISABLE INPUTS

  this.hideSubmitButtons();							// HIDE SUBMIT BUTTON, SHOW SPINNER
  this.attr('disabled', 'disabled');		// DISABLE THE FORM
  return this;
}

// DISABLE INPUTS
//
$.fn.disableInputs = function() {
  this.find('input').attr('disabled', 'disabled');
  return this;
}

// ENABLE THE INPUTS
//
$.fn.enableInputs = function() {
  this.find('input').removeAttr('disabled');
  return this;
}

// HIDE THE SUBMIT BUTTON, SHOW THE SPINNER
//
// BASED ON THE CURRENT PATTERN OF PRELOADING A SPINNER GIF
// WITH CLASS OFF IN THE SUBMIT DIV
//
$.fn.hideSubmitButtons = function() {
  this.toggleOffables();
}

// TOGGLE THE CLASS OFF ON THE DIRECT CHILDREN OF THE OFF DIV
//
$.fn.toggleOffibles = function() {
	this.find("div#submit").children().toggleClass('off')
}
// RESETS EVERY FIELD WITH A DEFAULT VALUE TO THAT DEFAULT
//
// BASED ON THE ATTRIBUTE data-default
//
$.fn.reset = function() {
  defaultables = this.find('[data-default]');
  defaultables.each(function(){ 
    $(this).attr('value', $(this).attr('data-default'));
  });

	return this;
}

// REMOVE THE SPINNER THEN SHOW EVERYTHING IN THE #SUBMIT DIV
//
$.fn.enableSubmission = function(options) {
  this.removeAttr('disabled');

  options = options || {reset: true};

	if (!options.disableInputs)				// ENABLE THE INPUTS BY DEFAULT
    { this.enableInputs() }
  
	if(options.reset)									// RESET ANY DEFAULT FIELDS
    { this.reset() }

  this.toggleOffables();

	return this;
}

// DISABLE THE SUBMIT BUTTONS AND LET ANY FORM INTERACTION REACTIVATE THEM
//
$.fn.disableSubmitters = function() {
  $submitters = this.find('input[type=submit]'); // disable any submit buttons
  $submitters.attr('disabled', 'disabled');

  $(this).find('input, textarea, select').one('keyup', function() {  // enable them after submission
    $submitters.removeAttr('disabled');
  })
  
  $(this).find('input, textarea').one('click', function() {  // enable them after submission
    $submitters.removeAttr('disabled');
  })

  $(this).find('select').one('change', function() {  // enable them after submission
    $submitters.removeAttr('disabled');
  })

  $(this).find('#baby_bracket_state, #baby_bracket_due_date').one('click', function() {  // enable them after submission
    $submitters.removeAttr('disabled');
  });

  return this;
}

// RETURN TRUE IF THE FORM CAN SUBMIT
//
$.fn.submissionEnabled = function() {
  return this.attr('disabled') != 'disabled'
}

// A jquery.validate METHOD TO PREVENT SUBMISSION OF DEFAULT VALUES
// 
jQuery.validator.addMethod("not_default", function(value, element) { 
  return !( value == $(element).attr('data-default'))
});


// RETURNS TRUE IF THE FIELD CONTAINS IT'S DEFAULT VALUE
//
$.fn.isDefaultValue = function() {
  return (this.attr("value") == this.attr('data-default'))
}

// RETURNS TRUE IF THE FIELD IS BLANK
//
$.fn.valueIsBlank = function() {
  return (this.attr('value') == '');
}

// DRIVE THE DEFAULT FORM FIELD BEHAVIOR
//
// If THE FIELD IS FOCUSED AND IS EQUAL TO IT'S DEFAULT VALUE, THE FIELD CLEARS
// IF THE FOCUS IS LOST ON A FIELD AND THE FIELD IS BLANK, RESET IT'S DEFAULT VALUE
//
// AS IT STANDS NOW, YOU CANNOT SUBMIT DEFAULT VALUES
//
$.fn.enableDefaults = function () {
  var defaultables = this.find('[data-default]');					// FIND THE DEFAULTABLES

  defaultables.focus(function(){													// CLEAR WHEN APPROPRIATE 
    if( $(this).isDefaultValue() )
      { $(this).attr('value', '') }});

  defaultables.focusout(function(){												// RESET WHEN APPROPRIATE
    if ( $(this).valueIsBlank() )
      { $(this).attr('value', $(this).attr('data-default')) }});

  defaultables.rules('add', { not_default: true });				// DO NOT SUBMIT DEFAULT VALUES
  

  return this;
}

// FOR REGULAR HTTP SUBMITS. DISABLE THE FORM AND SUBMIT
//
$.fn.submitOnce = function () {
  $(this).submit(function() {
    $(this).disableSubmission();
    return true;
  })
}

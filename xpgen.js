$(function() {
	$("img").ready(function() {
		if($("#expForm").length) {
			$("input[type='text']").val("");
			$('input[type=checkbox]').prop('checked',false);
			$("#generate, #step2").addClass('hidden');
			$("#continue1").addClass('disabled');
			
			var currentStep = 1;
			var augment = false;
			
			$(document).on("keydown", "form", function(event) {
				if(event.key !== "Enter") {
					return true;
				} else {
					$("input").blur();
					return false;
				}
			});
			
			$("#levels input, #intervals input").keyup(function(){
				$(this).change();
			});
			
			$("#levels input").change(function(){
				var cap = 500;
				if(augment) {
					cap = 250;
				}
				if($(this).val() > cap) {
					$(this).val(cap);
				}
				
				if($(this).val() > 0) {
					$("#continue1").removeClass('disabled');
				} else {
					if(!$("#continue1").hasClass('disabled')){
						$("#continue1").addClass('disabled');
					}
				}
			});
			
			$("#continue1").click(function(){
				if($(this).hasClass('disabled')) {
					return false;
				} else {
					
					$("#step1").addClass('hidden');
					currentStep = 2;
					$("legend").html("How Many Intervals Do You Want?");
					$("#step2").removeClass('hidden');
					
					if($("#augment input").is(":checked")) {
						currentStep = 2.1;
						augment = true;
					}
					
					if(augment) {
						$("#intervals .augment").removeClass("hidden");
						if($("#levels input").val() > 250) {
							$("#levels input").val(250);
						}
					}
				}
			});
			
			$("#intervals input:not(.augment)").change(function(){
				if(parseInt($(this).val()) > parseInt($("#levels input").val())) {
					$(this).val($("#levels input").val());
				} else if($(this).val() > 10) {
					$(this).val(10);
				}
				
				if($(this).val() > 0) {
					$("#continue2").removeClass('disabled');
				} else {
					if(!$("#continue2").hasClass('disabled')){
						$("#continue2").addClass('disabled');
					}
				}
			});
			
			$("#augment input").change(function(){
				if($(this).is(":checked")) {
					if($("#levels input").val() > 250) {
						$("#levels input").val(250);
					};
				}
			});
			
			$("#continue2").click(function(){
					console.log(currentStep);
				if($(this).hasClass('disabled')) {
					return false;
				} else {
					if(augment) {
						if(!$("#engramArray").hasClass('hidden')) {
							currentStep = 3;
						} else {
							currentStep = 2.2;
						}
					} else if(currentStep == 2.2) {
						currentStep = 3;
					} else if(currentStep == 2.1) {
						currentStep = 2.2;
					} else if(currentStep == 2) {
						currentStep = 2.1;
					}
					console.log(currentStep);
					expFirstFinalStep(augment, currentStep);
				}
			});
			
			$(document).on("keyup",".interval input, .engramInterval input", function(){
				$(this).change();
			});
			
			$(document).on("change",".interval input",function(){
				var noneEmpty = true;
				
				$(".interval input").each(function(){
					if($(this).val() == "") {
						noneEmpty = false;
						$(this).addClass('error');
					} else {
						if($(this).hasClass('error')){
							$(this).removeClass('error');
						}
						if(noneEmpty) {
							noneEmpty = true;
						}
					}
					
					if(noneEmpty) {
						$("#continue2").removeClass('disabled');
					} else {
						if(!$("#continue2").hasClass("disabled")) {
							$("#continue2").addClass('disabled');
						}
					}
				});
			});
			
			$(document).on("change",".engramInterval input",function(){
				var noneEmpty = true;
				
				$(".engramInterval input").each(function(){
					if($(this).val() == "") {
						noneEmpty = false;
						$(this).addClass('error');
					} else {
						if($(this).hasClass('error')){
							$(this).removeClass('error');
						}
						if(noneEmpty) {
							noneEmpty = true;
						}
					}
					
					if(noneEmpty) {
						$("#continue2").removeClass('disabled');
					} else {
						if(!$("#continue2").hasClass("disabled")) {
							$("#continue2").addClass('disabled');
						}
					}
				});
			});
			
			$(document).on("change",".confirmItem input:not(#allowDinos)",function(){
				var noneEmpty = true;
				
				$(".confirmItem input").each(function(){
					if($(this).val() == "") {
						noneEmpty = false;
						$(this).addClass('error');
					} else {
						if($(this).hasClass('error')){
							$(this).removeClass('error');
						}
						if(noneEmpty) {
							noneEmpty = true;
						}
					}
					
					if(noneEmpty) {
						$("#generate").removeClass('disabled');
					} else {
						if(!$("#generate").hasClass("disabled")) {
							$("#generate").addClass('disabled');
						}
					}
				});
			});
			
			$(document).on("change",".allowDino input[type='checkbox']",function(){
				if($("#changeDino").length) {
					$("#changeDino").remove();
				}
				if($(this).is(":checked")) {
					$("#finalStep").append("<input id='changeDino' type='hidden' name='changeDino' value='true' />");
				} else {
					$("#finalStep").append("<input id='changeDino' type='hidden' name='changeDino' value='false' />");
				}
			});
			
			$("#generate").click(function(e){
				e.preventDefault();
				expLastStep(augment);
				$("form").submit();
			});
			
			$(document).on("change","#intervals .augment", function() {
				if($(this).val() > 2.8) {
					$(this).val(2.8);
				}
			});
		}
	});
});

function expLastStep(augment)
{
	var totalToSpawn = $("#intervals input").val();
	var i = 0;
	var vars = "";
	var totalExpRamps = "";
	var totalEngramRamps = "";
	
	vars += "<input type='hidden' name='totalWantedLevels' value='" + $("#levels input").val() + "' />";
	while(i < totalToSpawn) {
		totalExpRamps += $(".endExp" + (i+1) + " input").val() + ",";
		totalEngramRamps += $(".endEngram" + (i+1) + " input").val() + ",";
		i++;
	}
	vars += "<input type='hidden' name='totalExpRamps' value='" + totalExpRamps + "' />";
	
	vars += "<input type='hidden' name='totalEngramRamps' value='" + totalEngramRamps + "' />";
	if($("#augment input").is(":checked")) {
		vars += "<input type='hidden' name='useAugment' value='true' />";
	} else {
		vars += "<input type='hidden' name='useAugment' value='false' />";
	}
	if(augment) {
		vars += "<input type='hidden' name='augmentPower' value='" + $("#intervals .augment").val() + "' />";
	}
	$("#finalStep").append(vars);
}

function expFirstFinalStep(augment, currentStep)
{
	var totalToSpawn = $("#intervals > input").val();
	var i = 0;
	var lCap = $("#levels > input").val();
	var cap = totalToSpawn;
	
	if(currentStep !== 3){
		console.log(1);
		i = 0;
		$("#intervals").addClass('hidden');
		$("#expArray").removeClass('hidden');
		$("#continue2").addClass('disabled');
		if(!augment) {
			while(i < totalToSpawn){
				var firstSet = Math.floor((((lCap / cap) * i) - (lCap / cap)) + (lCap / cap));
				var secondSet = Math.floor((((lCap / cap) * i) - (lCap / cap)) + ((lCap / cap) * 2));
				var currentLevels = "" + firstSet + "-" + secondSet + "";
				var item = "<div class='interval'><input class='ramp" + (i + 1) + "' name='ramp" + (i + 1) + "' type='text' onkeypress='return nKey(event)' title='Required experience per level for levels " + currentLevels + "' placeholder='Experience For Block " + (i + 1) + "' /></div>";
				$("#expArray").append(item);
				i++;
			}
		}
		if(currentStep == 2.2) {
			console.log(1.1);
			i = 0;
			currentStep = 2.3;
			$("#expArray").addClass('hidden');
			$("#engramArray").removeClass("hidden");
			$("#continue2").addClass('disabled');
			while(i < totalToSpawn){
				var firstSet = Math.floor((((lCap / cap) * i) - (lCap / cap)) + (lCap / cap));
				var secondSet = Math.floor((((lCap / cap) * i) - (lCap / cap)) + ((lCap / cap) * 2));
				var currentLevels = "" + firstSet + "-" + secondSet + "";
				var item = "<div class='engramInterval'><input class='engram" + (i + 1) + "' name='engram" + (i + 1) + "' type='text' onkeypress='return nKey(event)' title='Engrams per level for levels " + currentLevels + "' placeholder='Engrams For Block " + (i + 1) + "' /></div>";
				$("#engramArray").append(item);
				i++;
			}
		} else if(currentStep == 2.1) {
			while(i < totalToSpawn){
				var firstSet = Math.floor((((lCap / cap) * i) - (lCap / cap)) + (lCap / cap));
				var secondSet = Math.floor((((lCap / cap) * i) - (lCap / cap)) + ((lCap / cap) * 2));
				var currentLevels = "" + firstSet + "-" + secondSet + "";
				var item = "<div class='interval'><input class='ramp" + (i + 1) + "' name='ramp" + (i + 1) + "' type='text' onkeypress='return nKey(event)' title='Required experience per level for levels " + currentLevels + "' placeholder='Experience For Block " + (i + 1) + "' /></div>";
				$("#expArray").append(item);
				i++;
			}
		}
	} else {
		console.log(2);
		i = 0;
		currentStep = 3;
		$("#engramArray").addClass('hidden');
		$("#expConfirm").removeClass('hidden');
		$("#step2").addClass('hidden');
		$("#step3").removeClass('hidden');
		$("legend").html("Let's Confirm Your Choices!");
		var appender = "";
		appender += "<div class='confirmation'>";
			appender += "<div class='confirmItem'><span>You want</span> <span class='cItem'>" + $("#levels input").val() + " total levels</span></div>";
			if(!augment) {
				while(i < totalToSpawn) {
					var firstSet = Math.floor((((lCap / cap) * i) - (lCap / cap)) + (lCap / cap));
					var secondSet = Math.floor((((lCap / cap) * i) - (lCap / cap)) + ((lCap / cap) * 2));
					var currentLevels = "" + firstSet + "-" + secondSet + "";
					appender += "<div class='confirmItem endExp" + (i+1) + "'><span>You want</span> <input type='text' onkeypress='return nKey(event)' name='finalExp" + (i+1) +"' value='" + $(".ramp" + (i+1) + "").val() + "' /> <span class='cItem'>experience required per level for levels " + currentLevels + "</span></div>";
					i++;
				}
				i = 0;
				while(i < totalToSpawn) {
					var firstSet = Math.floor((((lCap / cap) * i) - (lCap / cap)) + (lCap / cap));
					var secondSet = Math.floor((((lCap / cap) * i) - (lCap / cap)) + ((lCap / cap) * 2));
					var currentLevels = "" + firstSet + "-" + secondSet + "";
					appender += "<div class='confirmItem endEngram" + (i+1) + "'><span>You want</span> <input type='text' onkeypress='return nKey(event)' name='finalEngram" + (i+1) +"' value='" + $(".engram" + (i+1) + "").val() + "' /> <span class='cItem'>engrams per level for levels " + currentLevels + "</span></div>";
					i++;
				}
				appender += "</div>";
			} else {
				var augVal = $("#intervals .augment").val();
				if(!augVal) {
					augVal = 1.12;
				}
				appender += "<div class='confirmItem endAugment'><span>You want an augment of </span> <span class='cItem'>" + augVal + "x</span>";
				while(i < totalToSpawn) {
					var firstSet = Math.floor((((lCap / cap) * i) - (lCap / cap)) + (lCap / cap));
					var secondSet = Math.floor((((lCap / cap) * i) - (lCap / cap)) + ((lCap / cap) * 2));
					var currentLevels = "" + firstSet + "-" + secondSet + "";
					appender += "<div class='confirmItem endEngram" + (i+1) + "'><span>You want</span> <input type='text' onkeypress='return nKey(event)' name='finalEngram" + (i+1) +"' value='" + $(".engram" + (i+1) + "").val() + "' /> <span class='cItem'>engrams per level for levels " + currentLevels + "</span></div>";
					i++;
				}
			}
			appender += "<div class='confirmItem allowDino'><span>Do you want dino levels changed too?</span><input type='checkbox' class='allowDinos' name='allowDinos' />";
		$("#expConfirm").append(appender);
		$("#generate").removeClass('hidden').addClass('disabled');
		setTimeout(function() {
			$("#generate").removeClass('disabled');
		}, 3000);
	}
}

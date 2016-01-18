var graph = null;
var paper = null;
var mInput = null;
var mOutput= null;

var operatorSize = {width : 90,	height : 90};

$(document).ready(function () {
    registerTabChangeEvent();
    registerMouseAndKeyEvents();
    initDraggable();
    initDropable();
    initJointJSGraph();
});


function registerMouseAndKeyEvents() {

    $(document).on('mouseenter', '#dmEditorContainerContainerWrapper11', function () {
        //console.log("mouseenter = ");
    });

    $(document).on('mouseleave', '#dmEditorContainerContainerWrapper11', function () {
       // console.log("mouseleave = ");
    });

    $(document).mousemove(function (e) {// to get the cursor point to drop an icon
        //console.log("mousemove = " +e.pageX);
    });

    $(document).keydown(function (e) {
    	//console.log("keydown = " +e);
    	   	if(e.keyCode==46){//delete key pressed
    	   		if (selected) selected.remove();
    	   	}
    });
}


function registerTabChangeEvent() {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        console.log('tabChagne');
        var tabName = $(e.target).html();
        if (tabName == 'Source') {
            activateSourceView();
        } else {
            activateDesignView();
        }
    });
}

function activateSourceView() {
    console.log('activateSourceView');
    var sourceEditorTBox = $('#sourceEditorTextBox');
    sourceEditorTBox.val('<sequence name="sample_sequence">');
}


function activateDesignView() {
	console.log('activateDesignView');
    var sourceEditorTextBox = $('#sourceEditorTextBox');
    console.log(sequenceObj);
}


function initDraggable() {
	$(".draggableIcon").draggable({
		helper : 'clone',
		containment : 'dmEditorContainer',
		cursor : 'move',
		stop : handleDragStopEvent
	});
}

function initDropable() {
	$("#dmEditorContainer").droppable({
		drop : handleDropEvent,
		tolerance : "pointer"
	});
}

function handleDragStopEvent(event, ui) {

}

function handleDropEvent(event, ui) {
	if ($(ui.draggable).attr('id').search(/dragged/) == -1) {
		var newDraggedElem = $(ui.draggable).clone();
		var type = newDraggedElem.attr('id');
		createDiv(type, newDraggedElem, type);
	}
}

function createDiv(objName, image, type) {
	var operator = null;
	if (objName=="Concat"){
		operator = new joint.shapes.devs.Model({
			size : operatorSize,
			inPorts : [ 'in1', 'in2' ],
			outPorts : [ 'out' ],
			attrs : {
				'.label' : {
					text : objName,
					'ref-x' : .4,
					'ref-y' : .2
				},
				'graphProperties': {
					marked :0,
					visited:0,
					index : -1,
					portVariableIndex:[-1]
				},
				rect : {
					fill : '#2ECC71'
				},
				circle: { r: 6 },
				'.inPorts circle' : {
					fill : '#16A085'
				},
				'.outPorts circle' : {
					fill : '#E74C3C'
				}
			}
		});
    } else if (objName=="Split") {
    	operator = new joint.shapes.devs.Model({
			size : operatorSize,
			inPorts : [ 'in1' ],
			outPorts : [ 'out1' , 'out2'],
			attrs : {
				'.label' : {
					text : objName,
					'ref-x' : .4,
					'ref-y' : .2
				},
				'graphProperties': {
					marked : 0,
					visited: 0,
					index : -1,
					portVariableIndex:[-1,-1]
				},
				rect : {
					fill : '#2ECC71'
				},
				circle: { r: 6},
				'.inPorts circle' : {
					fill : '#16A085'
				},
				'.outPorts circle' : {
					fill : '#E74C3C'
				}
			}
		});
    }
	
	graph.addCell(operator);
}


function openInputDialog() {
	$('#myInput').bind("change", handleInputFileSelect);
	$('#myInput').click();
}

function openOutputDialog() {
	$('#myOutput').bind("change", handleOutputFileSelect);
	$('#myOutput').click();
}


function handleFileSelect(evt, box, isOutput) {
	var f = evt.target.files[0]; 
    if (f) {
	      var reader = new FileReader();
	      reader.readAsText(f);
	      reader.onload = function(e) { 
		      var contents = e.target.result;
		      console.log(contents);
		  	  var obj = JSON.parse(contents);
			  traverseObject(obj, 1, box, isOutput);
			  relocateElement(box);
	      }
    } else { 
    	  alert("Failed to load file");
    }
}

function handleInputFileSelect(evt) {
	var firstChild = mInput.getEmbeddedCells()[0];
	if (firstChild) {
		firstChild.remove();
	}
    handleFileSelect(evt, mInput, true);
}

function handleOutputFileSelect(evt) {
    handleFileSelect(evt, mOutput, false);
}


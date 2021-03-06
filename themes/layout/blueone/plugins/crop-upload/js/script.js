/**
 *
 * HTML5 Image uploader with Jcrop
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2012, Script Tutorials
 * http://www.script-tutorials.com/
 */

// convert bytes into friendly format
var changeImg = [];
$.globalEval("var jcrop_api;"); 
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

// check for selected crop region
function checkForm() {
    if (parseInt($('#w').val())) return true;
    $('.error').html('Please select a crop region and then press Upload').show();
    return false;
};

// update info by cropping (onChange and onSelect events handler)
function updateInfo(e) {
    $('#x1').val(e.x);
    $('#y1').val(e.y);
    $('#x2').val(e.x2);
    $('#y2').val(e.y2);
    $('#w').val(e.w);
    $('#h').val(e.h);
};

// clear info by cropping (onRelease event handler)
function clearInfo() {
    $('.info #w').val('');
    $('.info #h').val('');
};
function initJcrop()
{
    $('#preview').Jcrop({
        bgOpacity: 0.5,
        bgColor: 'white',
        addClass: 'jcrop-normal',
        minSize: [200, 104], // min crop size
        aspectRatio: 16 / 8.3, // keep aspect ratio 1:1
        boxWidth: 800,
        boxHeight: 415,
        onChange: updateInfo,
        onSelect: updateInfo,
    }, function () {

        // use the Jcrop API to get the real image size
        var bounds = this.getBounds();

        // Store the Jcrop API in the jcrop_api variable
        jcrop_api = this;
        jcrop_api.animateTo([200, 104]);
        jcrop_api.setSelect([0, 0, 400, 208]);
        jcrop_api.setOptions({
            bgFade: true
        });
        jcrop_api.ui.selection.addClass('jcrop-selection');
    });
}
function fileSelectHandler() {
    // get selected file
    var oFile = $('#image_file')[0].files[0];
    // hide all errors
    $('.error').hide();

    // check for image type (jpg and png are allowed)
    var rFilter = /^(image\/jpeg|image\/png)$/i;
    if (! rFilter.test(oFile.type)) {
        $('.error').html('Please select a valid image file (jpg and png are allowed)').show();
        return;
    }

    // check for file size
    if (oFile.size > 1000 * 3000) {
        $('.error').html('You have selected too big file, please select a one smaller image file').show();
        return;
    }

    // preview element
    var oImage = document.getElementById('preview');

    // prepare HTML5 FileReader
    var oReader = new FileReader();
        oReader.onload = function(e) {

        // e.target.result contains the DataURL which we can use as a source of the image
        oImage.src = e.target.result;
        changeImg.push(e.target.result);
        oImage.onload = function () { // onload event handler

            // display step 2
            $('.step2').fadeIn(500);

            // display some basic image info
            var sResultFileSize = bytesToSize(oFile.size);
            $('#filesize').val(sResultFileSize);
            $('#filetype').val(oFile.type);
            $('#filedim').val(oImage.naturalWidth + ' x ' + oImage.naturalHeight);

            // Create variables (in this scope) to hold the Jcrop API and image size
            var boundx, boundy;

            // destroy Jcrop if it is existed
            if (typeof jcrop_api != 'undefined')  {
                jcrop_api.destroy();
            }
            //jcrop_api.enable();

            // initialize Jcrop
            if(changeImg.length==1) {
                initJcrop();
            }
            if(changeImg.length>1) {
                //jcrop-normal
                //$('#uploadFile .jcrop-normal img').attr("src",e.target.result);
                // jcrop_api = this;
                // jcrop_api.animateTo([200, 104]);
                // jcrop_api.setSelect([0, 0, 400, 208]);
                // jcrop_api.setOptions({
                //     bgFade: true
                // });
                // jcrop_api.ui.selection.addClass('jcrop-selection');
                // $('#preview').Jcrop();
                jcrop_api.destroy();
                initJcrop();
            }
            // $('#preview').Jcrop({
            //     bgOpacity: 0.5,
            //     bgColor: 'white',
            //     addClass: 'jcrop-normal',
            //     minSize: [200, 104], // min crop size
            //     aspectRatio : 16 / 8.3, // keep aspect ratio 1:1
            //     boxWidth:800,
            //     boxHeight:415,
            //     onChange: updateInfo,
            //     onSelect: updateInfo,
            // }, function(){

            //     // use the Jcrop API to get the real image size
            //     var bounds = this.getBounds();


            //     // Store the Jcrop API in the jcrop_api variable
            //     jcrop_api = this;
            //     jcrop_api.setSelect([0,0,400,208]);
            //     jcrop_api.setOptions({ bgFade: true });
            //     jcrop_api.ui.selection.addClass('jcrop-selection');
            // });
        };
    }

    // read selected file as DataURL
    oReader.readAsDataURL(oFile);
}
function ImageSelectHandler(img) {
    // get selected file
   $("#blockui").show();
    // hide all errors
    $('.error').hide();

    // preview element
    var oImage = document.getElementById('preview');
    oImage.src = img;
    changeImg.push(img);
    // display step 2
    $('.step2').fadeIn(500);

    // Create variables (in this scope) to hold the Jcrop API and image size
    var boundx, boundy;

    // destroy Jcrop if it is existed
    if (typeof jcrop_api != 'undefined')  {
        jcrop_api.destroy();
    }
    //jcrop_api.enable();

    // initialize Jcrop
    if(changeImg.length==1) {
        setTimeout(function(){ 
            $("#upload_form").append('<input value="'+img+'" name="imageurl" type="hidden"><input id="editimage" value="1" name="editimage" type="hidden">');
            initJcrop();
            $("#blockui").hide();
        }, 1500);
    }
    if(changeImg.length>1) {
        jcrop_api.destroy();
        setTimeout(function(){ 
            $("#upload_form").append('<input value="'+img+'" name="imageurl" type="hidden"><input id="editimage" value="1" name="editimage" type="hidden">');
            initJcrop();
            $("#blockui").hide();
        }, 1500);
    }
}

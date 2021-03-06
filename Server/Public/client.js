$(document).ready(onReady);

function onReady(){
    startUpCorn();
    $('.buttonline').on('click', 'button', buttonFunc)
    $('.opButtons').on('click', 'button', opButtonFunc)
    $('#input1').focus(focusChangeOne);
    $('#input2').focus(focusChangeTwo);
    $('#clearBut').on('click', clear);
    $('#input1').on('propertychange input', updateIn1);
    $('#input2').on('propertychange input', updateIn2);
    $('#enterButton').on('click', onEnterClick);
}
////////////////////////////////////////////////////////////////////////////////////
//Variables
////////////////////////////////////////////////////////////////////////////////////
let numString1 = '';
let numString2 = '';
let op = '';
let focusField = 1;
let history;
let synth = window.speechSynthesis;


////////////////////////////////////////////////////////////////////////////////////
//Functions
////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////
        //Function: Number Button Press To Input Field
        ////////////////////////////////////////////////////////////////////////////////////

        function buttonFunc(){
            let inNumBut = $(this).text();
            if(focusField === 1){
                numString1 += inNumBut;
                updateInputDOM()
            }
            else if(focusField === 2){
                numString2 += inNumBut;
                updateInputDOM();
            }
        }

        function opButtonFunc(){
             op = $(this).text();
             focusField = 2;
             updateInputDOM();
        }
        ////////////////////////////////////////////////////////////////////////////////////
        //Function:  Change  var focusField              <----NOTE: This is used by 
        //                                                    the function buttonFunc in 
        //                                                    order to devide which
        //                                                    numString to add to
        ////////////////////////////////////////////////////////////////////////////////////

        function focusChangeOne(){
            focusField = 1;
        }

        function focusChangeTwo(){
            focusField = 2;
        }
        ////////////////////////////////////////////////////////////////////////////////////
        //Function: DOM Update w/Inputs                   <---Note: DOM has div spans updated
        //                                                    with up to date input info for
        //                                                    numstring1 and numstring 2 and 
        //                                                    selected operator    
        ////////////////////////////////////////////////////////////////////////////////////
        function updateInputDOM(){
            $('#input1').val(`${numString1}`);
            $('#input2').val(`${numString2}`);
            $('#ourFormulaNum1').text(`${numString1}`)
            $('#ourFormulaOp').text(`${op}`)
            $('#ourFormulaNum2').text(`${numString2}`)
        }
        ////////////////////////////////////////////////////////////////////////////////////
        //Function: Clear       
        ////////////////////////////////////////////////////////////////////////////////////
        function clear(){
            $('#input1').val('');
            $('#input2').val('');
            numString1 = '';
            numString2 = '';
            focusField = 1;
            op = '';
            $('#big-answer').html('');
            updateInputDOM()
        }


        ////////////////////////////////////////////////////////////////////////////////////
        //Function: Update our numString1 to reflect changes typed into input
        ////////////////////////////////////////////////////////////////////////////////////
        function updateIn1(){
            numString1 = $('#input1').val();
            updateInputDOM();
        }

        function updateIn2(){
            numString2 = $('#input2').val();
            updateInputDOM();
        }
////////////////////////////////////////////////////////////////////////////////////
//                   ~~~~~~~~~~~~~ POST FUNCTIONS ~~~~~~~~~~~~~~~
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//Function: On Enter Click
////////////////////////////////////////////////////////////
function onEnterClick(){
    if (Number(numString1) === NaN || Number(numString2) === NaN || op.length === 0){
        alert('Please make sure all fields are filled in correctly')
        return
    }
    let objectToPost = {
        num1: numString1,
        operator: op, 
        num2: numString2,
    }
    $.ajax({
            method: 'POST',
            url: '/custom' ,
            data: objectToPost
    })
    .then(function(response){
        console.log(response)
        let resObject = response;
        num1 = resObject.num1;
        num2 = resObject.num2;
        op = resObject.operator;
        history = resObject.history;
        
        let answer = resObject.solution;
        let index = 0
        $('#id').empty();
        for (entry of history){
            let num1 = entry.num1;
            let num2 = entry.num2;
            let op = entry.operator;
            $('#id').append(`<li data-entry:${index}>${num1} ${op} ${num2}</li>`);
            index += 1;
        }
        $('#big-answer').html(`<p>Your Answer:${answer}<p>`);
        let utterance = new SpeechSynthesisUtterance(answer);
        if(answer === 8){
        utterance = new SpeechSynthesisUtterance(`You really like that number, don't you? What's so special about 8?`)
        }
        else if (answer === undefined){
            utterance = new SpeechSynthesisUtterance(`ERROR DETECTED. INITIATING SELF DESTRUCT`)
        }
        else if (answer === 69){
            utterance = new SpeechSynthesisUtterance(`haha it is the funny number. you will laugh now.`)

        }
        let voices = speechSynthesis.getVoices();
        utterance.voice = voices[33];
        synth.speak(utterance);
        amISpeaking()
        
    })
}

////////////////////////////////////////////////////////////
//Function: Is Calcucorn Speaking?
////////////////////////////////////////////////////////////

function amISpeaking(){
     if (synth.speaking === true){
        console.log('speaking');
        $("#corn").effect( "shake", { times: 4, distance: 10}, 90 );
        setTimeout(amISpeaking, 250);
     }
     else {
        return
     }
}


////////////////////////////////////////////////////////////
//Function: Calcucorn Introduces Herself
////////////////////////////////////////////////////////////
function startUpCorn(){
    let voices = speechSynthesis.getVoices(); 
    let utterance = new SpeechSynthesisUtterance('Hello my name is calcucorn, and I am here to grant your deepest mathematical fantasies')
    utterance.voice = voices[33];
    
    synth.speak(utterance);
    amISpeaking();
    setTimeout(waitAlert, 5500)
}
///////////////////////////////////////////////////////////////////
//Function: Display Alert after setTimout in function startUpCorn
///////////////////////////////////////////////////////////////////
function waitAlert(){
    alert('Please turn volume on for the full Calcucorn experience')
}


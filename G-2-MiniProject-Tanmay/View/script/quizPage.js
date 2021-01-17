
var questions = [];
var answers = [];
var quizdata =[];
var i = -1;
var response = [];
var timer;
var userId = sessionStorage.getItem('userId');
var subject = "";
var web;
var minutes = 0;
var seconds = 0;
var categoryId = sessionStorage.getItem('categoryId');
var images = [];

// ------------------------------Variable declaration ----------------------

//-------------------------------Fetching quiz data---------------------
$(document).ready(function(){
    $.ajax(
    {
        url : "http://localhost:3000/categories/"+categoryId+"/questions",
        method : "GET",
        async  : false,
        success : function(e){
            e.forEach(element => {
                //-----------------populating variables with data
                quizdata.push(element);
                questions.push(element.question);
                answers.push(element.answer);
                images.push(element.img);
            });
            
        },
        error : function (err) {
            alert("sorry database is not ready. Bye ");
            window.open("../html/scoreCard.html",'_self') ;
        }
    })

//-------------------------------Fetching quiz data ends---------------------

//-------------------------------Setting Title total questions --------------------
    
    $("#title").text(sessionStorage.getItem("title"));
    $('#tot-que').text(questions.length);

//-------------------------------WebWorker for timer ------------------------------

    if(!sessionStorage.getItem("timer")){
        sessionStorage.setItem("timer",(new Date()).valueOf())
    }
    if (typeof(Worker)!=="undefined"){
        if (web==null){
           web = new Worker("../script/worker.js");
        }
        //------------------trigger on post message--------------------------------
        web.postMessage(sessionStorage.getItem('timer'));
        //------------------printing time------------------------------------------
        web.onmessage = function (event) {
            //------------------limit for timer------------------------------------
            if(event.data.minutes >= 30) {
                $('#submit').click();
            }
            //-------------------populating timer every second---------------------
            $("#timer").html(event.data.minutes + ':' + event.data.seconds);
            minutes = event.data.minutes;
            seconds = event.data.seconds;
        };
     } else {
        document.getElementById("timer").innerHTML = "Sorry, your browser does not support Web Workers ...";
     }

//----------------------check if any option selected-------------------------------
    
    $("input[type='radio']").click(function () {

        var ans = $('input[name="option"]:checked').val();
        if (ans) {
            //---------------populate response string on every selection------------
            response[i] = ans;
        }
    });

    //---------------------first que creation call ----------------------------------
    createQuestion();


//---------------------- create que and next que -------------------------------------
    function createQuestion(){
        
        //--------------check if reached the end--------------------------------------
        if (i < questions.length - 1) {
            i++;
            
            //-----------resetting the state of buttons ------------------------------
            $("input[name='option']").prop('checked', false);
            
            //-----------adding data in component------------------------------------
            
            $('#curr-que').text(i+1);
            
            
            $('#question').text(questions[i]);
            if(image[i] != ""){
                console.log("here");
                $("#image").attr("src",images[i]);
            }else{
                $("image").html(null);
            }
            $('#btnradio1').val(quizdata[i].option1);
            $('#ops1').text('1. ' + quizdata[i].option1);

            $('#btnradio2').val(quizdata[i].option2);
            $('#ops2').text('2. ' + quizdata[i].option2);

            $('#btnradio3').val(quizdata[i].option3);
            $('#ops3').text('3. ' + quizdata[i].option3);

            $('#btnradio4').val(quizdata[i].option4);
            $('#ops4').text('4. ' + quizdata[i].option4);

            //------------setting previous response---------------------
            if (response[i]) {
                $(`input[name="option"][value="${response[i]}"]`).prop('checked', true);
            }
        }
    }

    function resetQuestion(){

        //--------------check if reached the start--------------------------------------
        if (i > 0) { 
            i--;

            //-----------resetting the state of buttons ------------------------------
            $("input[name='option']").prop('checked', false);

            //-----------adding data in component------------------------------------

            $('#curr-que').text(i+1);
            $('#question').text(questions[i]);
            if(image[i] != ""){
                console.log("here");
                $("#image").attr("src",images[i]);
            }else{
                $("image").html(null);
            }
            $('#btnradio1').val(quizdata[i].option1);
            $('#ops1').text('1. ' + quizdata[i].option1);

            $('#btnradio2').val(quizdata[i].option2);
            $('#ops2').text('2. ' + quizdata[i].option2);

            $('#btnradio3').val(quizdata[i].option3);
            $('#ops3').text('3. ' + quizdata[i].option3);

            $('#btnradio4').val(quizdata[i].option4);
            $('#ops4').text('4. ' + quizdata[i].option4);

            //------------setting previous response---------------------    
            $(`input[name="option"][value="${response[i]}"]`).prop('checked', true);
        }
    }

    //-----------------next question--------------------------------------
    $('#next-btn').click(function () {
        createQuestion();
    })

    //-----------------first question-------------------------------------
    $('#first-btn').click(function () {
        i = -1;
        createQuestion();
    })

    //-----------------last question---------------------------------------
    $('#last-btn').click(function () {
        i = questions.length - 2;
        createQuestion();
    })

    //------------------previous question----------------------------------
    $('#previous-btn').click(function () {
        resetQuestion();
    })
    
    //------------------submit functionality--------------------------------
    $('#submit').click(function () {
        let flag;

        //-----------------if no options selected---------------------------
        if(response.length==0){
            flag = confirm("No answer selected you really want to submit");
            if(flag){
                senddata();
            }
        }else{
            alert("exam is getting submited");
            senddata();
        }
    })

    //--------------------post data after all confirmation-------------------
    function senddata() { 
        let marks = 0;

        //--------------terminating webworker--------------------------------
        web.terminate();
        web = undefined;

        //-------------comparing answers and incrementing marks--------------
        for (let j = 0; j < questions.length; j++) {
            if (response[j] == answers[j]) {
                marks++;
            }
        }
        let percent = marks / questions.length * 100;
        let datetime = new Date();
        let time = datetime.toTimeString().split(" ")[0]
        let date = datetime.getDate()+'/'+(parseInt(datetime.getMonth())+1)+'/'+datetime.getFullYear();
        
        //---------post call--------------------------------------------------
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/quiz_data",
            dataType: "json",
            async: false,
            success: function (msg) {
                if (msg) {
                    console.log(msg);
                } else {
                    console.log("Cannot add to list !");
                }
            },
            //data that need to be added
            data: {
                "userId": userId,
                "categoryId": categoryId,
                "marks": marks,
                "totalMarks": questions.length,
                "timeElapsed": minutes+':'+seconds,
                "dateTime": date+ ' : '+time,
                "percent" : percent
            }
        });

        //---------------storing data in session storage for chart--------------
        sessionStorage.removeItem("timer");
        sessionStorage.setItem("marks",marks);
        sessionStorage.setItem("totalQues",questions.length);
        sessionStorage.setItem("subject",subject);
        sessionStorage.setItem("time",minutes+':'+seconds);
        sessionStorage.setItem("percentage",percent);

        //---------------bye bye--------------------------------------------------
        window.open("../html/scoreCard.html",'_self') ;

     }
});
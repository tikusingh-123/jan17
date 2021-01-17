var cat_length = null; 
var flag = true;
$("document").ready(()=>{
    
    let i = 0;    
    let imgUrl = "https://syntaxxx.com/wp-content/uploads/2014/08/html5-logo-600-580x580.jpg";
    //let quizDom = '<div class="card col" style="width: 18rem;"><img class="card-img-top" src='+'${imgUrl}'+'alt="Card image cap"><div class="card-body"><h5 class="card-title">HTML Quiz</h5><p class="card-text">HTML Quiz to test ability.</p><a href="#" class="btn btn-success">Load Quiz</a></div></div>';
    // 

    $('#test').html();
    
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/categories",
        async: "false",
        success: function (response) {
            cat_length = response.length;
            
         response.forEach(element => {
             // let quizDom = `<div class="col-md-3 col-sm-4 col-lg-3 "><div class="card mb-3 size-img"><img class="card-img-top" src=${element.img} alt="Card image cap"><div class="card-body"><h5 class="card-title">${element.name}</h5><p class="card-text">${element.data}</p><button class="btn border-0 text-white" value="${element.id}">Load Quiz</button></div></div></div>`;
             let quizDom = "<div class='col-md-4 col-sm-6 col-xs-12 col-lg-3 p-2'><div class='card card-body peopleCarouselImg card-transition'><img class='img-fluid' src='"+element.img+"'><span class='overlay'></span><h3>"+element.name+"</h3> <br> <h4> <button class='btn text-white ' onclick='startQuiz(this);'  value='"+ element.id+","+element.name+"'> Start </button>  <h4></div></div> </div>";
             $('#quizcard').append(quizDom);
             
         });
         randGenerator(cat_length);
         randGenerator(cat_length);
        }
    });

   //scorecard
  

    var userName = sessionStorage.getItem("username");
    //    console.log(userName);

    $('.username_session').append(userName);


    if (sessionStorage.getItem('isActive') ) {

    }else{
    window.open("../html/error/", "_self");
    }
  
});

function startQuiz(e) {  
    let data = e.value.split(',');
    sessionStorage.setItem("categoryId",data[0]);
    sessionStorage.setItem("title",data[1]);
    window.location.replace("../html/quizPage.html");
}

function remove(){
    sessionStorage.clear();
    window.location.replace("./");
}
console.log(cat_length);
function randGenerator(data) {

    var rand = Math.floor(Math.random() * Math.floor(data));
    var marks = [];
    var labels = [];
    var label;
    console.log(sessionStorage.getItem("userId"));
    var link = "http://localhost:3000/users/"+sessionStorage.getItem("userId")+"/quiz_data?categoryId="+rand;
    console.log(link);
    $.ajax({
        type: "GET",
        async: "false",
        url: link,
        success: function (response) {
            response.forEach(element => {
                marks.push(element.marks),
                label = element.dateTime.split(" "),
                labels.push(label[0])
            });
            
            createGraph();
            function createGraph(){
                console.log(labels);
                
                if(flag){
                    var ctx = $("#myChart")[0].getContext('2d');
                    flag=false;
                } else {
                    var ctx = $("#myChart1")[0].getContext('2d');
                }
                
                var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Previous Performance',
                        data: marks,
                        backgroundColor: 'rgba(36, 38, 51, 0.9)',
                        borderWidth: 1,
                        barPercentage: 0.8,
                        responsive: true,
                        
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
            }
        }
    });

}
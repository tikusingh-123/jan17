$(document).ready(function() {
    
    $('[data-toggle=offcanvas]').click(function() {
      $('.row-offcanvas').toggleClass('active');
    });
      
  $.ajax({
    
    url:"http://localhost:3000/categories",
    method:"GET",
    datatype:"json",
   success:function(x){
       x.forEach((data)=>{
            $('.categories').append('<div class="col-md-4 col-sm-6 col-xs-12 col-lg-3 p-2 divAlign"><div class=" card card-body peopleCarouselImg"><button type="button"  class="close" id="'+data.id+'" aria-label="Close" onclick="deletequiz('+data.id+')"><span aria-hidden="true">&times;</span></button><div class="quizimage"><img   src="'+data.img+'" alt="'+data.name+'"></div><div class="card-body"><h4 class="card-title">'+data.name+'</h4><p class="card-text">Add Remove Edit Delete questions</p><button  onclick="storeId('+data.id+')"  class="btn btn-primary">View</button></div></div></div>');
        })
   },

   error:(e)=>{
    alert("Error:"+e);
}
})
});
  
  function post(){
   
    event.preventDefault();
    var category=$('#quiz').val();
    var img=$('#image').val();
    console.log(img);
    
    $.ajax({
        url:"http://localhost:3000/categories",
        method:"POST",
        async:"false",
        data:{"name":category,"created-by":sessionStorage.getItem('adminId'),"img":img},
        datatype:"json",
            success:function(data){
              
            },
            error:(e)=>{
               alert("Error:"+e);
           }
    })
  }

  
  
  function deletequiz(id){
    
        var conf = confirm("are you sure you want to delete this entry ..??");
        if(conf == true){
        
        $.ajax({
            url:"http://localhost:3000/categories/"+id,
            method:"DELETE",
            datatype:"json",
                success:function(data){

                },
                error:(e)=>{
                   alert("Error:"+e);
               }
        })
      }else{
        alert("Delete Aborted..!");
      }
    }

  function remove(){
    sessionStorage.clear();
  
    window.location.replace("./");
   }


   if (sessionStorage.getItem('isActive') ) {
  
  }else{
     window.open("../html/error/", "_self");
  }

  function storeId(e){
// console.log(e);
sessionStorage.setItem("categoryId",e);
window.location.replace("../html/questionTable.html");
  }
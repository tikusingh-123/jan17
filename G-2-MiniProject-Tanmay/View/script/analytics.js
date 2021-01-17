$(document).ready(()=>{

        
  $.ajax({
    
    url:"http://localhost:3000/users",
    method:"GET",
    datatype:"json",
   success:function(x){
       x.forEach((data)=>{
        // console.log("aaya");
            $('.tbody').append('<tr><th scope="row">'+data.id+'</th><td>'+data.name+'</td><td>'+data.username+'</td><td><button type="submit" class="btn-sm btn btn-primary" onclick="userdetails('+data.id+')">Details</button></td></tr>');
        })
   },

   error:(e)=>{
    alert("Error:"+e);
}
})

 })

 function userdetails(id){
  $( ".userdetails" ).empty();
  $.ajax({
    
    url:"http://localhost:3000/users/"+id+"/quiz_data",
    method:"GET",
    datatype:"json",
    async:"false",
   success:function(x){

       x.forEach((data)=>{

           $('.userdetails').append('<tr><th scope="row">'+data.categoryId+'</th><td data-label="marks      :">'+data.marks+'</td><td data-label="Total Marks      :">'+data.totalMarks+'</td><td data-label="Date and Time     :">'+data.dateTime+'</td><td data-label="Percentage     :">'+data.percent+'</td></tr></tbody></table>');

        })
   }
 })
}
function remove(){
  sessionStorage.clear();

  window.location.replace("./");
 }




 if (sessionStorage.getItem('isActive') ) {

}else{
   window.open("../html/error/", "_self");
}
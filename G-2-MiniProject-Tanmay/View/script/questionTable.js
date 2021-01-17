var catId = sessionStorage.getItem("categoryId");
//to update the table dynamically
 $(document).ready(function () { 
// FETCHING DATA FROM JSON FILE 
    $.getJSON("http://localhost:3000/categories/"+catId+"/questions",  
            function (data) { 
        var student = '';
        // iterating through objects.
        $.each(data, function (key, value) { 
          //construction of rows having data from json objects. 
            student += '<tr>'; 
            student += '<td>' + value.question + '</td>'; 
            student += '<td>' + value.option1 + '</td>'; 
            student += '<td>' + value.option2 + '</td>'; 
            student += '<td>' + value.option3 + '</td>'; 
            student += '<td>' + value.option4 + '</td>'; 
            student += '<td>' + value.answer + '</td>'; 
            //edit and delete button with functionalities.
            student += '<td><input type="submit" class="btn btn-primary" data-toggle="modal" data-target="#form" id="edit'+value.id+'" value="edit" onclick="editrow('+value.id+',\''+value.question+'\',\''+value.option1+'\',\''+value.option2+'\',\''+value.option3+'\',\''+value.option4+'\',\''+value.answer+'\',\''+value.img+'\')"/></td>';
            student += '<td><input type="submit" class="btn btn-danger" id="button'+value.id+'" value="delete" onclick="confirmdelete(\''+value.id+'\')"/></td>';
            student += '</tr>'; 
        }); 
        //inserting rows into tables.  
        $('#questiontable').append(student); 
    }); 
   }); 

//to post data into json file using form fields.(create)
function datapost(){
  alert("here");
  var flag= confirm("Are you sure want to create ?"+ $('#question').val()+ $('#op1').val()+$('#op2').val()+ $('#op3').val());
  if(flag){
    $.ajax({
            url:"http://localhost:3000/questions",
            type: "POST",
            data:{
              categoryId:catId,
              question: $('#question').val(),
              option1: $('#op1').val(),
              option2: $('#op2').val(),
              option3: $('#op3').val(),
              option4: $('#op4').val(),
              answer :$('#correct').val(),
              img: $('#imgurl').val()
            },
            success: function (data){  
              console.log(data);
            }
    });
  }else{
    alert("aborted");
  }
}
//functionality to update question based on confirm dialog.
function updatequestion(){
  var questionId= $(editquestionid).val();
  var flag= confirm("Are you sure want to edit ?");
  if(flag){
    $.ajax({
            url:"http://localhost:3000/questions/"+questionId,
            type: "PATCH",
            data:{
              question: $('#editquestion').val(),
              option1: $('#editop1').val(),
              option2: $('#editop2').val(),
              option3: $('#editop3').val(),
              option4: $('#editop4').val(),
              answer :$('#editcorrect').val(),
              img : $('#editimgurl').val(),
              categoryId:catId,
            },
            success: function (data){  
              console.log(data);
            }
    });
  }else{
    alert("aborted");
  }
}

//for delete function
  function deleterow(id){
  $.ajax({
      url:"http://localhost:3000/questions/"+id,
      type: "delete",
        success: function (data){
          location.reload(true); 
      }
  });
    
}
//editrow function gets the value of each data instance of a particular id and sets the value on form edit modal fields.
function editrow(id,q,op1,op2,op3,op4,answer,url)
{

      $('#editquestionid').val(id);
      $('#editquestion').val(q);
      $('#editop1').val(op1);
      $('#editop2').val(op2);
      $('#editop3').val(op3);
      $('#editop4').val(op4);
      $('#editcorrect').val(answer);
      $('#editimgurl').val(url);

}

//filter functionality
$(document).ready(function(){
  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#questiontable1 tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

//delete confirmation on the press of delete button in the tables
function confirmdelete(id) {
    
    var r = confirm("Are you sure you want to delete ?");
    if (r == true) {
        deleterow(id);
    } else
     {
    }
  }
//remove functionality with logout(using sessionstorage removal)
function remove(){
  sessionStorage.clear();
  window.location.replace("./");
 }

 if (sessionStorage.getItem('isActive') ) {

}else{
   window.open("../html/error/", "_self");
}
$(function()
        {
            $("#checkin").datepicker({
                numberOfMonths:1,
                dateFormat:'d MM yy',
                minDate: 0,
                onSelect:function(selectdate){
                    var dt=new Date(selectdate);
                    dt.setDate(dt.getDate()+1)
                    $("#checkout").datepicker("option","minDate",dt);
                }
            });
  
            $("#checkout").datepicker({
                numberOfMonths:1,
                dateFormat:'d MM,yy',
                onSelect:function(selectdate){
                    var dt=new Date(selectdate);
                    dt.setDate(dt.getDate()-1)
                    $("#checkin").datepicker("option","maxDate",dt);
                }
            });
        });

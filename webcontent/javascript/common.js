function userAction(pcode,dateF){
	var pcode = pcode;
	var dateP="";
	var ddf="";
	var mmf="";
	var yyyyf="";
	if(pcode==''){
		alert("Enter Pincode");
	}
	if(dateF==''){
		alert("Enter Date");
	}else{
		dateP=dateF.split('-');
		ddf=dateP[2];
		mmf=dateP[1];
		yyyyf=dateP[0];
		dateU=ddf+'-'+mmf+'-'+yyyyf;
	}
	
	fetch('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode='+pcode+'&date='+dateU)
    // Handle success
    //.then(response => response.json())  // convert to json
    //.then(json => console.log(json))    //print data to console
	.then(function (response) {
		return response.json();
	  })
	.then(function (data) {
                appendData(data);
            })
    .catch(err => console.log('Request Failed', err)); // Catch errors
	
	/*.then(characters => showCharacters(characters.results));
	showCharacters = characters => {
	  const charactersDiv = document.querySelector(‘#rick-and-morty-  characters’);
	  characters.forEach(character => {
		const characterElement = document.createElement(‘p’);
		characterElement.innerText = `Character Name: ${character.name}`;
		charactersDiv.append(characterElement);
	  });
	}*/
	
	function appendData(data) {
		let tab = 
        `<tr>
          <th>Name</th>
          <th>Address</th>
          <th>Vaccine</th>
          <th>Available</th>
         </tr>`;
		for (var i = 0; i < data.sessions.length; i++) {
				tab += `<tr> 
			<td id="centerName_${i}">${data.sessions[i].name} </td>
			<td id="centerAddress_${i}">${data.sessions[i].address}</td>
			<td id="vaccineType_${i}">${data.sessions[i].vaccine}</td> 
			<td id="doseAvl_${i}">${data.sessions[i].available_capacity_dose1}</td>          
			</tr>`;
			} 
		/*var mainContainer = document.getElementById("myData");
		mainContainer.innerHTML ="";
		for (var i = 0; i < data.sessions.length; i++) {
			//var div = document.createElement("div");
			//mainContainer.appendChild(div);
			mainContainer.innerHTML  = mainContainer.innerHTML + "Name: "+data.sessions[i].name +"</br>"+
										"Address: "+data.sessions[i].address +"</br>"+
										"Vaccine: "+data.sessions[i].vaccine +"</br>"+
										"Min Age: "+data.sessions[i].min_age_limit +"</br>"+
										"Slots: "+data.sessions[i].slots +"</br>"+
										"Dose 1: "+data.sessions[i].available_capacity_dose1 +"</br>"+
										"Date: "+data.sessions[i].date +"</br>"+
										"Payment: "+data.sessions[i].fee_type+"</br>"+"</br>";
														
		}*/
		document.getElementById("CoWinData").innerHTML = tab;
		for (var i = 0; i < data.sessions.length; i++) {
			var vcT = document.getElementById("vaccineType_"+i).innerText;
			var doseAvl = document.getElementById("doseAvl_"+i).innerText;
			//console.log(vcT);
			if(doseAvl>0){
				//document.getElementById("doseAvl_"+i).innerHTML ="<b>"+`${data.sessions[i].available_capacity_dose1}`+"</b>";
				//document.getElementById("doseAvl_"+i).innerHTML =`<td id="doseAvl_${i}" style="background-color:green;">${data.sessions[i].available_capacity_dose1}</td>`;
				var el = document.getElementById("doseAvl_"+i);
				el.style.fontWeight = 'bold';
				el.style.backgroundColor = 'green';
			}
			if(vcT == 'COVAXIN'){
				var el = document.getElementById("vaccineType_"+i);
				el.style.backgroundColor = 'Orange';
			}
			
		}	
		
	}
}


/*
*Grocery Page
*/



function grocerySave(){
	/*for(var i=1;i<=2;i++){
		if(document.querySelector('input[name="row-'+i+'"]:checked')!=null){
			var selectedMeasure = document.querySelector('input[name="row-'+i+'"]:checked').value;
			var totalQty = document.querySelectorAll('input[data-col="4"]')[i-1].value;
			 if(totalQty==""){
				 document.getElementById("row-2-4").value = "1";
			 }
		} 
	}*/
	
	//window.print();
	//var name = prompt('What is your name?');
	//var multiplier = prompt('Enter a number:');
	//multiplier = parseInt(multiplier);
	var doc = new jsPDF();
	
	//doc.text(20,20,name+'\'s Grocery List:');
	//doc.addPage();
	
	//for(var i = 1; i <= 2; i ++) {
		//doc.text(20, 30 + (i * 10), i + ' x ' + multiplier + ' = ___');
	//}
	var today = new Date();

	var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
	//console.log("date::"+date);
	doc.text(20,20,'Grocery List - '+date);
	doc.text(20,30,'This is a PDF, you may save it to share.');
	for(var i=1;i<=2;i++){
		if(document.querySelector('input[name="row-'+i+'"]:checked')!=null){
			var selectedMeasure = document.querySelector('input[name="row-'+i+'"]:checked').value;
			var totalQty = document.querySelectorAll('input[data-col="4"]')[i-1].value;
			 if(totalQty==""){
				 document.getElementById("row-"+i+"-4").value = "1";
				 totalQty = 1;
			 }
			 var grocName = document.querySelector('td[name="row-'+i+'-groc"]').innerText
			doc.text(20, 40 + (i * 10), grocName + ' : ' + selectedMeasure + ' - ' + totalQty );	 
		} 
	}
	
	doc.save('GroceryList.pdf');
}

function addClass(el, className) {
    var el = document.querySelectorAll(el);
    
    for (i = 0; i < el.length; i++) {
      if (el.classList) {
        el[i].classList.add(className);
      } else {
        el[i].className += ' ' + className;
      }
    }
}












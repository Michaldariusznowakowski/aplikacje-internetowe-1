
const _minLen=2;
const _maxLen=255;

var DATA=null;

//Only once

if (getStorage()){
  show(DATA);
}
  

//FUNCTIONS
function updateStorage(){
  localStorage.setItem("ToDoList",JSON.stringify(DATA));
}
function getStorage(){
  if(localStorage.getItem("ToDoList")!=null){
    DATA=JSON.parse(localStorage.getItem("ToDoList"));
    return 1;
  }else{
    DATA=Array();
    return 0;
  }
  
}
function show(Data,ids=null) {
  hOL=document.getElementById("toDoListOL");
  if(Data==null){
    return;
  }
  while (hOL.firstChild) {
    hOL.removeChild(hOL.firstChild);
  }
  for (let index = 0; index < Data.length; index++) {
    li = document.createElement("li");
    pTaskDesc= document.createElement("p");
    pTaskDate= document.createElement("p");
    divTaskButtons=document.createElement("div");
    btnTaskRemove=document.createElement("button");
    
    //id and classes
    if(ids==null){
      li.id=index;
    }else{
      li.id=ids[index];
    }
    
    pTaskDesc.className="TaskDesc";
    pTaskDate.className="TaskDate";
    divTaskButtons.className="TaskButtons";

    btnTaskRemove.className="TaskRemove"
    //insert data

    pTaskDesc.appendChild(document.createTextNode(Data[index][0]))
    if(Data[index][1].length<1){
      pTaskDate.appendChild(document.createTextNode("Brak daty."))
    }else{pTaskDate.appendChild(document.createTextNode(Data[index][1]))}
    

    //EVENTS
    pTaskDesc.addEventListener("click",editDesc,{once:true});
    pTaskDate.addEventListener("click",editDate,{once:true});

    btnTaskRemove.addEventListener("click",remove,{once:true});

    // clean up
    divTaskButtons.appendChild(btnTaskRemove);
    li.appendChild(pTaskDesc);
    li.appendChild(pTaskDate);
    li.appendChild(divTaskButtons);
    //show
    hOL.appendChild(li)
  };
}
function editDesc(evt) {
  objDesc=evt.currentTarget;
  newInput=document.createElement("input");
  newInput.type="text";
  newInput.value=objDesc.innerHTML;
  newInput.maxlength=_maxLen;
  newInput.className="TaskInEdit";
  objDesc.replaceWith(newInput);
  newInput.focus();
  newInput.addEventListener("focusout",editDescSave,{once:true});

}
function editDescSave(evt){
  objDesc=evt.currentTarget;
  newObj=document.createElement("p");
  
  newObj.className="TaskDesc";
  
  newObj.addEventListener("click",editDesc,{once:true});
  id=objDesc.parentNode.id;
  if(objDesc.value.length>_minLen & objDesc.value.length<_maxLen){
    DATA[id][1]=objDesc.value;
    newObj.appendChild(document.createTextNode(objDesc.value));
    updateStorage();
  }else{
    newObj.appendChild(document.createTextNode(DATA[id][0]));
  }
  objDesc.replaceWith(newObj);
}
function editDate(evt) {
  objDesc=evt.currentTarget;
  newInput=document.createElement("input");
  newInput.type="date";
  if(newInput.value.length>0){
    newInput.value=objDesc.innerHTML;
  }
  newInput.className="TaskInEdit";
  objDesc.replaceWith(newInput);
  newInput.focus();
  newInput.addEventListener("focusout",editDateSave,{once:true});
}
function editDateSave(evt){
  objDesc=evt.currentTarget;
  newObj=document.createElement("p");
  id=objDesc.parentNode.id;
  if(objDesc.value.length>0 & new Date(objDesc.value)<new Date().setHours(0,0,0,0)){
    if(DATA[id][1].length>0){
    newObj.appendChild(document.createTextNode(DATA[id][1]));
    }else{
      newObj.appendChild(document.createTextNode("Brak daty."))
    }
  }else{
    if(objDesc.value.length>0){
      newObj.appendChild(document.createTextNode(objDesc.value));
    }else{
      newObj.appendChild(document.createTextNode("Brak daty."));
    }
    
    DATA[id][1]=objDesc.value;
    updateStorage();
  }
  newObj.className="TaskDate";
  objDesc.replaceWith(newObj);
  newObj.addEventListener("click",editDate,{once:true});
  
}
function add() {
  SEARCH.value="";
  taskDesc=document.getElementById("j_taskDesc");
  taskDate=document.getElementById("j_taskDate");
  if(taskDesc.value.length>2 & taskDesc.value.length<_maxLen){
    if(taskDate.value=="" | (new Date(taskDate.value)>new Date().setHours(0,0,0,0))){
    DATA.push([taskDesc.value,taskDate.value]);
    updateStorage();
    show(DATA);
    }
  }
}
function remove(evt){
  id=evt.currentTarget.parentNode.parentNode.id;

  DATA.splice(id,1);
  SEARCH.value="";
  show(DATA);
}

function find(str){
  let findStr=str.toLowerCase();
  let findLen=findStr.length;
  let outArray=Array();
  let ids=Array();
  let i=0;
  DATA.forEach(element => {
    check=element[0].toLowerCase();
    for (let index = 0; index < findLen; index++) {
      if(findStr.charAt(index)!=check.charAt(index)){
        break;
      }
      if(index+1>=findLen){
        outArray.push(element);
        ids.push(i);
      }
      
    }
    i++;
  });
  show(outArray,ids);
}

//EVENTS
const SEARCH=document.getElementById("search");
SEARCH.addEventListener('input', function(ev){
  if(SEARCH.value.length >_minLen){
    find(SEARCH.value);
  }else{
    show(DATA);
  }
});


const TASKADD=document.querySelector(".TaskAdd");
TASKADD.addEventListener('click',function(){add();});


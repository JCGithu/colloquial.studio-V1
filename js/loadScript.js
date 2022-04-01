async function loadScript(url){
  return new Promise((res, req)=>{
    console.log(`Script "${url}" loaded`);
    let newCode = document.createElement('script');  
    newCode.src = url;
    document.head.appendChild(newCode);
    newCode.onload = () => {
      res(true);
    }
  })

}
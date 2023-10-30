  // include HTML Code of other file in HTML code inside a div (asynchron, change content via JS possible)
  async function includeHTMLasync (){
    let includeElements = document.querySelectorAll('[w3-include-html]'); // get all Elements with attribut [w3-include-html]
    for (let i = 0; i < includeElements.length; i++) {
        let element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // get value of attribut w3-include-html of this element
        let response = await fetch(file); // load file and save HTML code in response
        if (response.ok) { // check if response is ok (file found)
            element.innerHTML = await response.text(); // change inner HTML of element to new HTML code
        } else {
            element.innerHTML = "Page not found."; // change inner HTML of element to "Page not found."
        }
    }
  }
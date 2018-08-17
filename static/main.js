
function escapeHTML(s) {
    return s.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

const submit = () => {
  var buttn = document.getElementById('btn');
  var flag = buttn.getAttribute("clicked");

  if( flag == "true") {
    var editorDoc = editor.getSession().getDocument();
    var lines = editorDoc.getAllLines();
    console.log(lines);
    lines = lines.join("\n");
    buttn.setAttribute("clicked", "false");
    buttn.innerText = 'next▶';

    var richtext = document.getElementById("richtext");


    fetch("/api/run?code=" + encodeURIComponent(lines), {
        headers : {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }

      })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        else {
          console.log("error")
        }
      })
      .then((mydata)=> {
          if(mydata == "no error!" || mydata == "Timed out!" || mydata == "timed out! you have an infinite loop!") {
            document.getElementById("traceback").innerHTML = '<pre class="result" id="results">' + mydata + '</pre>'
            richtext.textContent = "try again?";
            return
          }
          richtext.textContent = "we found an error! the traceback is on the right. keep clicking next to step through the traceback!";
          var output = '';
          console.log(mydata);
          for(var x = 0;x < mydata.length; x++) {
            output = output + '<div id="special" class="divs" ind=' + x + '><pre class="result" id="results">' + escapeHTML(mydata[x]) + '</pre></div>';
          }
          document.getElementById("traceback").innerHTML = output;
      })
  } else {
    var inde = buttn.getAttribute("curind");
    var lengthh = document.querySelectorAll('#traceback .divs').length;
    var divs = document.querySelectorAll('div[id="special"]');
    var richtext = document.getElementById("richtext");
    console.log(inde);
    if(inde == lengthh) {
      for(var i = 0; i < divs.length; i++) {
        if(i != parseInt(inde)) {
          divs[i].classList.remove('color');
        }
      }
      buttn.setAttribute("clicked", "true");
      buttn.innerText = 'run▶';
      buttn.setAttribute("curind", "0");
      richtext.textContent = "and that's all! try again?" //TODO: send line to backend
      return
    }

    richtext.textContent = divs[parseInt(inde)].firstChild.textContent; //TODO: send line to backend
    for(var i = 0; i < divs.length; i++) {
      if(i != parseInt(inde)) {
        divs[i].classList.remove('color');
      } else {
        divs[i].classList.add('color');
      }
    }


    var newinde = (parseInt(inde) + 1);
    buttn.setAttribute("curind", newinde.toString());
  }
}

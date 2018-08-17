
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
            return
          }
          var output = '';
          console.log(mydata);
          for(var x = 0;x < mydata.length; x++) {
            output = output + '<div><pre class="result" id="results"><code>' + escapeHTML(mydata[x]) + '</code></pre></div>';
          }
          document.getElementById("traceback").innerHTML = output;
      })
  } else {

  }
}

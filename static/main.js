
function escapeHTML(s) {
    return s.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

var Range = require("ace/range").Range // not the window Range!!
var _range

setMarker = function(position) {

    if(_range != null) {
        editor.session.removeMarker(_range.id);
    }

    _range = new Range(position, 0, position, 1);

    _range.id = editor.session.addMarker(
        _range, "myMarker", "fullLine"
    );
}

reset = function() {
  if(_range != null) {
    editor.session.removeMarker(_range.id);
  }
}

finish = function(buttn, richtext) {
  buttn.setAttribute("clicked", "true");
  buttn.innerText = 'run▶';
  buttn.setAttribute("curind", "0");
  richtext.textContent = "and that's all! try again?";
  document.getElementById("traceback").innerHTML = "";
}

highlight = function(divs, inde) {
  for(var i = 0; i < divs.length; i++) {
    if(i != parseInt(inde)) {
      divs[i].classList.remove('color');
    } else {
      divs[i].classList.add('color');
    }
  }
}

const submit = () => {
  var buttn = document.getElementById('btn');
  var flag = buttn.getAttribute("clicked");
  if( flag == "reqing") {
    return
  }

  if( flag == "true") {
    var editorDoc = editor.getSession().getDocument();
    var lines = editorDoc.getAllLines();
    console.log(lines);
    lines = lines.join("\n");
    buttn.setAttribute("clicked", "reqing");
    buttn.innerText = 'RUNNING';

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
          buttn.setAttribute("clicked", "false");
          buttn.innerText = 'next▶';


          if(mydata == "no error!" || mydata == "timed out! you have an infinite loop!") {
            document.getElementById("traceback").innerHTML = '<pre class="result" id="results">' + mydata + '</pre>';
            richtext.textContent = "either you had no error, or your code timed out...";
            buttn.setAttribute("syn", "none");
            return
          }
          richtext.textContent = "we found an error! the traceback is on the right. keep clicking next to step through the traceback!";
          var output = '';
          console.log(mydata);
          buttn.setAttribute("syn", mydata[0]);
          for(var x = 1;x < mydata.length; x++) {
            output = output + '<div id="special" class="divs" ind=' + x + '><pre class="result" id="results">' + escapeHTML(mydata[x]) + '</pre></div>';
          }
          document.getElementById("traceback").innerHTML = output;
      })
  } else {
    var inde = buttn.getAttribute("curind");
    console.log(inde);
    var lengthh = document.querySelectorAll('#traceback .divs').length;
    var divs = document.querySelectorAll('div[id="special"]');
    var richtext = document.getElementById("richtext");
    var synstatus = buttn.getAttribute("syn");

    if(synstatus == "syn") { //syntax error
      if(inde == "1") {
        reset()
        finish(buttn, richtext)
      } else {
        buttn.setAttribute("curind", "1");
        var line = divs[1].firstChild.textContent.split(',')[1]
        var indexx = parseInt(line.substr(6));
        setMarker(indexx - 1);
        highlight(divs, 1)
        richtext.textContent = "you have a syntax error: that means that python wasn't able to run your code \
        because you aren't using the correct syntax. Kind of like a typo in an essay. The \" ^ \" tells you \
         where in the line python thinks you made a mistake. If you're 100% sure the highlighted line doesn't \
          have a mistake, look in the lines directly above and below it.";
      }
    } else if(synstatus == "sta") { //stack trace!
      console.log(inde);

      var newinde = (parseInt(inde) + 1);
      buttn.setAttribute("curind", newinde.toString());

     if(inde == 0) {
        richtext.textContent = "The \"traceback\" is a chain of function calls, leading up \r\n \
        to the error. \"most recent call last\" means that this chain starts from the first function call \
        and ends with the function call causing the error. "
        highlight(divs, inde)
        return
      }
      else if(inde == 1) {
      richtext.textContent = divs[parseInt(inde)].firstChild.textContent; //TODO: send line to backend
      highlight(divs, inde)
        return
      }
      else if( inde == lengthh - 1) {
          //do something special
          highlight(divs, inde);
          richtext.textContent = "<text from server>" //TODO: backend
          return
      }
      else if(inde == lengthh) {
        reset()
        for(var i = 0; i < divs.length; i++) {
          if(i != parseInt(inde)) {
            divs[i].classList.remove('color');
          }
        }
        finish(buttn, richtext)
        return
      }
      if(inde % 2 == 1) {
        var line = divs[parseInt(inde)].firstChild.textContent.split(',')[1]
        var indexx = parseInt(line.substr(6));
        setMarker(indexx - 1);

        richtext.textContent = divs[parseInt(inde)].firstChild.textContent; //TODO: send line to backend
        highlight(divs, inde)
      } else {
        richtext.textContent = divs[parseInt(inde)].firstChild.textContent; //TODO: send line to backend
        highlight(divs, inde)
      }

    } else { //nothing was ran
          reset()
          finish(buttn, richtext)
          richtext.textContent = "try again?";
    }

  }
}

function codepad_load_editor(callback) {
  console.log("loading editor...");
  var js_libs = [
    "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.9/ace.js",
    "https://cdnjs.cloudflare.com/ajax/libs/split.js/1.5.10/split.min.js"
  ];

  dynload_multiple(js_libs, function () {
    console.log("editor loaded");

    EditSession = require("ace/edit_session").EditSession;
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/tomorrow_night_eighties");
    //editor.session.setMode("ace/mode/lua");

    // Setup panel splitters
    Split(["#pane-information", "#pane-game"], {
      sizes: [30, 70]
    });

    Split(["#pane-editor", "#pane-canvas"], {
      direction: "vertical",
      onDrag: function () {
        fix_canvas_size();
      }
    });

    if (callback) {
      callback();
    }
  });
}

function codepad_create_edit_sessions(scene) {
    var files_div = document.getElementById("files");
    files_div.innerHTML = "";
  
    var script_icon = document.getElementById("icon-script");
    script_icon = script_icon.innerHTML;
  
    var new_buttons = "";
    for (var i = 0; i < scene.scripts.length; i++) {
      var radio_id = "file_" + (i + 1);
      var src_data = scene.scripts[i].code;
      if (!src_data) {
        src_data = default_script;
      }
      if (codepad_shared_sources[i] !== undefined) {
        src_data = codepad_shared_sources[i];
      }
      var saved_script = localStorage.getItem(
        generate_local_storage_key("_script_" + (i + 1))
      );
      if (saved_script !== null) {
        src_data = saved_script;
      }
  
      var file_session = new EditSession(src_data);
      file_session.setMode("ace/mode/lua");
      codepad_sessions[i] = file_session;
      var checked = "";
      if (
        i == 0 &&
        !localStorage.getItem(generate_local_storage_key("_open_script"))
      ) {
        checked = " checked";
        editor.setSession(file_session);
      } else if (
        localStorage.getItem(generate_local_storage_key("_open_script")) == i
      ) {
        checked = " checked";
        editor.setSession(file_session);
      }
      var new_file_button =
        '<input type="radio" onchange="codepad_change_file()" id="' +
        radio_id +
        '" name="current_file" value="' +
        radio_id +
        '"' +
        checked +
        '><label for="' +
        radio_id +
        '">' +
        script_icon +
        scene.scripts[i].name +
        "</label>";
      new_buttons = new_buttons + new_file_button;
    }
    files_div.innerHTML = new_buttons;
    window.onkeydown = function () {
      save_scripts();
    };
  }
  
  function generate_local_storage_key(name) {
    return document.title + codepad_get_scene() + name;
  }
  
  function save_scripts() {
    setTimeout(function () {
      for (var i = 0; i < codepad_sessions.length; i++) {
        var code = codepad_get_code(i + 1);
        var key = generate_local_storage_key("_script_" + (i + 1));
        localStorage.setItem(key, code);
      }
    }, 500);
  }

  function codepad_change_file() {
    var file_tabs = document.getElementsByName("current_file");
  
    for (var i = 0, length = file_tabs.length; i < length; i++) {
      if (file_tabs[i].checked) {
        editor.setSession(codepad_sessions[i]);
        localStorage.setItem(generate_local_storage_key("_open_script"), i);
        break;
      }
    }
  }

  function codepad_change_info_tab() {
    var info_tabs = document.getElementsByName("information_tab");
  
    for (var i = 0, length = info_tabs.length; i < length; i++) {
      if (info_tabs[i].checked) {
        var instructions_elem = document.getElementById("instructions");
        var console_elem = document.getElementById("console");
        var wrap_elem = document.getElementById("info-wrap");
        var reset_console_elem = document.getElementById("reset-console");
  
        if (info_tabs[i].id == "instruction_tab") {
          localStorage.setItem(
            generate_local_storage_key("_console_scroll_position"),
            wrap_elem.scrollTop
          );
          instructions_elem.hidden = false;
          console_elem.hidden = true;
          reset_console_elem.hidden = true
          wrap_elem.scrollTop = localStorage.getItem(
            generate_local_storage_key("instruction_scroll_position")
          );
        } else if (info_tabs[i].id == "console_tab") {
          localStorage.setItem(
            generate_local_storage_key("instruction_scroll_position"),
            wrap_elem.scrollTop
          );
          instructions_elem.hidden = true;
          console_elem.hidden = false;
          reset_console_elem.hidden = false;
          wrap_elem.scrollTop = localStorage.getItem(
            generate_local_storage_key("_console_scroll_position")
          );
        }
      }
    }
  }

  function codepad_reset_script() {
    var file_tabs = document.getElementsByName("current_file");
  
    for (var i = 0, length = file_tabs.length; i < length; i++) {
      if (file_tabs[i].checked) {
        var key = generate_local_storage_key("_script_" + (i + 1));
        localStorage.removeItem(key);
        codepad_change_scene();
        break;
      }
    }
  }
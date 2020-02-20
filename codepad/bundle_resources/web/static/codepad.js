/*jshint esversion: 6 */

var EditSession = undefined;
var editor = undefined;

// EditSessions per file
var codepad_sessions = [];

// file sources provided in URL
var codepad_shared_sources = [];

// all available scenes
var scenes = [];

var default_script = `function init(self)

end

function final(self)

end

function update(self, dt)

end

function on_message(self, message_id, message, sender)

end

function on_input(self, action_id, action)

end

function on_reload(self)

end`;

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

function codepad_load_engine(
  defold_archive_location_prefix,
  defold_archive_location_suffix,
  defold_binary_prefix
) {
  var extra_params = {
    archive_location_filter: function (path) {
      return (
        defold_archive_location_prefix + path + defold_archive_location_suffix
      );
    },

    engine_arguments: ["--verify-graphics-calls=false"],

    splash_image: "splash_image.png",
    custom_heap_size: 268435456
  };

  var splash = document.getElementById("splash");
  Progress = {
    progress_id: "defold-progress",
    bar_id: "defold-progress-bar",
    label_id: "defold-progress-label",

    addProgress: function (canvas) {
      splash.innerHTML =
        '<div id="defold-progress-wrap"><div id="' +
        Progress.label_id +
        '"></div><div id="' +
        Progress.progress_id +
        '"><div id="' +
        Progress.bar_id +
        '" style="width: 0%;"></div></div></div>';
      Progress.bar = document.getElementById(Progress.bar_id);
      Progress.progress = document.getElementById(Progress.progress_id);
      Progress.label = document.getElementById(Progress.label_id);
    },

    updateProgress: function (percentage, text) {
      Progress.bar.style.width = percentage + "%";

      text = typeof text === "undefined" ? Math.round(percentage) + "%" : text;
      Progress.label.innerText = text;
    },

    removeProgress: function () {
      if (Progress.progress.parentElement !== null) {
        splash.remove();
      }
      fix_canvas_size();
    }
  };

  // Run engine
  Module.onRuntimeInitialized = function () {
    Module.runApp("canvas", extra_params);
  };

  Module.locateFile = function (path, scriptDirectory) {
    // dmengine*.wasm is hardcoded in the built JS loader for WASM,
    // we need to replace it here with the correct project name.
    if (
      path == "dmengine.wasm" ||
      path == "dmengine_release.wasm" ||
      path == "dmengine_headless.wasm"
    ) {
      path = defold_binary_prefix + ".wasm";
    }
    return scriptDirectory + path;
  };

  var engineJS = document.createElement("script");
  engineJS.type = "text/javascript";
  if (Module.isWASMSupported) {
    engineJS.src = defold_binary_prefix + "_wasm.js";
  } else {
    engineJS.src = defold_binary_prefix + "_asm.js";
  }
  document.head.appendChild(engineJS);
  fix_canvas_size();
}

function codepad_get_scene() {
  var scenes_elem = document.getElementById("scene");
  return scenes_elem.options[scenes_elem.selectedIndex].value;
}

function codepad_get_scene_object(scene_id)
 {
     for (var i=0; i < scenes.length; i++)
     {
         var scene = scenes[i];
         if (scene.id == scene_id)
         {
             return scene
         }
     }
 }

  function codepad_get_scene_name(scene_id)
 {
     return codepad_get_scene_object(scene_id).name;
 }

  function codepad_get_scripts(scene_id)
 {
     return codepad_get_scene_object(scene_id).scripts;
 }

// Set selected scene in the html drop down
function codepad_set_selected_scene(scene_id) {
  var scenes_elem = document.getElementById("scene");
  var scene_options = scenes_elem.options;
  for (var option, i = 0; option = scene_options[i]; i++) {
    if (option.value == scene_id) {
      scenes_elem.selectedIndex = i;
      break;
    }
  }
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

function codepad_create_edit_sessions_from_shared_sources(scene) {
  for (var i = 0; i < scene.scripts.length; i++) {
    codepad_sessions[i] = codepad_shared_sources[i];
  }
}

function codepad_fetch_instructions(instructions_elem) {
  var scene_id = codepad_get_scene().substring(1);

  if (location.hostname == "localhost") {
    var file = "/html5/static/" + scene_id + "_instructions.md";
  } else {
    var file =
      window.location.href + "/static/" + scene_id + "_instructions.md";
  }

  fetch(file).then(function (response) {
    return response.text().then(function (text) {
      var converter = new showdown.Converter(),
        html = converter.makeHtml(text);

      instructions_elem.innerHTML = html;
    });
  });
}

function init_instructions() {
  var instructions_elem = document.getElementById("instructions");
  if (instructions_elem) {
    codepad_fetch_instructions(instructions_elem);
  }
}

// If the function is called without the argument scene_id set,
// scene_id will be read from html drop down instead
function codepad_change_scene(scene_id) {
  if (scene_id === undefined) {
    scene_id = codepad_get_scene();
  } else {
    // compensate for scene_id automatically getting an # added at the start
    scene_id = '#' + scene_id
    codepad_set_selected_scene(scene_id);
  }

  codepad_should_change_scene = true;
  for (var i = 0; i < scenes.length; i++) {
    var scene = scenes[i];
    if (scene.id == scene_id) {
      codepad_sessions = [];
      if (EditSession !== undefined) {
        codepad_create_edit_sessions(scene);
      } else {
        codepad_create_edit_sessions_from_shared_sources(scene);
      }
      init_instructions();
      break;
    }
  }
  codepad_change_info_tab();
}

function codepad_ready(scenes_json) {
  scenes = JSON.parse(unescape(scenes_json));
  var scenes_elem = document.getElementById("scene");
  for (var i = 0; i < scenes.length; i++) {
    var option = document.createElement("option");
    option.value = scenes[i].id;
    option.text = scenes[i].name;
    scenes_elem.appendChild(option);
  }
  codepad_trigger_url_check();
  codepad_change_scene();
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

var console_text = "";

function codepad_update_console(text) {
  console_text = text;

  var console_elem = document.getElementById("console");
  if (console_elem) {
    console_elem.innerHTML = console_text;
  }
}

function codepad_reset_console() {
  resetted_text = "";
  codepad_update_console(resetted_text);
  codepad_should_reset_console = true;
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

function codepad_reload() {
  codepad_should_reload = true;
}

function codepad_restart() {
  codepad_should_restart = true;
}

function codepad_get_code(i) {
  if (codepad_sessions[i - 1]) {
    if (EditSession !== undefined) {
      return codepad_sessions[i - 1].getDocument().getValue();
    } else {
      return codepad_sessions[i - 1];
    }
  }
  return "";
}

 function deparam (querystring) {
  // remove any preceding url and split
  querystring = querystring.substring(querystring.indexOf("?") + 1).split("&");
  var params = {},
    pair,
    d = decodeURIComponent;
  // march and parse
  for (var i = querystring.length - 1; i >= 0; i--) {
    pair = querystring[i].split("=");
    params[d(pair[0])] = d(pair[1] || "");
  }

  return params;
};

// handle url and shared data
function codepad_trigger_url_check() {
  var codepad_params = deparam(window.location.hash);
  if (codepad_params.c !== undefined) {
    // Change scene
    var scenes_elem = document.getElementById("scene");
    for (var i = 0; i < scenes_elem.options.length; i++) {
      if (scenes_elem.options[i].value == codepad_params.c) {
        scenes_elem.selectedIndex = i;
        break;
      }
    }

    for (var key in codepad_params) {
      if (codepad_params.hasOwnProperty(key)) {
        if (key.charAt(0) == "s") {
          var src_index = key.substr(1);
          src_index = parseInt(src_index);
          codepad_shared_sources[src_index - 1] = LZString.decompressFromBase64(
            codepad_params[key]
          );
        }
      }
    }
  }
}

function codepad_share() {
  var share_url = "?c=" + codepad_get_scene();
  for (var i = 0; i < codepad_sessions.length; i++) {
    var compressed_code = LZString.compressToBase64(codepad_get_code(i + 1));
    compressed_code = "&s" + (i + 1) + "=" + compressed_code;
    share_url = share_url + compressed_code;
  }

  window.location.hash = share_url;
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

/**
  * Called when the user has chosen to save the current codepad contents. This
  * will create a zip and start a download.
  */
 function codepad_save() {
  var scene_id = codepad_get_scene();
  var scene_name = codepad_get_scene_name(scene_id);
  var scripts = codepad_get_scripts(scene_id);

   var zip_filename = scene_name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

   var zip = new JSZip();
  var dir = zip.folder(zip_filename);
  for (var i=0; i < scripts.length; i++)
  {
      var filename = scripts[i].name;
      var code = codepad_get_code(i+1);
      dir.file(filename, code);
  }

   zip.generateAsync({type:"blob"})
  .then(function(content) {
      saveAs(content, zip_filename);
  });
}

codepad_should_reload = false;
codepad_should_restart = false;
codepad_should_change_scene = true;
codepad_should_reset_console = false;

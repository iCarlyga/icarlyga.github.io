var sendToFriend = {
    live_host: 'http://www.icarly.ga',
    
    close_window_delay: 4000,
    container: 'form',
    form: document.forms[0],
    date_input: 'date',
    template_url: '/emails/sendtofriend.html',
    initial_input: 'from_name',
    button: '#go',
    dialog: '#sent_messages',
    success: '#sent_messages .success',
    failure: '#sent_messages .failure',
    cover: '#sent_cover',
    
    beta_server: 'http://beta.tmail.icarly.com/send',
    prod_server: 'http://tmail.icarly.com/send',
    
        
    // for client-side validation
    errors: {   
      container: '#messages',   
      from_name: {
        kind: 'name',
        initial_value: 'your first name',
        display: '.invalid_from'
      },
      to_name: {
        kind: 'name',
        initial_value: 'your friendâ€™s first name',
        display: '.invalid_to'
      },
      to_email: {
        kind: 'email', 
        initial_value: 'your friendâ€™s email',
        display: '.invalid_email'
      }
    },
    

    init: function () {},
    setInputs: function () {},
    setFormAction: function () {},
    setTime: function () {},
    setAssetData: function () {},
    makePathsAbsolute: function () {},
    validate: function () {},
    funky_confirm: function () {},
    server_fail: function () {},
    submit: function () {}
  }

  $(document).ready(function () {
    sendToFriend.init()
  })

  sendToFriend.init = function () {
    this.setInputs()
    $('body').keypress( function(){ return sendToFriend.disableEnterSubmit() })
    this.setDate()
    sendToFriend.server = findIfBeta() ? sendToFriend.beta_server : sendToFriend.prod_server
    this.setFormAction()
    this.setAssetData()
    this.setTemplateUrl()
    testServer(sendToFriend.server)
  }
  
  sendToFriend.setTemplateUrl = function() {
    sendToFriend.form.turl.value = 'http://' + window.location.host + sendToFriend.template_url
  }
  
  sendToFriend.setInputs = function () {
    $('input').attr('onFocus', 'this.select()')
    var firstInput = sendToFriend.form[sendToFriend.initial_input]
    firstInput.focus()
    firstInput.select()
  }
  
  sendToFriend.disableEnterSubmit = function (e) {
    var key = 0;     
    if(window.event)
      key = window.event.keyCode
    else {
      e = e ||  {}
      if (e.which)
        key = e.which   
    }
    return (key != 13);
  }

  sendToFriend.setFormAction = function () {
    $(sendToFriend.button).click( function() {
       sendToFriend.submit() 
    })
    
    sendToFriend.form.action = sendToFriend.server
    //sendToFriend.form.onsubmit = sendToFriend.submit    
  }

  sendToFriend.setAssetData = function () {
    if (!window.asset_url) setTimeout('sendToFriend.setAssetData()', 200)
    else {
      sendToFriend.form['asset_url'].value = window.asset_url || ''
      sendToFriend.form['asset_type'].value = window.asset_type || ''
      sendToFriend.form['asset_caption'].value = window.asset_caption || ''
      sendToFriend.makePathsAbsolute()
    }
  }
      
  sendToFriend.makePathsAbsolute = function() {
    var fields = [ sendToFriend.form['asset_url'] ]
    for (var id in fields) {
      uri = fields[id].value
      if (uri.indexOf(sendToFriend.live_host) === -1) {
        fields[id].value = 'http://' + window.location.host + uri
      } else {
        fields[id].value = uri.replace(sendToFriend.live_host, 'http://' + window.location.host)
      }
    }
  }
      
  sendToFriend.submit = function () {
    //alert('submitting')
    if (sendToFriend.validate()) {
      if (testServer.flag) {
        window.onunload = function() {
          window.close() }
        sendToFriend.funkyConfirm()
        setTimeout('sendToFriend.form.submit()', sendToFriend.close_window_delay)
        // make sure the window closes in IE
        //setTimeout('window.close()', sendToFriend.close_window_delay + 50)
      } else {
        sendToFriend.server_fail()
      }
    } else return false  
    return true
  }
  
  sendToFriend.server_fail = function () {
    $(sendToFriend.dialog).show()
    $(sendToFriend.failure).show()
    $(sendToFriend.container).hide()
  }  
  
  sendToFriend.funkyConfirm = function () {
    $(sendToFriend.dialog).show()
    $(sendToFriend.cover).show()
    $(sendToFriend.success).show('fast')
    $(sendToFriend.container).hide()
  }

  
  sendToFriend.validate = function () {
    var valid = true
    if ((sendToFriend.errors) && (sendToFriend.errors.container))
        $(sendToFriend.errors.container + ' > *').hide()
    
    for (var e in sendToFriend.errors) {
      var error = sendToFriend.errors[e]
      //alert(error.kind)
      var field = sendToFriend.form[e]
      //alert(field)
      if (error.kind == 'string') {
        if ((field.value.length < 1) || (field.value == error.initial_value)) {
          $(sendToFriend.errors.container + ' ' + error.display).show()
          valid = false
        } 
      } else if (error.kind == 'email') {
        if (checkMail(field.value) == false) {
          $(sendToFriend.errors.container + ' ' + error.display).show()
          valid = false 
        }
      } else if (error.kind == 'name') {
        if ((field.value.length < 1) || (field.value == error.initial_value) || 
        (field.value.indexOf(' ') != -1)) {
          $(sendToFriend.errors.container + ' ' + error.display).show()
          valid = false
        }
      }
    }
    return valid
  }
      
  sendToFriend.setDate = function () {
    sendToFriend.form[sendToFriend.date_input].value = getFormattedDate()
  }
  
  // Utils
  
  function getFormattedDate() {
    // make an array with date and time info from native Date function
    date_array = ('' + Date()).split(' ')
    // add a comma after the weekday
    date_array[0] += ','
    // switch order of day and month
    var day = date_array[2]
    date_array[2] = date_array[1]
    date_array[1] = day
    // add time zones in a way Microsoft Internet Explorer will understand
    date_array[5] = new Date().getTimezoneOffset() * -100/60 
    // remove name of timezone, for example (EST)
    if (date_array[6]) date_array.pop()    
    // assemble date array into a date string
    var date_str = ''
    for (var i in date_array)
      date_str += date_array[i] + ' '
    //remove trailing space
    date_str = date_str.substr(0, date_str.length-1) 
    return date_str
  }
    
  function findIfBeta() {
    // return true or false if ".beta." is in url
    return (('' + window.location).indexOf('beta.') !== -1)
  }
   
  function checkMail(email){
    var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(email)) {
      return true;
    }
    return false;
  } 
  
  var testServer = function(url) {
    testServer.flag = false;
    function callback(){
      if (request.readyState == 4) {
        if (request.status != 404)
          testServer.flag = true;
        //alert('server status : ' + request.status)
      }
    }
    // Test the server with a get request, catch permission denied errors
    try {
      var request = $.get(url, {}, callback);
    } catch(err) {
      //alert('get request error : ' + err.code + err.message)
      testServer.error = err.message;
      if (err.code != 404)
        testServer.flag = true;
      return;
    }
    request.onreadystatechange = callback;
  }
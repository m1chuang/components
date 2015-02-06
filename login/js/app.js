


function inputDetect () {
               $("#scrptRunBtn").text ("Script has been run.");
               var inpsToMonitor = document.querySelectorAll (
                   "form[name='user'] input[name^='inp']"
               );
               for (var J = inpsToMonitor.length - 1;  J >= 0;  --J) {
                   inpsToMonitor[J].addEventListener ("change",    adjustStyling, false);
                   inpsToMonitor[J].addEventListener ("keyup",     adjustStyling, false);
                   inpsToMonitor[J].addEventListener ("focus",     adjustStyling, false);
                   inpsToMonitor[J].addEventListener ("blur",      adjustStyling, false);
                   inpsToMonitor[J].addEventListener ("mousedown", adjustStyling, false);
                   //-- Initial update. note that IE support is NOT needed.
                   var evt = document.createEvent ("HTMLEvents");
                   evt.initEvent ("change", false, true);
                   inpsToMonitor[J].dispatchEvent (evt);
               }
           };

           function adjustStyling (zEvent) {
               var inpVal  = zEvent.target.value;
               var e;
               if (inpVal  &&  inpVal.replace (/^\s+|\s+$/g, "") ){
                   e = zEvent.target.parentNode.getElementsByClassName('placeHold')[0];
                   if(e.className.indexOf('lock') == -1){
                     e.className = e.className + " lock";
                   }

               }else{
                   e = zEvent.target.parentNode.getElementsByClassName('placeHold')[0];
                   e.className = "placeHold";
               }
           };

 var AccountPanel = Backbone.View.extend({

          events: {
               "click form#login button#login" : "doLogin",
               "click form#login a.forgot": "showForgot",
               "click form#login a.register": "showRegister",

               "click form#register button#register" : "doRegister",

               "click form#reset button#sendEmail" : "doSendEmail",
               "click form#reset button#checkToken" : "doCheckToken",
               "click form#reset button#resetPwd" : "doResetPwd",

               "click a.showLogin" : "showLogin",
          },
          initialize: function(){
            console.log('AccountPanel has been initialized.');
             //_.bindAll(this, 'render');
             inputDetect();
            this.render();
          },
          template: _.template( $("#account-template").html()),

          render: function() {
            this.$el.html( this.template({
               logoImg:"",
               logoText:'BETA',
               footer:""
            }));
            return this;
          },
          doLogin: function( evt ) {
              $.ajax({
                type: "POST",
                url: "http://127.0.0.1:4000/api/v01/user/login",
                data: {
                  email:$('form#login').find( "input[name='inp-email']" ).val(),
                  password:$('form#login').find( "input[name='inp-pwd']" ).val()
                },
                success:function(ret){
                  window.localStorage.setItem('sessinToken', ret);
                  alert(window.localStorage.getItem('sessinToken'));
                }
              });
              evt.preventDefault( );
          },
          showLogin:function(evt){
            $('form#login').css('display','block');
            $('form#register').css('display','none');
            $('form#reset').css('display','none');
          },
          showForgot: function( evt ) {
              alert('forgot attempt');
              $('form#reset').css('display','block');
              $('form#login').css('display','none');
              $('form#register').css('display','none');
          },
          showRegister: function(evt){

              $('form#register').css('display','block');
              $('form#login').css('display','none');
              $('form#reset').css('display','none');
          },
          doRegister: function( evt ) {
              alert('submit registration attempt');
              var $f = $('form#register');
              $.ajax({
                type: "POST",
                url: "http://127.0.0.1:4000/api/v01/user",
                data: {
                  first_name:$f.find( "input[name='inp-fname']" ).val(),
                  last_name:$f.find( "input[name='inp-lname']" ).val(),
                  username:$f.find( "input[name='inp-uname']" ).val(),
                  email:$f.find( "input[name='inp-email']" ).val(),
                  password:$f.find( "input[name='inp-pwd']" ).val()
                },
                success:function(ret){
                  //window.localStorage.setItem('sessinToken', ret);
                  alert(ret);
                }
              });
              evt.preventDefault( );
          },
          doSendEmail: function( evt ) {
               //action
              $('form#reset .reset-step-1').css('display','none');
              $('form#reset .reset-step-2').css('display','block');
              evt.preventDefault( );
          },
          doCheckToken: function( evt ) {
            //action
              $('form#reset .reset-step-2').css('display','none');
              $('form#reset .reset-step-3').css('display','block');
              evt.preventDefault( );
          },
          doResetPwd: function( evt ) {
            //action
              $('form#reset .reset-step-3').css('display','none');
              $('form#reset .reset-success').css('display','block');
              evt.preventDefault( );
          },
      });

  $(function() {
     console.log('app start');
        var accountPanel = new AccountPanel();
        accountPanel.setElement( $( "#view-1" ) );
        accountPanel.render( );
        $('#view-1').append(accountPanel.$el);

      });

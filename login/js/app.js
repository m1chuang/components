

 var LoginPanel = Backbone.View.extend({

          events: {
              "click button#login" : "login",
              "click a.forgot": "forgot",
              "click a.register": "register",
          },
          initialize: function(){
            console.log('LoginPanel has been initialized.');
             _.bindAll(this, 'render', 'login');
            this.render();
          },
          template: _.template( $("#loginPanel-template").html()),

          render: function() {
            this.$el.html( this.template );
            return this;
          },
          login: function( evt ) {
              var data = {
                email:$('form#login').find( "input[name='inp-email']" ).val(),
                password:$('form#login').find( "input[name='inp-pwd']" ).val()
              }
              alert('login attempt..');
              $.ajax({
                type: "POST",
                url: "http://127.0.0.1:4000/api/v01/user/login",
                data: data,
                success:function(ret){
                  window.localStorage.setItem('sessinToken', ret);
                  alert(window.localStorage.getItem('sessinToken'));
                  $.ajaxSend(function(event, request) {
                     var token = window.localStorage.getItem('sessinToken');//App.getAuthToken();
                     if (token) {
                        request.setRequestHeader("token", token);
                     }
                  });
                }
              });
              evt.preventDefault( );
          },
          forgot: function( evt ) {
              alert('forgot attempt');
          },
          register: function(evt){

              $('.registerPanel').css('display','block');
              $('.loginPanel').css('display','none');
          }
      });
        var RegisterPanel = Backbone.View.extend({
          events: {
              "click button#register" : "register",
              "click a.login" : "login",
          },
          initialize: function(){
            console.log('RegisterPanel has been initialized.');
             _.bindAll(this, 'render', 'register');
            this.render();
          },
          template: _.template( $("#register-template").html()),
          render: function() {
            this.$el.html( this.template );
            return this;
          },
          register: function( evt ) {
              alert('submit registration attempt');
              var data = {
                first_name:$('form#register').find( "input[name='inp-fname']" ).val(),
                last_name:$('form#register').find( "input[name='inp-lname']" ).val(),
                username:$('form#register').find( "input[name='inp-uname']" ).val(),
                email:$('form#register').find( "input[name='inp-email']" ).val(),
                password:$('form#register').find( "input[name='inp-pwd']" ).val()
              }
              $.ajax({
                type: "POST",
                url: "http://127.0.0.1:4000/api/v01/user",
                data: data,
                success:function(ret){
                  //window.localStorage.setItem('sessinToken', ret);
                  alert(ret);
                }
              });
              evt.preventDefault( );
          },
          login:function(evt){
            $('.loginPanel').css('display','block');
            $('.registerPanel').css('display','none');
          }
      });





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
                e.className = e.className + " lock";
            }else{
                e = zEvent.target.parentNode.getElementsByClassName('placeHold')[0];
                e.className = "placeHold";
            }
        };

$(function( ) {
        //Backbone.Component.initialize( { "namespace" : Example } );

        console.log('app start');
        var login = new LoginPanel();
        login.setElement( $( "#view-1" ) );
        login.render( );
        $('#view-1').append(login.$el);
        var register = new RegisterPanel();
        register.setElement( $( "#view-2" ) );
        register.render( );
        $('#view-2').append(register.$el);
        inputDetect();
      });
